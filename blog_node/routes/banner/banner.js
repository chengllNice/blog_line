
/*
* 后台管理banner轮播
* */

const Image = require('../../schema/image');
const GLOBAL = require('../GLOBAL');

const uploader = require('../multer/multer');
let fs = require('fs');

//添加上传图片
const upload = (req, res, next) => {
  let upload = uploader.single('banner');
  upload(req, res, (err) => {
    if(err){
      res.json({
        status: 1,
        message: '上传图片失败',
        data: ''
      })
    }else{
      GLOBAL.image = req.file.path;
      res.json({
        status: 0,
        message: '上传图片成功',
        data: ''
      })
    }
  })
};

// 确定添加图片信息
const uploadImage = (req, res, next) => {
  let href = req.body.href;
  let title = req.body.title;
  let path = GLOBAL.image.slice(7);
  new Image({
    url: path,
    href: href,
    title: title
  }).save((err) => {
    if(!err){
      res.json({
        status: 0,
        message: '图片信息保存成功',
        data: ''
      })
    }else{
      res.json({
        status: 1,
        message: '图片信息保存失败',
        data: ''
      })
    }
  })
};

// 图片列表
const imageList = (req, res, next) => {
  Image.find({}).sort({_id: -1}).then((result) => {
    res.json({
      status: 0,
      message: '查询图片列表成功',
      data: result
    })
  })
};

// 轮播图片列表
const bannerImageList = (req, res, next) => {
  Image.find({
    isShow: true
  }).sort({_id: -1}).then((result) => {
    res.json({
      status: 0,
      message: '查询图片列表成功',
      data: result
    })
  })
};

// 添加或移出轮播图
const changeBannerImageList = (req, res, next) => {
  let imageList = req.body.imageList;
  let isShow = Boolean(req.body.isShow);
  Image.update({
    _id: {
      $in: imageList
    }
  },{
    $set: {
      isShow: isShow
    }
  },{
    multi: true
  }).then((result) => {
    res.json({
      status: 0,
      message: '改变成功',
      data: ''
    })
  })
};

// 删除图片
const deleteImage = (req, res, next) => {
  let imageList = req.body.imageList;
  Image.find({
    _id: {
      $in: imageList
    }
  }).then((result) => {
    let num = 0;
    result.forEach((item, index) => {
      fs.unlink('../dist/'+item.url, (err) => {
        num++
      })
    });
    Image.remove({
      _id: {
        $in: imageList
      }
    }).then((result01) => {
      res.json({
        status: 0,
        message: '',
        data: ''
      })
    })
  });
};

module.exports = {
  upload,
  uploadImage,
  imageList,
  bannerImageList,
  changeBannerImageList,
  deleteImage
};