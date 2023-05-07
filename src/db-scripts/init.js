const fs = require("fs");
const path = require("path");
const { queryDb } = require("../db");

const dbSchema = path.resolve(__dirname, "./schema.sql");
const sql = fs.readFileSync(dbSchema, "utf-8");
queryDb(sql)
  .then(() => {
    console.log("db initialized");
  })
  .catch((err) => console.log("error initializing db", err));
