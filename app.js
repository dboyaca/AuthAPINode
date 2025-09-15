//Accessing to the MongoDB
require('./config/db');

const express = require('express');
const port = 3000;

//Directing our application to the router that deals with the endpoints.
const UserRouter = require('./routes/User');

//Setting up the app and the database mapping
const app = express();
const mongoose = require('mongoose');

//Including the body parser to deal with JSON bodies coming from the requests.
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);

//Port from which our app will be listening to the requests
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


 