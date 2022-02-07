const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGen = (name, email) => {
  return jwt.sign(
    {
      data: {
        name,
        email,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = jwtGen;
