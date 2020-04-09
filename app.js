const express = require("express");
const app = express();
const mysql = require("mysql");
var dbconfig = require("./config/dbConnection");
var connection = mysql.createConnection(dbconfig.connection);
const taskTracker = require("./scripts/taskTracker.js");
const fs = require("fs");

require("./config/routes.js")(app, taskTracker, connection, fs); //routes


app.listen(3000);

app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/views"));

