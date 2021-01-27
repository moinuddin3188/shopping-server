const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkovl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


client.connect(err => {
    const productCollection = client.db("shopping").collection("products");
    const categoriesCollection = client.db("shopping").collection("categories");
    const ordersCollection = client.db("shopping").collection("orders");
    productCollection.createIndex({
        category: "text",
        name: "text",
        seller: "text"
    })

    app.get('/search/:keyWord', (req, res) => {
        productCollection.find({
            $text: { $search: req.params.keyWord }
        })
            .toArray((err, documents) => {
                res.send(documents)
            }) 
    })

    app.get('/allProducts', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/productByKey/:key', (req, res) => {
        productCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/categories', (req, res) => {
        categoriesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/productByCategory/:category', (req, res) => {
        productCollection.find({ category: req.params.category })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/placeOrder', (req, res) => {
        ordersCollection.insertOne(req.body)
        .then(result => {

        }) 
    })


    console.log("Database connected");
});



app.listen(process.env.PORT || port);