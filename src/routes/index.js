const express = require('express');
const authMiddleWare = require('./middleware/authMiddleWare');
const router = express.Router();
const uploadMulti = require('../storage/fileUploadMulti')
const uploadSingle = require('../storage/fileUploadSingle')

router.post('/upload/single',uploadSingle, (req, res) => {

  res.send({
    status: 'Success',
    msg: 'Upload Success',
    file: req.file,
    fileUrl : `${req.protocol}://${req.get('host')} /${req.file.filename}`
  });
});

router.post('/upload/multi',uploadMulti, (req, res) => {

  res.send({
    status: 'Success',
    msg: 'Upload Success',
    file: req.files,
    // fileUrl : `${req.protocol}://${req.get('host')} /${req.file.filename}`
  });
});


router.post('/user/create', (req, res) => {
  const payload = req.body;
  const { kelas, nama } = req.body;

  res.json({
    status: 'Success',
    msg: 'Latihan request body',
    payload: payload,
    nama: nama,
  });
});

router.get('/', authMiddleWare, (req, res) => {
  res.send('Hello World');
});

router.post('/', authMiddleWare, (req, res) => {
  res.send({
    status: 'success',
    message: 'ini request dengan method POST',
  });
});

router.use(authMiddleWare);

router.get('/user', (req, res) => {
  res.send({
    status: 'success',
    message: 'nopep',
  });
});

//latihan routing params

router.get('/siswa/:nama/:sekolah', (req, res) => {
  // let nama = req.params.nama;
  // let sekolah = req.params.sekolah;
  let { nama, sekolah } = req.params;
  res.send({
    status: 'success',
    message: `nama siswa adalah ${nama}, dan sekolah di ${sekolah}`,
    // message : `siswa atas nama ${req.params.nama} ditemukan`
  });
});

//latihan query string

router.get('/siswa/:nama', (req, res) => {
  let { nama } = req.params;
  let { kelas = 'x', sekolah = 'mq' } = req.query;
  res.send({
    status: 'success',
    message: `nama siswa adalah ${nama} kelas ${kelas} di sekolah ${sekolah}`,
  });
});

router.get('/absensi/:nama', (req, res) => {
  let { nama } = req.params;
  let { status, dari_tanggal, sampai_tanggal } = req.query;
  res.send({
    status: 'success',
    data: {
      nama: nama,
      status: status,
      dari_tanggal: dari_tanggal,
      sampai_tanggal: sampai_tanggal,
    },
  });
});

module.exports = router;
