const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

  app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne( {email: body.email}, (err, usuarioDB) => {
      
      // Manejando el error de la DB
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      // Verificando el email
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: '(Usuario) o la contraseña son invalidos'
          }
        });
      }

      // Evaluando la contraseña
      if (!bcrypt.compareSync(body.password, usuarioDB.password) ) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario o la (contraseña) son invalidos'
          }
        });
      }

      // Generarando el jsonwebtoken (jwT)
      let token = jwt.sign({
        usuario: usuarioDB
      }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

      // Si la contraseña hace match con la de la DB
      res.json({
        ok: true,
        usuario: usuarioDB,
        token
      });

    });

  });


module.exports = app;