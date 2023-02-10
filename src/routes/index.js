const express = require('express');
const {
  getListProduk,
  createProduk,
} = require('../controllers/produkController');
const router = express.Router();
const {
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const validationResultMiddleware = require('../routes/middleware/validationResault');
const userValidator = require('../validators/userValidator');
const produkValidator = require('../validators/produkValitor');
const { register, login, loginAuth, updatePassword, lupaPassword, resetPassword } = require('../controllers/authController');
const jwtValidateMiddleware = require('../routes/middleware/jwtValidateMiddleware');
const {
  createArtikel,
  getListArtikel,
  deleteArtikel,
  updateArtikel,
  createArtikelBulk,
  createArtikelMulti,
  deleteArtikelMulti,
  deleteMulti,
} = require('../controllers/artikelController');
const paginationMW = require('./middleware/paginationMW');


//login

router.post('/register', register);
router.post('/login', login);
router.post('/lupaPassword', lupaPassword);
router.post('/resetPassword/:userId/:token', resetPassword);
router.put('/user/updatePassword',
userValidator.updatePassword,
validationResultMiddleware,
updatePassword)


//implementasi jwtvalidate
router.use(jwtValidateMiddleware);

//user

router.get('/user/list', getListUser);
router.post(
  '/user/create',
  userValidator.createUserValidator,
  validationResultMiddleware,
  createUser
);

router.put(
  '/user/update/:id',
  userValidator.updateUserValidator,
  validationResultMiddleware,
  updateUser
);

router.delete('/user/delete/:id', deleteUser);

router.get('/user/detail/:id', getDetailUserById);
router.get('/user/list/:email', getDetailUserByParams);

//artikel

router.post('/artikel/create', createArtikel);
router.post('/artikel/create/bulk', createArtikelBulk);
router.delete('/artikel/delete-multi', deleteMulti);
router.post('/artikel/create/multi', createArtikelMulti);
router.get('/artikel/list', getListArtikel);
router.delete('/artikel/delete/:id', deleteArtikel);
router.put('/artikel/update/:id',updateArtikel);

//update passwor


//produk

// router.get('/produk/list', getListProduk);
// router.post(
//   '/produk/create',
//   produkValidator.createProdukValidator,
//   validationResultMiddleware,
//   createProduk
// );
// router.get('/produk/detail/:id', getDetailProdukById);
// router.get('/produk/list/:nama', getDetailProdukByParams);

module.exports = router;
