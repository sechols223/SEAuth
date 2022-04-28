const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const registerRouter = require('./src/routes/register')

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 3000;


const dbConnect = mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}))
app.use('/api/users', registerRouter)


app.post('/register', registerRouter)
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})
