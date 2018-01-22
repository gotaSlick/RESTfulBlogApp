var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //so that express goes to look for static files in the public directory
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
//the blog posts will have title, image, 
//body (text), and created (the date when it was created):
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    // it could also have a default value as an image example: {type: String, default: image.jpg};
    body: String,
    created: {
        type: Date,
        default: Date.now
    } //says that created is a date and there is the default value set to date.now
});
var Blog = mongoose.model("Blog", blogSchema); //compile the schema into the model

//RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err)
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    //Create blog
    Blog.create(req.body.blog,/*data*/ function(err, newBlog){ // 2 args: data, callback. 
        // data here is req.body.blog inside of the form in new.ejs, 
        // in this case blog[title], blog[image] and blog[body] (grouped together)
        // so that if.blog is requested, it automatically has title, image and body.
        if(err){
            res.render("new"); //renders the NEW form again
        } else {
            res.redirect("/blogs");
        }
    });
});
// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        // id is id, and blog comes from .ejs file (blog[title], blog[body], blog[image])
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id); //renders the show page. 
            // req.params.id is same as updatedBlog argument.
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, deleted){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("delete", {blog: deleted});
        }
    });
});

app.listen(3000, function () {
    console.log("server is running");
});
