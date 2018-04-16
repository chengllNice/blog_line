const express = require('express');
const router = express.Router();
const Category = require('../schema/category');
const Subcategory = require('../schema/subcategory');
const User = require('../schema/user');
const Article = require('../schema/article');
const CustomModule = require('../schema/customModule');
const Image = require('../schema/image');

//查询博文列表
router.get('/articleList', (req, res, next) => {
  let page = req.query.page || 1;
  let pageSize = 10;
  let count = 0;
  let pageCount = 0;
  let searchText = req.query.searchText || '';//查询字段
  let subCategoryId = req.query.subCategoryId || '';//查询字段
  let selector = {
    status: true
  };//查询条件

  if(subCategoryId){
    selector = {
      status: true,
      subcategory: subCategoryId
    }
  }
  if(searchText){
    selector = {
      status: true,
      title: {
        $regex: searchText,
        $options: "$i"
      }
    }
  }
  let limit = pageSize;
  let skip = (page - 1) * limit;
  Article.find(selector).then((result) => {
    if (result.length) {
      count = result.length;
      pageCount = Math.ceil(count / pageSize);
      Article.find(selector).populate(['user', 'subcategory']).skip(skip).limit(limit).sort({updateDate: -1}).then((result01) => {
        res.json({
          status: 0,
          message: '查询成功',
          data: result01,
          pagenation: {
            count: count,
            pageCount: pageCount,
            pageSize: pageSize,
            page: page
          }
        })
      })
    } else {
      res.json({
        status: 1,
        message: '没有查询到任何数据',
        data: result
      })
    }
  });
});

// 博文详情
router.get('/articleDetail', (req, res, next) => {
  let id = req.query.articleId || '';
  Article.findOne({
    _id: id
  }).populate(['user', 'subcategory']).then((result) => {
    let num = Number(result.views)+1;
    Article.update({
      _id: id
    },{
      $set: {
        views: num
      }
    }).then((r) => {

    });
    res.json({
      status: 0,
      message: '',
      data: result
    })
  })
});

//获取目录列表
router.get('/getCategory', (req, res, next) => {
  Category.find({}).then((result) => {
    if (result.length) {
      res.json({
        status: 0,
        message: '数据查询成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '没有查询到数据',
        data: result
      })
    }
  })
});

// 查询子目录列表
router.get('/getSubCategory', (req, res, next) => {
  console.log(111)
  Subcategory.find({}).populate(['category']).sort({category: -1}).then((result) => {
    if (result.length) {
      res.json({
        status: 0,
        message: '数据查询成功',
        data: result
      })
    } else {
      res.json({
        status: 0,
        message: '没有查询到相关数据',
        data: result
      })
    }
  })
});

//博文评论信息保存
router.post('/commitText', (req, res, next) => {
  console.log(req.body)
  let articleId = req.body.articleId;
  let commitText = req.body.commitText;
  let userName = '匿名';
  let commitId = 0;

  Article.findOne({
    _id: articleId
  }).then((result) => {
    if(result.commit.length){
      commitId = result.commit[result.commit.length-1].id+1;
    }
    Article.updateOne({
      _id: articleId
    },{
      $push: {
        commit: {
          id: commitId,
          userName: userName,
          createdDate: new Date(),
          content: commitText
        }
      }
    }).then((result) => {
      if(result.n){
        res.json({
          status: 0,
          message: '添加评论成功',
          data: ''
        })
      }else{
        res.json({
          status: 1,
          message: '添加评论失败',
          data: ''
        })
      }
    })
  });
});

// 获取模块列表
router.get('/getCustomModuleList', (req, res, next) => {
  CustomModule.find({}).sort({sortIndex: -1}).then((result) => {
    if(result){
      res.json({
        status: 0,
        message: '查询成功',
        data: result
      })
    }else{
      res.json({
        status: 1,
        message: '查询失败'
      })
    }
  })
});

// 获取banner图片
router.get('/getBannerImage', (req, res, next) => {
  Image.find({
    isShow: true
  }).then((result) => {
    if(result){
      res.json({
        status: 0,
        message: 'banner列表查询成功',
        data: result
      })
    }
  })
});

module.exports = router;