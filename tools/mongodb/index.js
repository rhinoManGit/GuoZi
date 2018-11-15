/*
 *
 *
 * */
const MongoClient = require('mongodb').MongoClient;
const assert      = require('assert');
const config      = require('./../../config').config();

// Connection URL
const url = 'mongodb://' + config['db_host'] + ':'
    + config['db_port'];

// Database Name
const dbName = config['db_DB'];

function DB() {}

const action = DB.prototype;

/*
 *
 *
 * */
action.createDB = function() {

  return new Promise(function(resolve, reject) {

    // Use connect method to connect to the server
    MongoClient.connect(/*'mongodb://127.0.0.1:27017'*/url, function(err, client) {

      assert.equal(null, err);

      const db = client.db(dbName);

      resolve(db);

    });
  });
};

/*
 *
 * 获取课程列表
 * */
action.orderList = function(db, coll, query, page = 1, pageSize = 10) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.find(query).sort({_id: 1}).skip((page - 1
    ) * pageSize).limit(pageSize).toArray(function(err, docs) {
      assert.equal(err, null);

      resolve(docs);
    });
  });
};

/*
 *
 * 获取课程列表
 * */
action.orderDetail = function(db, coll, query) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.find(query).sort({_id: 1}).limit(10).toArray(
        function(err, docs) {
          assert.equal(err, null);

          resolve(docs);
        });
  });
};

/*
 *
 *
 * */
action.findDocuments = function(db, coll, query) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.find(query).toArray(function(err, docs) {
      assert.equal(err, null);

      resolve(docs);
    });
  });

};

/*
 *
 *
 * */
action.search = function(db, coll, query, page = 1, pageSize = 10) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.find(query).sort({CreateDate: 1}).skip((page - 1
    ) * pageSize).limit(pageSize - 0).toArray(function(err, docs) {
      assert.equal(err, null);

      resolve(docs);
    });
  });
};

/*
 *
 *
 * */
action.searchCount = function(db, coll, query) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    resolve(collection.find(query).sort({CreateDate: 1}).count());

  });
};

/*
 *聚合
 *
 * */
action.composite = function(db, coll, query) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.aggregate(query).toArray(function(err, docs) {
      assert.equal(err, null);

      resolve(docs);
    });


  });
};

/*
 *
 *
 * */
action.updateDocument = function(db, coll, query, obj) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    collection.updateOne(query, obj,
        function(err, result) {
          assert.equal(err, null);
          assert.equal(1, result.result.n);

          resolve(result.result);
        },
    );
  });

};

/*
 * add user
 *
 * */
action.add = function(db, coll, data) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    // Find some documents
    collection.insert(data, function(err, docs) {
      assert.equal(err, null);

      resolve(docs.result);
    });
  });
};

/*
 * update user
 *
 * */
action.update = function(db, coll, query, obj) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    collection.updateOne(query, {$set: obj}, function(err, result) {
      assert.equal(err, null);
      //assert.equal(1, result.result.n);
      console.log('Updated the document with the field a equal to 2');
      resolve(result);
    });
  });
};

/*
 * delete
 *
 * */
action.remove = function(db, coll, query, obj) {

  return new Promise(function(resolve, reject) {

    // Get the documents collection
    const collection = db.collection(coll);

    collection.remove(query, function(err, result) {
      assert.equal(err, null);

      console.log('Updated the document with the field a equal to 2');
      resolve(result);
    });
  });
};

module.exports = new DB();


