const MateriModel = require('../models').materi;
const { Op } = require('sequelize');

async function bulkCreateMateri(req, res) {
  try {
    let { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    if (req.role === 'guru') {
      await Promise.all(
        payload.map(async (item, index) => {
          try {
            await MateriModel.create({
              mataPelajaran: item.mataPelajaran,
              kelas: item.kelas,
              materi: item.materi,
              userID: req.id,
            });

            success = success + 1;
          } catch (err) {
            console.log(err);
            fail = fail + 1;
          }
        })
      );
      // payload.map((item, index) => {
      //   item.userID = req.id; //nambah ojek di array
      // });

      // await MateriModel.bulkCreate(payload);
      res.status(201).json({
        status: '201',

        msg: `sukses menambahkan ${success} Materi dari total ${jumlah} Materi dan gagal ${fail} Materi`,
        r: req.id,
        rg: req.role,
      });
    } else {
      res.status(403).json({
        status: 'error',
        r: `r ${req.role}`,
        msg: 'Anda tidak memiliki akses karena role anda adalah siswa',
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'error',
      msg: 'error creating',
      e: err,
    });
  }
}
async function deleteMulti(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (items, index) => {
        try {
          const title = await MateriModel.findOne({
            where: { id: items.id },
          });
          console.log(title.userID);
          if (title.userID !== req.id) {
            return (fail = fail + 1);
          }
          await MateriModel.destroy({
            where: { id: items.id },
          });
          console.log(items.id);
          console.log(title);
          success = success + 1;
        } catch (error) {
          console.log(error);
          fail = fail + 1;
        }
      })
    );
    res.status(200).json({
      status: 'Success',
      msg: `Success delete ${success} articles from ${jumlah} articles with ${fail} fail`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: 'Fail',
      msg: 'Something went wrong',
      err: error,
    });
  }
}

async function updateMateri(req, res) {
  try {
    const payload = req.body;
    let { mataPelajaran, materi, kelas, id } = payload;
    const Materi = await MateriModel.findByPk(id);

    if (Materi === null) {
      return res.status(404).json({
        status: 404,
        msg: 'Materi not found',
      });
    }

    if (req.role === 'guru') {
      if (req.id === Materi.userID) {
        await MateriModel.update(
          { mataPelajaran, materi, kelas },
          {
            where: {
              id: id,
            },
          }
        );
        res.json({
          status: '200 OK',
          msg: 'materi updated',
        });
      } else {
        res.status(403).json({
          status: 'error',
          msg: 'Anda tidak mengupdate materi ini karena materi ini ditulis oleh guru lain',
        });
      }
    } else {
      res.status(403).json({
        status: 'error',
        msg: 'Anda tidak memiliki akses karena role anda adalah siswa',
      });
    }
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan update',
    });
  }
}

async function listMateriGuru(req, res) {
  try {
    const { page, pageSize, offset, isAll } = req.query;
    if (req.role === 'guru') {
    let materi  
      if (isAll === 'false') {
        console.log('false ')
         materi = await MateriModel.findAndCountAll({
          attributes: {
            exclude: ['createAt', 'updateAt'],
          },
          where: {
            userID: req.id,
          },
  
          limit: pageSize,
          offset: offset, // offset bukanlah page
        });
      }
      if (isAll === 'true') {
        console.log('false ')
         materi = await MateriModel.findAndCountAll({
          attributes: {
            exclude: ['createAt', 'updateAt'],
          },
  
          limit: pageSize,
          offset: offset, // offset bukanlah page
        });
      }
      

      
      res.json({
        status: 'Success',
        message: 'Data materi Ditemukan',
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalData: materi.count,
        },
        data: materi,
      });
    }
  } catch (err) {
    console.log('ada kesalahan masbro =>', err);
    res.status(403).json({
      status: 'Fail',
      maessage: 'Terjadi Kesalahan',
    });
  }
}

module.exports = {
  bulkCreateMateri,
  deleteMulti,
  updateMateri,
  listMateriGuru,
};
