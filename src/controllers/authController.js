const User2Model = require('../models').user2;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dayjs = require('dayjs');
require('dotenv').config();

async function register2(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password, role } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await User2Model.create({
      nama,
      email,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      status: 'success',
      msg: 'Register berhasil',
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function login2(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await User2Model.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: 'fail',
        msg: 'Email tidak di temukan, silahkan register',
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: 'fail',
        msg: 'Email dan password tidak cocok',
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: 'fail',
        msg: 'Email dan password tidak cocok',
      });
    }

    const token = jwt.sign(
      {
        id: user?.id,
        role: user?.role,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      status: 'success',
      msg: 'login berhasil',
      token: token,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

module.exports = {
  register2,
  login2,
};
