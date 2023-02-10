const { check } = require('express-validator');
// const ProdukModel = require('../models').produk


const createProdukValidator = [
  check('nama')
  .isLength({min: 1,})
  .withMessage('Nama harus di isi'),

  check('harga')
  .isLength({min: 1,})
  .withMessage('Harga harus di isi'),

  check('stok')
  .isLength({min: 1,})
  .withMessage('Stok harus di isi'),

  check('lokasi')
  .isLength({min: 1,})
  .withMessage('Lokasi harus di isi'),
];

module.exports = {createProdukValidator}
