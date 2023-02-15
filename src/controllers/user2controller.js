const User2Model = require('../models').user2;

async function getListUser2(req, res) {
  try {
    const user = await User2Model.findAll();
    res.json({
      status: 'success',
      msg: 'Data user di temukan',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'finally',
      msg: 'Terjadi Kesalahan',
    });
  }
}

async function create2User(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password, role } = payload;
    let user = await User2Model.create({
      nama: nama,
      email: email,
      password: password,
      role: role,
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





module.exports = {
  getListUser2,
  create2User,
};
