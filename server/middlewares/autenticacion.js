const jwt = require('jsonwebtoken');

// ===========================
//     VERIFICAR TOKEN
// ===========================

let verificaToken = ( req, res, next ) => {

  let token = req.get('token');

  jwt.verify( token, process.env.SEED, ( err, decoded) => {

    // Si existe un error
    if (err) {
      return res.status(401).json({
        ok: true,
        err
      });
    }

    // Si los datos son correctos y pasa la verificacion
    req.usuario = decoded.usuario;

    // Para que continue el programa
    next();

  });

  // console.log(token); 

  // res.json({
  //   token: token
  // });

};

// ===========================
//     VERIFICA AdminRole
// ===========================

let verificaAdmin_Role = ( req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {

    res.json({
      ok: false,
      err: {
        message: 'El usuario no es Administrador'
      }
    });

  }

}

module.exports = {
  verificaToken,
  verificaAdmin_Role
}