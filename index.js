const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
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
        const orderCollection = database.collection('ManageOrder')


        //Get Cars Collection APi
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //Get Mange Order APi
        app.get('/manageorder', async (req, res) => {
            const cursor = orderCollection.find({});
            const ManageOrder = await cursor.toArray();
            res.send(ManageOrder);
        })

        //Delete Order
        app.delete('/manageorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })


        app.post('/manageorder', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
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