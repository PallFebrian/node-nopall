const UserModel = require('../models').user;

async function getListUser(req, res) {
  try {
    const users = await UserModel.findAll();
    res.json({
      status: 'success',
      msg: 'Data user di temukan',
      data: users,
    });
  } catch (err) {
    res.status(403).json({
      status: 'finally',
      msg: 'Terjadi Kesalahan',
    });
  }
}

//create data ke database

async function createUser(req, res) {
  try {
    const payload = req.body;
    const { nama, email, tempatLahir, tanggalLahir } = payload;
    let user = await UserModel.create({
      nama: nama,
      email: email,
      isActive: true,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
    });
    // const nama = payload.nama

    res.status(201).json({
      status: 'success',
      msg: 'berhasil disimpan',
    });
  } catch {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}

//////////////////////

async function getDetailUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: 'fail',
        msg: 'user tidak ditemukan',
      });
    }

    res.json({
      status: 'Success',
      msg: 'user berhasil',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}

async function getDetailUserByParams(req, res) {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.status(404).json({
        status: 'fail',
        msg: 'user tidak ditemukan',
      });
    }

    res.json({
      status: 'Success',
      msg: 'user ditemukan',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { nama, tempatLahir, tanggalLahir } = payload;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: 'fail',
        msg: 'user tidak ditemukan',
        user: user,
      });
    }

    // await UserModel.update(
    //   {
    //     nama : nama,
    //     tempatLahir : tempatLahir,
    //     tanggalLahir : tanggalLahir,
    //   },
    //   { where: { id: id } }
    // );

    await UserModel.update(
      {
        nama,
        tempatLahir,
        tanggalLahir,
      },
      { where: { id: id } }
    );

    res.json({
      status: 'success',
      msg: 'update berhasil',
      id: id,
    });
  } catch (err) {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
      err: err,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(400).json({
        status: 'fail',
        msg: 'user tidak ditemukan',
        id: id,
        user: user,
      });
    }

    await UserModel.destroy({
      where:{
        id:id
      }
    })

    res.json({
      status: 'success',
      msg: 'delete berhasil',
      id: id,
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
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
};
