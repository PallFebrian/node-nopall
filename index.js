const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 1224;
const router = require('./src/routes');
const { sequelize } = require('./src/models');
const authMiddleWare = require('./src/routes/middleware/authMiddleWare');
const console1 = require('./src/routes/middleware/console1');
const paginationMW = require('./src/routes/middleware/paginationMW');

// const console2 = require('./src/routes/middleware/console2')

app.use(express.json());
app.use(express.static('src/storage/uploads'));
// app.use(console2)
app.use(paginationMW);
app.use(console1);
// app.use(authMiddleWare)
app.use(router);
app.listen(
  port,
  async () => {
    try {
      await sequelize.authenticate();
      console.log('Koneksi telah berhasil dibuat.');
    } catch (error) {
      console.error('Tidak dapat terhubung ke database.', error);
    }
  }

  // console.log(`Server berjalan di http://localhost:${port}`)
);
