const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ludk7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
        await client.connect();
        const database = client.db("Car_House");
        const carsCollection = database.collection("Cars");
        const reviewsCollection = database.collection('Review')
        const usersCollection = database.collection('Users')
        const orderCollection = database.collection('ManageOrder')

        //Get Cars  APi
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //POST CAR API
        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            const result = await carsCollection.insertOne(newCar);
            res.json(result);
        })

        //DELETE CAR API
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await carsCollection.deleteOne(query);
            res.json(result);
        })

        //GET MANAGE ORDER API
        app.get('/manageorder', async (req, res) => {
            const cursor = orderCollection.find({});
            const ManageOrder = await cursor.toArray();
            res.send(ManageOrder);
        })

        //DELETE MANAGE ORDER API
        app.delete('/manageorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        //POST MANAGE ORDER API
        app.post('/manageorder', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        })


        //GET REVIEWS API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //POST REVIEWS API
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.json(result);
        })

        //GET USERS API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
        })

        //POST USERS API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
        })

        //PUT MAKE ADMIN API
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //CHECKING ADMIN API
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') { isAdmin = true; }
            res.json({ admin: isAdmin });
        })
    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Hello Car House Server");
})

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})

