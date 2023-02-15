const express = require('express');
const { register2, login2 } = require('../controllers/authController');
const {
  bulkCreateMateri,
  deleteMulti,
  updateMateri,
  listMateriGuru,
} = require('../controllers/materiController');
const { getListUser2 } = require('../controllers/user2controller');
const router = express.Router();
const jwt = require('./middleware/jwtValidateMiddleware');
// const validationResultMiddleware = require('../routes/middleware/validationResault');

// const jwtValidateMiddleware = require('../routes/middleware/jwtValidateMiddleware');
const paginationMW = require('./middleware/paginationMW');
// const user2 = require('../models/user2');

//login

router.use(paginationMW)

router.get('/user/lisst', getListUser2);
router.post('/register2', register2);
router.post('/login2', login2);


router.use(jwt);

router.post('/create/materi', bulkCreateMateri);
router.delete('/delete/materi', deleteMulti);
router.get('/list/materi-guru', listMateriGuru);

module.exports = router;
