
var mongoose=require("mongoose");


var commentSchema=new mongoose.Schema({
    
    name:String,
    body:String
});
module.exports = mongoose.model("comment",commentSchema);
