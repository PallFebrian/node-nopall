const { check } = require('express-validator');
const UserModel = require('../models').user


const createUserValidator = [
  check('nama')
  .isLength({min: 1,})
  .withMessage('Nama wajib di isi'),

  check('email')
  .isEmail()
  .withMessage('Gunakan format email')
  .custom(value => {
    return UserModel.findOne({
        where:{
            email:value,
        }
    }).then(user => {
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    });
  })
];
const updateUserValidator = [
  check('nama')
  .isLength({min: 1,})
  .withMessage('Nama wajib di isi'),
];
const updatePassword = [
  check('newPassword')
  .isLength({min: 8,})
  .withMessage('Password minimal 8 karakter'),
];

module.exports = {createUserValidator,updateUserValidator,updatePassword}
