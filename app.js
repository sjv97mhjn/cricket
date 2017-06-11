var express=require("express"),
    request=require("request"),
    bodyparser=require("body-parser"),
    cricapi = require("node-cricapi"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    localStrategy=require("passport-local"),
    user=require("./models/user.js"),
    passportLocalMongoose=require("passport-local-mongoose");
    
var app=express();
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(express.static("public"));
    mongoose.connect("mongodb://localhost/cricket_api");  
    app.use(require("express-session")({
        secret:"My_Name_Is_Sajeev_Mahajan",
        resave:false,
        saveUninitialized :false
        
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(user.authenticate()));
    passport.serializeUser(user.serializeUser());
    passport.deserializeUser(user.deserializeUser());
    // SETTING UP MONGO DATABSE SCHEMA AND OBJECT

    var match=require("./models/match.js");
    var comment=require("./models/comment.js");
    
    //=======================================================

    // ROUTES
    
    //========================================================================================================
    app.get("/",function(req,res){
        res.redirect("/cricket")
    
    
    })
    
    //========================================================================================================
    app.get("/cricket",function(req,res){
        
        //res.send("coming soon");
      //console.log(cricapi.cricketMatches());
        res.render("home.ejs");
    })
    // SHOW LIST OF NEW MATCHES
    //========================================================================================================
    app.get("/nmatches",isloggedin,function(req,res){
        
            request("http://cricapi.com/api/matches?apikey=ArSnUffgneYbWoHhvFcBApr00BO2",function(e,r,body)  // APPLICATION PROGRAM INTERFACE
    {
        if(!e&&r.statusCode==200)
        {
            var results=JSON.parse(body);
            
            //console.log(results);
            results["matches"].forEach(function(Match){
                //console.log(match["unique_id"]);
                
            match.find({match_id: Match["unique_id"]},function(err,mtch){
                //console.log(mtch.match_id);
               
                
                if(!mtch[0])
                {
                var mtch=new match({
                    
                    match_id:Match["unique_id"]
                })
                //mtch.comment.push("this is new comment");
                mtch.save(function(err,mtch)
                {
                    console.log("====================================")
                    console.log(mtch);
                    console.log("=====================================")
                })
                }
            
            });
                
            })
            
            
        
        
            
        res.render("newmatches.ejs",{matches: results["matches"]});
            
        
       // res.send(results["Search"][0]["Title"]);    
        
        }
        else
        console.log("ERRRRRRRROR");
        
        
    })
        
        
        
        
    })
   //=================================================================================
                  //SHOW DETAILS OF A PARTICULAR MATCH
   app.get("/nmatches/score/:id",function(req,res){
      cricapi.ballByBall(req.params.id, function(ball){ 
          var balls = JSON.parse(ball);
      console.log("2222222222222222222222222");
      console.log(balls);
      console.log("111111111111111111111111111")
          
      });
          
    
      cricapi.cricketScores(req.params.id, function(_score) { 
			var score = JSON.parse(_score, null, 2);
			//console.log("Got scores for unique_id ", req.params.id, ": bundle of", _score.length, " bytes");
			console.log(score);
			//yel.findById(req.params.id).populate("comment").exec(function(err,x)
			match.find({match_id: req.params.id}).populate("comment").exec(function(err,mtch){
			   if(err)
			   console.log("error1 @ finding a match");
			   else
			  { console.log(mtch);
			    res.render("score.ejs",{score : score,match: mtch[0]});
			  } 
			})
			
		});
		
		
		
	//	res.redirect("/nmatches");
		
		
       
       
   })
   
   //================================================================================
   //ADD A COMMENT
     app.post("/comment/:id",function(req,res){
       
       var commentnew= new comment({
           
           name: req.body.name,
           body: req.body.body
           
       });
       
       
       commentnew.save(function(err,commentnew){
           if(err)console.log("error1");
           else
           {
               console.log(commentnew);
               match.find({match_id:req.params.id},function(err,matchnew){
                   
                   if(err)console.log("error2");
                   else
                   console.log(matchnew);
                   matchnew[0].comment.push(commentnew);
                   matchnew[0].save(function(err,mtch){
                       
                       if(err)console.log("err3");
                       else 
                       res.redirect("/nmatches/score/" + req.params.id);
                       
                   });
                   
                   
                   
               })
               
               
               
           }
       })
       
       
       
       
       
       
    })
   
   //===============================================================================
   //DELETE A Comment
   app.get("/nmatches/score/delete/:id1/:id2",function(req,res){
       
       var m=req.params.id1;
       var c=req.params.id2;
       match.find({match_id:m},function(err,matchnew){
                   
                   if(err)console.log("error3");
                   else
                   {
                       comment.findByIdAndRemove(c,function(err,cmnt){
                           if(err)
                           console.log("error4");
                           else
                           res.redirect("/nmatches/score/" + m);
                       })
                       
                       
                       
                   }
                       
                   });
       
   })
   
    //===============================================================================
    //Authemtication Routes
    //Registeration
    app.get("/register",function(req,res){
        
        res.render("register.ejs");
    })
    app.post("/register",function(req,res){
        user.register(new user({username: req.body.username}),req.body.password,function(err,user){
            if(err){
                console.log("Error in registration");
                return res.render("register.ejs");
                }
            passport.authenticate("local")(req,res,function(){
                
                res.redirect("/login")
            })
            
        })
        
    })
    //Login
    app.get("/login",function(req,res){
        
        res.render("login.ejs");
    })
    app.post("/login",passport.authenticate("local",{
        successRedirect:"/nmatches",
        failureRedirect:"/login"
    }),function(req,res){
        
        res.send("Working")
    })
    //LOGOUT
    app.get("/logout",function(req,res){
        req.logout(); 
        res.redirect("/cricket")
    })
    
    function isloggedin(req,res,next){
        if(req.isAuthenticated())
        {
            return next();
        }
        res.redirect("/login");
        
    }
    app.get("/about",function(req,res){
        
        res.render("about.ejs");
    })
    //================================================================================
    app.listen(process.env.PORT,process.env.IP,function(req,res){
        
        
        console.log("Server started from :");
        console.log(process.env.IP);
        
        
    })