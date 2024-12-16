require('dotenv').config({ path: './.env' });

const tasterRoutes = require('./routes/tasters.js')

const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 5050;
const app = express();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:5173/', // Allow this origin to access the server
    methods: ['GET', 'POST'], // Specify methods you want to allow
    credentials:true
}));

app.use(express.json());
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

// Set up routes
app.get('/', (req, res) => {
    res.send("Welcome to the API!");
});

app.use('/api', tasterRoutes)

// connect to db
const mongoose = require('mongoose')
mongoose.connect(process.env.MONG_URI)
    .then(()=>{
        // start listen for requests
        app.listen(PORT, ()=> {
            console.log(`connected to db & listening on port: ${PORT}`)
        })
    })
    .catch((error)=>{console.log(error)})




