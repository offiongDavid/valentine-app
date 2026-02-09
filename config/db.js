const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://offiongd400_db_user:u29xjyNkw2XLswSO@cluster0.i3cdbfr.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
