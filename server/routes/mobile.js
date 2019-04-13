var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
    res.status(200).json({msg:"Logged in smart mirror"});
    req.io.emit('login', req.body.username);
});

router.get('/logout', function(req, res, next) {
    res.status(200).json({msg: "Logged out of smart mirror"});
    req.io.emit('logout');
});


router.post('/addReminder', function(req, res, next) {
  console.log("In add reminders");
  console.log(req.body);
  
  var db = req.db;

  var remindersCollection = db.get("reminders");
  
  remindersCollection.find({username:req.body.username}, {}, function(err, reminders){
      console.log('creating reminder for this user');
      remindersCollection.insert({
        description: req.body.text, 
        date: req.body.date, 
        username: req.body.username
      })
  })
  res.status(200).json({msg:'Reminder added'});
});

module.exports = router;