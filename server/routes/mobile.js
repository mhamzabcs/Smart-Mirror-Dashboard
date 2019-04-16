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

router.post('/getReminders', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.username);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.find({'username':req.body.username}, {}, function(err, reminders){
    console.log(reminders)
    if(reminders.length == 0){
      console.log('no reminders for this user');
      res.status(200).send({msg:'no reminders'});
    }
    else{
      console.log('reminders for this user exist');
      console.log(reminders)
      res.status(200).send(reminders);
    }
  })
});

router.post('/getOneReminder', function(req, res, next) {
  console.log("In get_reminders");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.find({'_id':req.body.id}, {}, function(err, reminders){
      res.status(200).send(reminders);
  })
});

router.post('/deleteReminder', function(req, res, next) {
  console.log("In del_reminders");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.remove( { "_id" : req.body.id } )
  res.json({msg:'reminder removed'});
});


router.post('/editReminder', function(req, res, next) {
  console.log("In del_reminders");
  console.log(req.body.id);
  var db = req.db;
  var reminderCollection = db.get("reminders");
  reminderCollection.update(
         { _id: req.body.id },{
           $set: {
              description:req.body.description,
              date: req.body.date
           }
          }
         )
  res.status(200).send({msg:"reminder updated"})
});


module.exports = router;