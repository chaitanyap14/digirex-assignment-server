require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtGen = require("./utils/jwtGen");
const pool = require("./db");
const port = process.env.PORT || 5003;

app.enable("trust proxy");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

pool.connect((err, client, done) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DATABASE CONNECTED");
  }
});

//auth
app.post("/auth", (req, res) => {
  const token = req.body.token;
  try {
    const userdata = jwt.verify(token, process.env.JWT_SECRET);
    res.send({ userdata, status: true });
  } catch (e) {
    console.log(e);
    res.send({ status: false });
  }
});

//login
app.post("/login", (req, res) => {
  const data = req.body.data;
  try {
    pool.query(
      `SELECT * FROM userinfo WHERE user_email='${data.email}';`,
      (error, results) => {
        if (error) {
          console.log(error);
          res.send({ status: false });
        } else {
          if (results.rows.length === 0) {
            res.send({ status: false });
          } else {
            console.log(results);
            const status = bcrypt.compareSync(
              data.pass,
              results.rows[0].user_pass
            );
            if (status) {
              res.cookie(
                "jwt_token",
                jwtGen(results.rows[0].user_name, results.rows[0].user_email),
                { expiresIn: "1h", httpOnly: false }
              );
              res.cookie("medrec_user", data.email, {
                expiresIn: "1h",
                httpOnly: false,
                secure: req.protocol,
              });
              res.send({
                status: true,
              });
            } else {
              res.send({ status: false });
            }
          }
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.send({ status: false });
  }
});

//register
app.post("/register", (req, res) => {
  const data = req.body.data;
  const passHash = bcrypt.hashSync(data.pass, 10);
  pool.query(
    `INSERT INTO Userinfo(user_name, user_email, user_phone, user_dob, user_pass)VALUES('${data.name}', '${data.email}', '${data.mobile}', '${data.date}', '${passHash}');`,
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ status: false });
      } else {
        res.send({ status: true });
      }
    }
  );
});

//account
app.post("/account", (req, res) => {
  const email = req.body.email;
  pool.query(
    `SELECT * from Userinfo where user_email='${email}';`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        res.send({ result: results.rows[0] });
      }
    }
  );
});

//update
app.post("/update", (req, res) => {
  const data = req.body.data;
  const passHash = bcrypt.hashSync(data.pass, 10);
  pool.query(
    `UPDATE Userinfo SET user_name='${data.name}', user_email='${data.email}', user_phone='${data.mobile}', user_pass='${passHash}' WHERE user_email='${data.medrecuser}';`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send({ status: false });
      } else {
        res.send({ status: true });
      }
    }
  );
});

//deleteacc
app.post("/deleteacc", (req, res) => {
  const email = req.body.email;
  pool.query(
    `DELETE from Userinfo where user_email='${email}';`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send({ status: false });
      } else {
        res.send({ status: true });
      }
    }
  );
});

//records
app.post("/records", (req, res) => {
  const email = req.body.email;
  pool.query(
    `SELECT * from record where user_email='${email}';`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        res.send({ records: results.rows });
      }
    }
  );
});

//addrecord
app.post("/addrecord", (req, res) => {
  const data = req.body.data;
  pool.query(
    `INSERT INTO Record(record_name, record_start, record_end, record_notes, user_email)VALUES('${data.name}', '${data.start}', '${data.end}', '${data.notes}', '${data.email}');`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send({ status: false });
      } else {
        res.send({ status: true });
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
