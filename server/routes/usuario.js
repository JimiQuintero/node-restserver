const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();


// Metodo GET
app.get('/usuario', verificaToken, (req, res)  => {

  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email
  // });

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec( (err, usuarios)  => {

      if (err) {
        return res.status(400).json({
          ok: true,
          err
        });
      }

      Usuario.count( { estado: true }, (err, conteo) => {

        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        });
      } );

     
    });

});

// Metodo POST
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
  
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role 
  });

  usuario.save( (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    // usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
   
  });

// Metodo PUT
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  })
 
});

// Metodo DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

  let id = req.params.id;
  let cambioEstado = {
    estado: false
  }

  // Para borrar registro totalmente de la DB
  // Usuario.findByIdAndRemove(id, cambioEstado, { new: true }, (err, usuarioBorrado) => 

  Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (usuarioBorrado === null) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});


module.exports = app;