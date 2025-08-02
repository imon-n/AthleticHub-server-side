require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk-key.json");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");



const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x9u2gny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFireBaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access -" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // console.log("decoded token", decoded);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

async function run() {
  try {
    // await client.connect();
    const eventsCollection = client.db("AthleticHubDB").collection("events");
    const bookingCollections = client
      .db("AthleticHubDB")
      .collection("bookings");
    

    app.get("/events", async (req, res, next) => {
      const { email, search } = req.query;

      if (email) {
        const authHeader = req.headers?.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res
            .status(401)
            .send({ message: "unathorized access - no token" });
        }
        const token = authHeader.split(" ")[1];
        try {
          const decoded = await admin.auth().verifyIdToken(token);
          // console.log("decoded token", decoded);
          if (decoded.email !== email) {
            return res.status(403).send({ message: "forbidden access" });
          }
        } catch (error) {
          return res
            .status(401)
            .send({ message: "unathorized access - no token" });
        }
      }
      const query = {};
      if (email) {
        query.email = email;
      }
      if (search) {
        query.eventName = { $regex: search, $options: "i" }; // Case-insensitive title match
      }
      const result = await eventsCollection.find(query).toArray();
      res.send(result);
    });

    // app.get("/events", verifyFireBaseToken, async (req, res) => {
    //   const { email, search } = req.query;

    //   if(email !== req.decoded.email){
    //     return res.status(403).message({message : "forbidden access"})
    //   }
    //   const query = {};
    //   if (email) {
    //     query.email = email;
    //   }
    //   if (search) {
    //     query.eventName = { $regex: search, $options: "i" }; // Case-insensitive title match
    //   }
    //   const result = await eventsCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await eventsCollection.findOne(query);
      res.send(result);
    });

    app.post("/events", async (req, res) => {
      const newEvent = req.body;
      console.log(newEvent);
      const result = await eventsCollection.insertOne(newEvent);
      res.send(result);
    });

    app.put("/events/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateEvent = req.body;
      const updatedDoc = {
        $set: updateEvent,
      };
      const result = await eventsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await eventsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/bookings", verifyFireBaseToken, async (req, res) => {
      const email = req.query.email;
      // console.log('req headers', req.headers);
      if (email !== req.decoded.email) {
        return res.status(403).message({ message: "forbidden access" });
      }
      const query = email ? { email: email } : {};
      const result = await bookingCollections.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const newBook = req.body;
      const { email, eventId } = req.body;
      const alreadyBooked = await bookingCollections.findOne({
        email,
        eventId,
      });
      if (alreadyBooked) {
        return res.status(409).json({ message: "Already booked" });
      }
      // console.log(newEvent);
      const result = await bookingCollections.insertOne(newBook);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollections.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello - World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
