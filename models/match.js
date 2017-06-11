var mongoose=require("mongoose");
var comment= require("./comment.js");
var cricketSchema =new mongoose.Schema({
    
        match_id: String,
        
        comment:[{
            type : mongoose.Schema.Types.ObjectId,
            ref : "comment"
        }]
    
});
module.exports =mongoose.model("cricket",cricketSchema);

//erasing database
// comment.remove({},function(err){
//     if(err)
//     console.log("not able to remove cricket database");
    
    
// });
// match.remove({},function(err){
//     if(err)
//     console.log("not able to remove cricket database");
    
    
// });

//demo variable in database;
//=====================================================
// var cmnt=new comment({
    
//     name: "HARSH",
//     body:"This match is going to be interesting"
//                 });
// //=====================================================






// //=======================================================
// cmnt.save(function(err,cmnt){
//     if(err)
//     console.log("Error @ creating comment")
//     else
//     {          //console.log(cmnt);
     
//          var mtch=new match({
//              match_id: "1234"
//          });
         
//          mtch.save(function(err,mtch){
//              if(err)
//              console.log("ERROR @ creating a new match");
//              else
//              {
//                  mtch.comment.push(cmnt);
//                  mtch.save(function(err,mtch){
//                      if(err)
//                      console.log("ERROR @ merging comment and match");
                     
                     
                     
//                  })
                 
                 
//              }
             
//          })
    
    
//     }
// });