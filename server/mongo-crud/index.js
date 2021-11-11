const { MongoClient, ObjectID } = require("mongodb");
const config = require("./config.json");

const newClient = () => {
  return new MongoClient(config.url, {
    useUnifiedTopology: true,
  });
};

/**
 * Connect to the given db
 * @param {String} name
 * @returns {Promise}
 */
const getDB = (name = config.dbname) => {
  return new Promise(async (resolve, reject) => {
    const client = newClient();

    try {
      await client.connect();

      resolve({
        db: client.db(name),
        client: client,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const collectionExists = (collectionName) => {
  return new Promise(async (resolve, reject) => {
    const { db, client } = await getDB();

    db.listCollections({ name: collectionName }).next(async (err, info) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(info !== null);
      }

      client.close();
    });
  });
};

const queryCollection = (collectionName, query = {}, limit = 0) => {
  return new Promise(async (resolve, reject) => {
    const { db, client } = await getDB();

    try {
      const results = db.collection(collectionName).find(query);

      if (limit > 0) {
        results.limit(limit);
      }

      resolve(await results.toArray());

      client.close();
    } catch (err) {
      reject(err);
    }
  });
};

const insert = (collectionName, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await getDB();

      const result = await db.collection(collectionName).insertOne(data);

      resolve(result.ops[0]);

      client.close();
    } catch (error) {
      reject(error);
    }
  });
};

const update = (collectionName, id, newItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await getDB();

      const result = await db
        .collection(collectionName)
        .findOneAndReplace({ _id: ObjectID(id) }, newItem, {
          returnOriginal: false,
        });

      resolve(result.value);

      client.close();
    } catch (error) {
      reject(error);
    }
  });
};

const remove = (collectionName, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await getDB();

      //uncomment for testing remove logic without actually removing
      //resolve(id); return;

      const removed = await db
        .collection(collectionName)
        .deleteOne({ _id: ObjectID(id) });

      if (removed.deletedCount === 1) {
        resolve(id);
      } else {
        reject({
          msg: "Could not remove item",
          data: removed,
        });
      }

      client.close();
    } catch (error) {
      reject(error);
    }
  });
};

const loadData = (collection, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await getDB();

      const results = await db.collection(collection).insertMany(data);

      resolve(results);

      client.close();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  config,
  newClient,
  getDB,
  loadData,
  collectionExists,
  queryCollection,
  insert,
  update,
  remove,
};
