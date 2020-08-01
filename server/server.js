require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario') );

// Modificaciones por deprecation warnings
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

// Conexion a la Base de Datos
mongoose.connect(process.env.URLDB, ( err, res) => {
 
  if (err) throw err;

  console.log('Base de datos ONLINE');
  
});
 
app.listen(process.env.PORT, () => {
  console.log('Server listen on port:', process.env.PORT);
});


