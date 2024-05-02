var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const localStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));



//Here all routes are present
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {nav:false});
});
router.get('/register', function(req, res, next) {
  res.render("register" , {nav:false} );
});
router.get('/profile', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts");
  res.render("profile",{user , nav:true});
});

router.get('/add', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});

  res.render("add",{user , nav:true});
});

//code to create post
router.post('/createpost', isLoggedIn,upload.single('postimage') ,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
   const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
   });
   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile")
});

// upload code- we add isLoggedIN
router.post('/fileupload', isLoggedIn , upload.single('image'),async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

//register route code
router.post('/register', function(req, res) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    secret: req.body.secret,
  });

  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile");
      });
    })
    .catch(function(err) {
      // Handle registration error
      console.error("Registration error:", err);
      res.redirect("/register"); // Redirect to registration page with error message
    });
});


//Login code
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}), function(req ,res){})

//logout code
router.get('/logout', function(req ,res ,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  });
});

// code for middleware
function isLoggedIn(req ,res ,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

 

module.exports = router;
