const express = require('express');
const cors = require('cors');
require('dotenv').config();
const AuthRoute = require('./routes/Auth.route');
const ProductRoute = require('./routes/Product.route');
const connectDB = require('./DB/db');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", AuthRoute);
app.use("/", ProductRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
