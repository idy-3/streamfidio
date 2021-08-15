const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(process.env.DB_CONNECTION_STRING)
    .then((client) => {
      console.log("Connected...!");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
