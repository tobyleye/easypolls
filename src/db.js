const mysql = require("mysql");

const host = "mysql";
const database = "docker-nodejs-tutorial";
const password = "root";
const user = "root";
const port = "3306";

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: host,
  user: user,
  password: password,
  database: database,
  port,
});

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
  port,
});

const queryDbPool = (...args) => {
  return new Promise((resolve, reject) => {
    dbPool.query(...args, (err, results, fields) => {
      if (err) {
        return reject(err);
      } else {
        resolve({ results, fields });
      }
    });
  });
};

const queryDb = (...args) => {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        return reject(err);
      }
      connection.query(...args, (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        resolve({ results, fields });
      });
    });
  });
};

module.exports = {
  dbPool,
  queryDb,
  queryDbPool,
};
