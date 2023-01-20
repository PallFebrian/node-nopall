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

app.get("/siswa/:nama",(req,res)=>{
    res.send({
        status : "success",
        message : `siswa atas nama ${req.params.nama} ditemukan`
    })
})

app.get("/siswa/:nama",(req,res)=>{
    console.log('params',req.params);
    console.log('query',req.query);
    res.send({
        status : "success",
        message : `siswa atas nama ${req.params.nama}, kelas ${req.query.kelas} dan angkatan ke-${req.query.angkatan} ditemukan `
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
