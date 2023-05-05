const mongoose = require("mongoose")
const {Schema,model}= mongoose

const dbSchema = new Schema({
    name:{type:String,required:true},
    location:{type:String,required:true},
    position:{type:String,required:false},
    salary:{type:Number,required:true}
})
const dbDatas = model("details",dbSchema)

module.exports = dbDatas
