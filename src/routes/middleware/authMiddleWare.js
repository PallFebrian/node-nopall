function authMiddleWare(req, res, next) {
  console.log('middleware di panggil');
  console.log('header', req.headers);

  if (req?.headers?.authorization === '123') {
    next();
  } else if (req?.headers?.authorization === undifined) {
    return res.status(401).json({
      status: 'fail',
      message: 'kirimkan valdi',
    });
  }else {
    return res.status(401).json({
      status: 'fail',
      message: 'kirimkan valdi',
    });
  }
}

module.exports = authMiddleWare;
