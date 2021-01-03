var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer") ;
var methodOverride = require("method-override")
// var expressSanitizer = require("express-sanitizer")

app = express();

mongoose.connect("mongodb://localhost/blogs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
// app.use(expressSanitizer)

// Mongoose config

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);


//Routes

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
   Blog.find({} , function(err , blogs){
       if(err){
           console.log("oh no error")
       }
       else {
           res.render("index" , {blogs : blogs})
       }
   })
});


app.get("/blogs/new" , function(req, res){
    res.render("new") ;
})

//Create route

app.post("/blogs" , function(req, res){

    // Blog.create(req.body.blog ,  )
    // req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog , function(err ,newBlog){
        if(err){
            res.render("new")
        }
        else{ 
            res.redirect("/blogs")
        }
    }
    )
})

//show route

app.get("/blogs/:id" , function(req, res){
    Blog.findById(req.params.id , function(err , foundBlog ){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show" , {blog  : foundBlog})
        }
    })
})

//this is the edit route

app.get("/blogs/:id/edit", function(req, res){

    Blog.findById(req.params.id , function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit" , {blog: foundBlog})
        }

    })
})

//this is the update route

app.put("/blogs/:id" , function(req, res){
    // req.body.blog.body = req.sanitize(req.body.blog.body)

    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
       if(err){
           res.redirect("/blogs")
       } 
       else{
           res.redirect("/blogs/" + req.params.id)
       }
    })
})

//this is the delte route

app.delete("/blogs/:id" , function(req, res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")

        }
        

    })

})
 

app.listen(3000, function () {
  console.log("the server has started....");
});
