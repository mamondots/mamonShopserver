const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
  }

  app.use(cors(corsConfig))
  app.options("", cors(corsConfig))

app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.i6scrno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db('adrenelin').collection('products')
    const blogsCollection = client.db('adrenelin').collection('blogs')
    const usersCollection = client.db('adrenelin').collection('users')


    //get all user

    app.get('/users', async(req,res) =>{
       const result = await usersCollection.find().toArray()
       res.send(result)
    })

    //post a user

    app.post('/users', async(req,res) =>{
      const user = req.body
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query)
      if(existingUser){
        return res.send({message:'User already have'})
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    //set role admin in user
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    //user admin or not

    app.get('/users/admin/:email', async(req,res) =>{
      const email = req.params.email
      const query =  {email: email}
      const user = await usersCollection.findOne(query)
      const result = {admin: user?.role === 'admin'}
      res.send(result)

    })

    // delete the user

    app.delete('/users/:id', async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })


    //get all products
    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray()
      res.send(result)
    })

    //post a products

    app.post('/products', async (req, res) => {
      const product = req.body
      const result = await productsCollection.insertOne(product)
      res.send(result)
    })

    //get single products

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })

    // updated single product

    app.patch('/products/:id', async (req,res) =>{
      const id = req.params.id
      const updatedProduct = req.body
      const filter = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {
          ...updatedProduct
        }
      }
      const result = await productsCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })

    // delete singe product

    app.delete('/products/:id', async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.deleteOne(query)
      res.send(result)
    })

    //get blogs

    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray()
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('adrenelin is running')
})

app.listen(port, () => {
  console.log(`adrenel is running on port, ${port}`)
})

  //adrenelin

  //adrenelin6060