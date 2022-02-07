require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtGen = require("./utils/jwtGen");
const pool = require("./db");
const port = process.env.PORT || 5003;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//register
app.post("/register", (req, res) => {
  const data = req.body.data;
  const passHash = bcrypt.hashSync(data.pass, 10);
  pool.query(
    `INSERT INTO Pharmacist VALUES ("${data.name}", "${data.email}", "${data.address}", "${data.mobile}", "${data.date}", "${passHash}");`,
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
