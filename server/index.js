const express = require("express");
const cors = require("cors");
const http = require("http");
const axios = require("axios");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/getSearch",async (req,res)=>{
    try{
        var data = JSON.stringify({
            "search": req.body.search,
            "filter": "company"
          });
          
          var config = {
            method: 'post',
            url: 'https://www.zaubacorp.com/custom-search',
            headers: { 
              'Content-Type': 'application/json', 
              'Cookie': 'drupal.samesite=1'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(response.data)
            res.send(response.data)
          })
          .catch(function (error) {
            console.log(error);
          });
          
    
}catch(err){
    console.log(err);
}
})


app.post("/addCompany",async (req,res)=>{
    try{
        if(!req.body.company || !req.body.company.trim()) {
            res.json({
                success:false,
                message:"Invalid Company Name"
            })
        }
        if(!req.body.cid || !req.body.cid.trim()) {
            res.json({
                success:false,
                message:"Invalid Company Id"
            })
        }
        
        const data=await db.query("SELECT count(cid) FROM company WHERE cin =$1",[req.body.cid]);
        console.log(data,data.rows,data.rows[0], data.rows[0].count);
        if(data && data.rows && data.rows[0] && data.rows[0].count >0){
            res.json({
                success:false,
                message:"Company Already Added"
            })
        }
        let now = new Date();
         const response=await db.query("INSERT INTO company (company_name,cin,created,updated) VALUES($1,$2,$3,$4)",[req.body.company,req.body.cid,now,now]);
         if(response) {
         res.json({
            success:true,
            message:"Company Added Successfully"
        });}else{
            res.json({
                success:false,
                message:"Failed To Add Company"
            })
        }
    
}catch(err){
    res.json({
        success:false,
        message:err.message
    })
}
})



app.get("/getCompany",async (req,res)=>{
    try{
        const limit = 6;
        let offset = req.query.offset ? Number(req.query.offset):1;
        let search = req.query.search && req.query.search.trim() ? req.query.search.trim():"";
        let newOffset = limit*(offset-1)
        const data=await db.query("SELECT * FROM company WHERE cin LIKE '%' || $1 || '%' OR company_name LIKE '%' || $2 || '%' ORDER BY cid DESC LIMIT $3 OFFSET $4",[search,search,limit,newOffset]);
        const totalData=await db.query("SELECT COUNT(cid) FROM company WHERE cin LIKE '%' || $1 || '%' OR company_name LIKE '%' || $2 || '%'",[search,search]);
        
        //  console.log(search);
         if(data) {
            let dataCount = totalData.rows && totalData.rows[0] && totalData.rows[0].count ? Number(totalData.rows[0].count) : 0;
            let haveExtraOffset = (dataCount%limit)===0?0:1;
            res.status(200).json({
            success:true,
            message:"Company Fetched Successfully",
            data:data.rows,
            dataCount:dataCount,
            offset:offset,
            limit:limit,
            maxOffset:Math.floor(dataCount/limit)+haveExtraOffset
        });}else{
            res.status(400).json({
                success:false,
                message:"Failed To Fetch Company"
            })
        }
    
}catch(err){
    res.status(400).json({
        success:false,
        message:err.message
    })
}
})

app.get("/",(req,res)=>{
    res.status(200).send({
        success : true,
        message:"Hello"
    })
})
app.listen(5000,()=>{
    console.log("Serve is running on port 5000");
});


