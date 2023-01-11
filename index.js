// pertemuan pertama

const http = require("http");
const {smk,cekBilangan} = require("./example")

const server = http.createServer((req,res)=>{
    res.statusCode = 200
    res.setHeader("Content-Type","text-plain");
    // res.write("Hello World");
    res.write(cekBilangan(71));
    res.write(smk);

    res.end();
})
// .listen(8087,()=>{console.log("server jalan");})

server.listen(8087,"localhost",()=>{
    console.log('server jalan di http://localhost:8087');
})

                // |
// pertemuan ke 2  v

// const express = require('express')
// const app = express()
// const port = 8089
// app.listen(port,()=>console.log(`Server berjalan di http://localhost:${port}`))
