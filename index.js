// // pertemuan pertama

// const http = require("http");
// const {smk,cekBilangan} = require("./example")

// const server = http.createServer((req,res)=>{
//     res.statusCode = 200
//     res.setHeader("Content-Type","text-plain");
//     // res.write("Hello World");
//     res.write(cekBilangan(71));
//     res.write(smk);

//     res.end();
// })
// // .listen(8087,()=>{console.log("server jalan");})

// server.listen(8087,"localhost",()=>{
//     console.log('server jalan di http://localhost:8087');
// })

                // |
// pertemuan ke 2  v

const express = require('express')
const app = express()
const port = 8089;

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "nopep"
    })
})
app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "ini request dengan method GET"
    })
})
app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "ini request dengan method POST"
    })
})
app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "ini request dengan method PUT"
    })
})
app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "ini request dengan method PATCH"
    })
})
app.get("/user",(req,res)=>{
    res.send({
        status : "success",
        message : "ini request dengan method DELETE"
    })
})

app.get('siswa/:nama',(req,res)=>{
res.send({
    status :"succcess",
    message : `siswa atas nama ${req.params.nama} ditemukan`
})
})

app.listen(port,()=>console.log(`Server berjalan di http://localhost:${port}`))
