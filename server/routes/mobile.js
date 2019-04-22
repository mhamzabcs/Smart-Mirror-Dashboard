var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
    res.status(200).send({msg:"Trying to Log in!"});
    req.io.emit('login', req.body.username);
});

router.get('/logout', function(req, res, next) {
    res.status(200).send({msg:"Trying to Log out!"});
    req.io.emit('logout');
});

router.post('/response', function(req, res, next) {
    res.status(200).send("Response Sent!");
    req.io.emit('response', req.body.response);
});

router.post('/getAlarms', function(req, res, next) {
  console.log("In get_alarms");
  console.log(req.body.username);
  var db = req.db;
  var alarmsCollection = db.get("alarms");
  alarmsCollection.find({'username':req.body.username}, {}, function(err, alarms){
    console.log(alarms)
    if(alarms.length === 0){
      console.log('no alarms for this user');
      res.status(200).send({msg:'no alarms'});
    }
    else{
      console.log('alarms for this user exist');
      res.status(200).send(alarms);
    }
  })
});

router.post('/sendAlarm', function(req, res, next) {
  const alarm = {
    day: req.body.day, 
    time: req.body.time, 
    dayNumber: req.body.dayNumber,
    hours: req.body.hours,
    minutes: req.body.minutes,
    username: req.body.username
  }
  res.status(200).send('Alarm Sent!');
  req.io.emit('alarms', alarm);
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
    req.io.emit('reminders', { username:req.body.username });
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
    if(reminders.length === 0){
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
  req.io.emit('reminders', { _id:req.body.id });
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
  req.io.emit('reminders', { _id:req.body.id });
  res.status(200).send({msg:"reminder updated"});
});


module.exports = router;