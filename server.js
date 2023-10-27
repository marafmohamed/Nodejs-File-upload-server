const express=require("express");
const app=express();
const uploadRoute=require("./Routes/uploadRoute")
const fs=require("fs");
const path=require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/upload',uploadRoute);

app.listen(4000,()=>{
    console.log("listening on port 4000");
})
