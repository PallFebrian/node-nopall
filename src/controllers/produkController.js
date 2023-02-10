const ProdukModel = require('../models').produk;

async function getListProduk(req, res) {
  try {
    const produks = await ProdukModel.findAll();
    res.json({
      status: 'success',
      msg: 'Data user di temukan',
      data: produks,
    });
  } catch (err) {
    res.status(403).json({
      status: 'finally',
      msg: 'Terjadi Kesalahan',
    });
  }
}

//create ke database

async function createProduk(req, res) {
  try {
    const payload = req.body;
    const { nama, harga, stok, lokasi, deskripsi } = payload;
    let produk = await ProdukModel.create({
      nama: nama,
      harga: harga,
      stok: stok,
      lokasi: lokasi,
      deskripsi: deskripsi,
    });
    // const nama = payload.nama

    res.status(201).json({
      status: 'success',
      msg: 'berhasil disimpan',
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function getDetailProdukById(req, res) {
  try {
    const { id } = req.params;
    const produk = await ProdukModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: 'fail',
        msg: 'produk tidak ditemukan',
      });
    }

    res.json({
      status: 'Success',
      msg: 'produk berhasil',
      data: produk,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}

async function getDetailProdukByParams(req, res) {
  try {
    const { nama } = req.params;

    const produk = await ProdukModel.findOne({
      where: {
        nama: nama,
      },
    });

    if (produk === null) {
      res.status(404).json({
        status: 'fail',
        msg: 'produk tidak ditemukan',
      });
    }

    res.json({
      status: 'Success',
      msg: 'produk ditemukan',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}

module.exports = {
  getListProduk,
  createProduk,
  getDetailProdukById,
  getDetailProdukByParams,
};
