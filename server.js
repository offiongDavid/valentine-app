const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
require('./config/db');
app.use('/', require('./routes/valentineRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
