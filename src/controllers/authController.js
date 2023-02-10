const UserModel = require('../models').user;
const ForgotPasswordModel = require('../models').password;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmailHandle = require('../mail');
const crypto = require('crypto');
const dayjs = require('dayjs');
require('dotenv').config();

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      status: 'success',
      msg: 'Register berhasil',
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await UserModel.findOne({
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

async function updatePassword(req, res) {
  try {
    const payload = req.body;
    const { email, oldPassword, newPassword } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    const verify = await bcrypt.compareSync(oldPassword, user.password);

    if (user === null) {
      return res.json({
        status: 'fail',
        msg: 'Email tidak di temukan, silahkan register',
      });
    }

    if (verify) {
      let hashPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update(
        { password: hashPassword },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.json({
        status: 'success',
        msg: 'berhasil',
      });
    } else {
      res.json({
        msg: 'password lama tidak sesuai',
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function lupaPassword(req, res) {
  try {
    const { email } = req.body;

    //cek apakah user dengan email tsb terdaftar
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar
    if (user === null) {
      return res.status(422).json({
        status: 'fail',
        msg: 'email tidak di temukan',
      });
    }
    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currenToken = await ForgotPasswordModel.findOne({
      where: {
        userId: user.id,
      },
    });
    // jika ada, hapus token lama
    if (currenToken != null) {
      await ForgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }
    // jika belum buat token
    const token = crypto.randomBytes(32).toString('hex'); //membuat token dgn string random
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await ForgotPasswordModel.create({
      userId: user.id,
      token: token,
      expireDate: dayjs(expire).format('YYYY-MM-DD hh:mm:ss'),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`,
    };
    const sendEmail = await sendEmailHandle(
      email,
      'lupa password',
      'lupaPassword',
      context
    );

    if (sendEmail === 'success') {
      res.json({
        status: 'success',
        msg: 'cek email',
      });
    } else {
      res.status(400).json({
        status: 'fail',
        msg: 'gagal mengirim',
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function resetPassword(req, res) {
  try {
    let { newPassword } = req.body;
    let { userId, token } = req.params;
    const currentToken = await ForgotPasswordModel.findOne({
      where: { userId: userId, token: token },
    });

    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (currentToken === null) {
      res.status(403).json({
        msg: 'token invalid',
      });
    } else {
      let userExpired = currentToken.expiredDate;
      let expire = dayjs(Date());
      let difference = expire.diff(userExpired, 'hour');
      if (difference !== 0) {
        res.json({
          status: 'Fail',
          msg: 'Token expired',
        });
      } else {
        let hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(
          { password: hashPassword },
          {
            where: {
              id: user.id,
            },
          }
        );
        await ForgotPasswordModel.destroy({ where: { token: token } });
        res.json({
          status: 'succes',
          msg: 'password berhasil di update',
        });
      }
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'error 403',
      msg: 'ada error',
      err: err,
      // token: currentToken
    });
  }
}
module.exports = {
  register,
  login,
  updatePassword,
  lupaPassword,
  resetPassword,
};
