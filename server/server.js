require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Metodo GET
app.get('/usuario', function (req, res) {
  res.json('Get Usuario')
});

// Metodo POST
app.post('/usuario', function (req, res) {
  
  let body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario'
    })
  } else {
    res.json({
      persona: body
    });
  }
   
  });

// Metodo PUT
app.put('/usuario/:id', function (req, res) {
  let id = req.params.id
  res.json({
    id
  })
});

// Metodo DELETE
app.delete('/usuario', (req, res) => res.json('Delete Usuario'));
 
app.listen(process.env.PORT, () => {
  console.log('Server listen on port:', process.env.PORT);
})