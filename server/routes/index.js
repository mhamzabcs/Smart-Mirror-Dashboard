var express = require('express');
var router = express.Router();

router.get('/wakeup', function(req, res, next) {
	console.log('WAKING UP');
	res.status(200).send("WAKEUP");
});


module.exports = router;