let multer = require('multer');

let storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, '../dist/upload/images');
  },
  filename:(req, file, cb)=>{
    let fileFormat = (file.originalname).split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length-1])
  }
});

let uploadDir = multer({
  storage: storage
});

module.exports = uploadDir;