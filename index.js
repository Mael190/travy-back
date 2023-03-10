const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const db = require("./models");


const app = express();
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
});