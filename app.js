const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const path=require('path');

const data = require("./models/data");

const app = express()
app.use(bodyparser.json())


// Task1: initiate app and run server at 3000

PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server Listening on ${PORT}`)
})


app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
console.log("app")

// Task2: create mongoDB connection 

const DB = "mongodb+srv://madhumathilabglo:nmPvyP4AHKQfDpLy@cluster0.9ioabxm.mongodb.net/employee?retryWrites=true&w=majority"
mongoose.connect(DB).then(()=>{
    console.log("Connected Successfully")
})
.catch(()=>{
    console.log("Connection Failed")
})


//TODO: get data from db  using api '/api/employeelist'

app.get("/",(req,res)=>{
    res.send("Server is running")
})

app.get("/api/employeelist",async(req,res,next)=>{
    try{
        const allEmployees = await data.find({})
        if(allEmployees.length > 0){
            res.status(200).json({datas:allEmployees})
        }
        else if(allEmployees.length === 0){
            return next(new Error("No employee are there"))
        }
    }

    catch(error){
        next(error)
    }

})


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get("/api/employeelist/:id",async(req,res,next)=>{
    const id = req.params.id
    try{
        const employee = await data.find({})
        const single_data = employee.filter((ele)=>ele.id === id)
        if(single_data.length > 0){
            res.status(200).json({datas:single_data})
        }
        else if(single_data.length === 0) {
            return next(new Error("id does not match"))
        }
    }
    catch(error){
        next(error)

        }
       
    })
    

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post("/api/employeelist",async(req,res,next)=>{
    const {name,location,position,salary}= req.body
    try{
        const userData = await data.create({name,location,position,salary})
        console.log(userData,"data")
            if(name === undefined || location === undefined || position === undefined || salary === undefined || name === "" || location === "" || position === "" || salary === ""){
                return next(new Error("All fields are required"))
            }
            else if(name != "" && location != "" && position!= "" && salary != ""){
                res.status(200).json({successmessage:"Employee Added Successfully",datas:userData})
            }
    }
    catch(error){
       next(error)
    }

})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete("/api/employeelist/:id",async(req,res,next)=>{
    const id = req.params.id
    try{
        const all_employees = await data.find({})
        const employee = await data.findByIdAndDelete(id)
        if(employee){
            res.status(200).json({message:"Employee deleted Successfully"})
        } 
        else if(employee === null){
            return next(new Error("The employee already deleted"))
        } 
        
    }
    catch(error){
        next(error)
    }
})


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put("/api/employeelist/:id",async(req,res)=>{
    const {name,location,position,salary} =  req.body
    const id = req.params.id
    try{
        let employee = await data.findByIdAndUpdate(id, {
            name :name,
            location : location,
            position : position,
            salary : salary
        })
        if(employee){
            res.status(201).json({successmessage:"Employee Updated Successfully"})
        }
    }
    catch(error){
        console.log(error)
    }
})


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: {
        message: err.message,
      },
    });
  });


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



