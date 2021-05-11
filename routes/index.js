var express = require('express');
var router = express.Router();
var dbConnect = 'mongodb+srv://admin:admin@cluster0.flsq9.mongodb.net/thi?retryWrites=true&w=majority';
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect(dbConnect, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('connected')
});
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  }
})


var upload = multer({
  dest: './uploads/'
  , storage: storage,
  limits: {
    filesize : 1000*1000 // gioi han file size <= 1MB
  },fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png') { //chi upload duoi jpg
      req.fileValidationError = 'Chi duoc tai len tep png';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
  }
}).array('avatar',3)   //giới hạn 3 file
var lich = new mongoose.Schema({
  name: String,
  sdt:String,
  time:String,
  note:String,

})
/* GET home page. */
router.get('/', upload, function (req, res, next) {
  var userConnect = db.model('lich',lich);

  userConnect.find({}, function (error, users) {
    var type = 'home';
    try {
      type = req.query.type;
    } catch (e) {
    }
    if (error) {
      res.render('index', {title: 'Express : ' + error});
      return
    }
    if (type == 'json') {
      res.send(users)
    } else {
      res.render('index', {title: 'Đặt Lịch', users: users});
    }

  })
});

router.post('/insertUser', upload, function (req, res) {
  var connect = db.model('lich', lich);
  connect({
    name:req.body.name,
    time:req.body.time,
    sdt:req.body.sdt,
    note:req.body.note,
  }).save(function (error) {
    if (error) {
      res.render('index', {title: 'Express : Error!!!!'});
    } else {
      res.render('index', {title: 'Express : Đặt Lịch Thành Công!!!!'});
    }
  })
})

/*router.get('/getUsers',function (req,res) {
  var connectUsers = db.model('users',thi);
  var baseJson  = {
    errorCode:undefined,
    errorMessage:undefined,
    data:undefined
  }
  connectUsers.find({},function (err,users) {
    if (err){
      baseJson.errorCode=403
      baseJson.errorMessage='403 Forbidden'
      baseJson.data = []
    }else {
      baseJson.errorCode=200
      baseJson.errorMessage='OK'
      baseJson.data = users
    }
    res.send(baseJson);
  })

})*/

module.exports = router;