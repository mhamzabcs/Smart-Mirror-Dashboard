var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary')
var fs = require('fs');
var User = require('../models/user');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

cloudinary.config({ 
	cloud_name: 'dgq7bff58', 
	api_key: '859866388255326', 
	api_secret: 'sIaIoVREaUl0BLC036CZshoSs_o' 
});


var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/routes/python/face/')
  },
  filename: function (req, file, cb) {
    cb(null, 'my.png')
  }
})
var upload = multer({ storage: storage })

router.post('/upload', upload.single('file', 12),  function(req, res, next) {
	console.log('inside upload post');
	tags = req.body.username;
  const spawn = require("child_process").spawn;
  var dir = "/app/routes/" + "python/face/face_check.py";
  var img = "/app/routes/" + "python/face/my.png";
  console.log(dir);
  const pythonProcess = spawn('python',[dir, "--image" , img]);
  console.log('here')
  pythonProcess.stdout.on('data', (data) => {
    console.log('here 2')
    var sending = data.toString('utf8');
    sending = sending.trim()
    if (sending == 'face detected'){
      console.log('face detected')
      cloudinary.v2.uploader.upload(req.file.path, {tags: tags, width: '640'}, function(error, result) { 
        console.log("in");
        console.log(result, error)
      })
      res.send('uploaded');
    }
    else{
      console.log('face not detected');
      res.send('upload an image with a face');
    }
  })
});


//train pickle file
router.get('/train',  function(req, res, next) {
	console.log('inside train');
	var dir = "/app/routes/" + "python/face/new_encode.py";
	console.log(dir);
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',[dir]);
	console.log('here');
	pythonProcess.stdout.on('data', (data) => {
		var sending = data.toString('utf8');
		sending = sending.trim()
		console.log('data = ' + sending)
		res.json(sending);
	})
});

router.post('/register', function(req, res, next) {
  console.log("In register user");
  console.log(req.body);
    var nameRequired = 'Name required';
    var emailRequired = 'Email required';
    var emailInvalid = 'Invalid email';
    var usernameRequired = 'Username required';
    var passwordRequired = 'Password required';
    var passwordSame = 'Both passwords must be same';
    req.checkBody('name', nameRequired).notEmpty();
    req.checkBody('email', emailRequired).notEmpty();
    req.checkBody('email', emailInvalid).isEmail();
    req.checkBody('username', usernameRequired).notEmpty();
    req.checkBody('password', passwordRequired).notEmpty();
    req.checkBody('password2', passwordSame).equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.send(errors);
    }
    else{
      var newUser = new User(req.body); 
    // create User
    User.createUser(newUser, function(err,user){
      if(err) {
        console.log(err);
      }
    });
    res.send('User added');
    }
});

router.post('/setting', function(req, res, next) {
  console.log("In setting");
  console.log(req.body);
  
  var db = req.db;

  var widgetCollection = db.get("widgets");
  
  widgetCollection.find({username:req.body.username}, {}, function(err, widgets){
    if(widgets.length == 0){
      console.log('creating settings for this user');
      widgetCollection.insert({
        username: req.body.username,
        w1: req.body.w1, 
        w2: req.body.w2, 
        w3: req.body.w3, 
        w4: req.body.w4
      })
    }
    else{
      console.log('settings for this user exist');
      widgetCollection.update(
      { username: req.body.username },
      {
        username:req.body.username,
        w1: req.body.w1, 
        w2: req.body.w2, 
        w3: req.body.w3, 
        w4: req.body.w4
      })
    }
  })
  res.send('User added');
});


router.post('/login', passport.authenticate('local', {failureRedirect:'/users/fail'}), function(req,res,next){
  console.log(req.user.name);
  
  var user = {
    name: req.user.name,
    username: req.user.username,
    email: req.user.email,
    status: 'success'
  };
  console.log(user);
  res.send(user);
});

router.get('/fail', function(req,res,next){
   var user = {
      status: 'fail'
  }
  console.log('fail');
  res.send(user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
    User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if(isMatch){
              return done(null, user);
            }
            else{
              return done(null, false);
            }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = router;
