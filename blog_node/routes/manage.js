const express = require('express');
const router = express.Router();
const User = require('../schema/user');

// 分类管理路由
const user = require('./user/user');
const category = require('./category/category');
const article = require('./article/article');
const banner = require('./banner/banner');
const customModule = require('./customModule/customModule');

// 用户信息类
class UserInfo {
  constructor(info) {
    this.name = info.name || '';
    this.password = info.paaword || '';
    this.id = info.id || '';
    this.superAdmin = info.superAdmin || '';
  }
}

//判断用户是否登录
router.use((req, res, next) => {
  if (!req.session.userInfo) {
    req.session.userInfo = {
      name: '',
      password: '',
      id: '',
      superAdmin: ''
    }
  }
  next();
});

/*用户部分*/
// 登录
router.post('/login', (req, res, next) => {
  let name = req.body.name || '';
  let password = req.body.password || '';
  User.findOne({
    name: name,
    password: password
  }).then((result) => {
    if (result) {
      let id = result._id.toString();
      req.session.userInfo = new UserInfo({
        id: id,
        password: result.password,
        name: name,
        superAdmin: result.superAdmin
      });
      res.json({
        status: 0,
        message: '登录成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '该用户不存在',
        data: result
      })
    }
  })
});
//登出
router.get('/loginOut', user.loginOut);
//获取用户登录信息
router.get('/getUserInfo', user.getUserInfo);
// 用户添加
router.post('/addUser', user.addUser);
// 用户删除
router.get('/deleteUser', user.deleteUser);
// 获取用户列表
router.get('/userList', user.userList);
//根据用户名查询用户ID
router.get('/userId', user.userId);
//修改密码
router.post('/editPsd', user.editPsd);

/*目录部分*/
// 添加目录
router.post('/addCategory', category.addCategory);
//获取目录列表
router.get('/getCategory', category.getCategory);
//删除目录
router.get('/deleteCategory', category.deleteCategory);
//添加子目录
router.post('/addSubCategory', category.addSubCategory);
// 查询子目录列表
router.get('/getSubCategory', category.getSubCategory);
//修改子目录所属目录
router.post('/editSubCategory', category.editSubCategory);
//删除子目录
router.get('/deleteSubCategory', category.deleteSubCategory);

/*博文部分*/
// 添加博文
router.post('/addArticle', article.addArticle);
//查询博文列表
router.get('/articleList', article.articleList);
//按目录搜索时先返回目录Id
router.get('/getsubcategoryId', article.getsubcategoryId);
//编辑博文
router.post('/editArticle', article.editArticle);
// 删除博文
router.get('/deleteArticle', article.deleteArticle);
// 博文详情
router.get('/articleDetail', article.articleDetail);
//删除评论内容
router.get('/deleteCommit', article.deleteCommit);
router.post('/changeArticleStatus', article.changeArticleStatus);

/*图片banner管理*/
//添加上传图片
router.post('/upload', banner.upload);
// 确定添加图片信息
router.post('/uploadImage', banner.uploadImage);
// 图片列表
router.get('/imageList', banner.imageList);
// 轮播图片列表
router.get('/bannerImageList', banner.bannerImageList);
// 添加或移出轮播图
router.post('/changeBannerImageList', banner.changeBannerImageList);
// 删除图片
router.post('/deleteImage', banner.deleteImage);

/*自定义模块*/
//上传图片
router.post('/moduleUpload', customModule.moduleUpload);
// 删除上传的图片
router.post('/deleteUploadImage', customModule.deleteUploadImage);
// 添加模块
router.post('/addCustomModule', customModule.addCustomModule);
// 获取模块列表
router.get('/getCustomModuleList', customModule.getCustomModuleList);
// 修改模块展示状态
router.post('/changeModuleStatus', customModule.changeModuleStatus);
// 修改模块展示名展示状态
router.post('/changeModuleNameMark', customModule.changeModuleNameMark);
// 修改模块
router.post('/editModule', customModule.editModule);
// 删除模块
router.post('/deleteModule', customModule.deleteModule);
// 获取模块详情
router.get('/getModuleDetail', customModule.getModuleDetail);

module.exports = router;