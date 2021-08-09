const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://areababa:NrKSMkb3RUFXyO3k@cluster0.icgkh.mongodb.net/fidio?retryWrites=true&w=majority"
  )
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
