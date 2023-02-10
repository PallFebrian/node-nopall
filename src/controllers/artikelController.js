const ArtikelModel = require('../models').artikel;
const { Op } = require('sequelize');

async function createArtikel(req, res) {
  try {
    const payload = req.body;
    const { title, year, description } = payload;

    await ArtikelModel.create({
      title,
      year,
      description,
      userId: req.id,
    });
    res.status(201).json({
      status: 'success',
      msg: 'create artikel berhasil',
      // payload:payload
    });
  } catch {
    res.status(403).json({
      status: 'fail',
      msg: 'ada kesalahan',
    });
  }
}
////////////////////////////////////////////////

//findAll
async function getListArtikel(req, res) {
  const {
    keyword,
    page,
    pageSize,
    year,
    offset,
    sortBy = "id",
    orderBy = "desc",
  } = req.query;
  try {
    const artikel = await ArtikelModel.findAndCountAll({
      attributes: {
        exclude: ["createAt", "updateAt"],
      },
      // where: {
      //   [Op.or]: [
      //     {
      //       title: {
      //         [Op.substring] : keyword,
      //       },
      //     },
      //     {
      //       description: {
      //         [Op.substring] : keyword,
      //       },
      //     },
      //   ],
      //   year: {
      //     [Op.gte] : year,
      //   },
      // },
      // order: [[sortBy, orderBy]],
      limit: pageSize,
      offset: offset, // offset bukanlah page
    });
    res.json({
      status: "Success",
      message: "Data Artikel Ditemukan",
      pageNation: {
        currentPage: page,
        pageSize: pageSize,
        totalData: artikel.count,
      },
      data: artikel,

      query: {
        // title,
        // dari_tahun,
        // sampai_tahun,
        page,
        pageSize,
      },
    });
  } catch (err) {
    console.log("ada kesalahan masbro =>", err);
    res.status(403).json({
      status: "Fail",
      maessage: "Terjadi Kesalahan",
    });
  }
}

  // async function getListArtikel(req, res) {
  //   try {
  //     const {title,dari_tahun,sampai_tahun} = req.query
  //     const artikel = await ArtikelModel.findAll({
  //       attributes: [
  //         'id',
  //         'userId',
  //         ['title', 'judul'], //alias
  //         'year',
  //         ['description', 'deskripsi'],  //alias
  //       ], //cuma ini yang di tampilkan
  //       where: {
  //         title : {
  //           [Op.substring] : title
  //         },
  //         year : {
  //           [Op.between] : [dari_tahun,sampai_tahun]
  //         }
  //       },
  //     });

  //     res.json({
  //       status: 'success',
  //       msg: 'Artikel di temukan',
  //       data: artikel,
  //       query:{
  //         title
  //       }
  //     });
  //   } catch (err) {
  //     res.status(403).json({
  //       status: 'finally',
  //       msg: 'Terjadi Kesalahan',
  //     });
  //   }

  // async function getListArtikel(req, res) {
  //   try {
  //     const { id } = req.params;

  //     const artikel = await ArtikelModel.findAll({
  //       where: {
  //         userId: req.id,
  //       },
  //     });
  //     res.json({
  //       status: 'success',
  //       msg: 'Artikel di temukan',
  //       data: artikel,
  //     });
  //   } catch (err) {
  //     res.status(403).json({
  //       status: 'finally',
  //       msg: 'Terjadi Kesalahan',
  //     });
  //   }


async function updateArtikel(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { title, year, description } = payload;
    const artikel = await ArtikelModel.findByPk(id);
    if (artikel === null) {
      return res.status(404).json({
        status: 'Fail',
        message: 'artikel not found',
      });
    }
    if (artikel.userId != req.id) {
      return res.status(422).json({
        status: 'Fail',
        message: "artikel is not belong to you, you can't update it",
      });
    }
    await ArtikelModel.update(
      {
        title,
        year,
        description,
      },
      {
        where: {
          userId: req.id,
          id: id,
        },
      }
    );
    res.json({
      status: 'Success',
      message: 'Updated',
      // data: artikel,
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: 'Fail',
      message: 'There is something wrong',
    });
  }
}

async function deleteArtikel(req, res) {
  try {
    const { id } = req.params;
    const artikel = await ArtikelModel.findByPk(id);
    if (artikel === null) {
      res.status(404).json({
        status: 'Fail',
        message: 'artikel not found',
      });
    }
    if (artikel.userId != req.id) {
      return res.status(422).json({
        status: 'Fail',
        message: "artikel is not belong to you, you can't delete it",
      });
    }
    await ArtikelModel.destroy({
      where: {
        userId: req.id,
        id: id,
      },
    });
    res.json({
      status: 'Success',
      message: 'artikel dihapus',
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: 'Fail',
      message: 'There is something wrong',
    });
  }
}

async function createArtikelBulk(req, res) {
  try {
    // const payload = req.body.payload
    const { payload } = req.body;
    payload.map((item, index) => {
      item.userId = req.id; //nambah ojek di array
    });

    await ArtikelModel.bulkCreate(payload);

    res.json({
      status: 'success',
      bulk: 'Create artikel bulk berhasil',
      // payload
    });
  } catch {
    res.status(403).json({
      status: 'fail',
      bulk: 'ada kesalahan',
    });
  }
}
async function createArtikelMulti(req, res) {
  try {
    const { payload } = req.body;

    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (item) => {
        try {
          await ArtikelModel.create({
            title: item.title,
            year: item.year,
            description: item.description,
            userId: req.id,
          });

          success = success + 1;
        } catch (err) {
          fail = fail + 1;
        }
      })
    );

    res.status(201).json({
      status: 'Success',
      msg: `Berhasil menambahkan ${success} dari ${jumlah} dan gagal ${fail}`,
    });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
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
          const title = await ArtikelModel.findOne({
            where: { id: items.id },
          });
          console.log(title.userId);
          if (title.userId !== req.id) {
            return (fail = fail + 1);
          }
          await ArtikelModel.destroy({
            where: { id: items.id },
          });
          console.log(items.id);
          console.log(title);
          success = success + 1;
        } catch (error) {
          console.log(error);
          // fail = fail + 1;
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
module.exports = {
  createArtikel,
  getListArtikel,
  deleteArtikel,
  updateArtikel,
  createArtikelBulk,
  createArtikelMulti,
  deleteMulti,
};
