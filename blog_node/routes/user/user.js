
/*
* 后台管理部分
* */
const User = require('../../schema/user');

// 登出
const loginOut = (req, res, next) => {
  delete req.session.userInfo;
  res.json({
    status: 0,
    message: '退出成功',
    data: ''
  })
};

//获取用户登录信息
const getUserInfo = (req, res, next) => {
  let id = '';
  if(req.session.userInfo.id){
    id = req.session.userInfo.id;
    User.findOne({
      _id: id
    }).then((result) => {
      if(!result){
        res.json({
          status: 1,
          message: '无该用户，请重新登录',
          data: result
        })
      }else{
        res.json({
          status: 0,
          message: '登录成功',
          data: result
        })
      }
    })
  }else{
    res.json({
      status: 1,
      message: '未登录',
      data: ''
    })
  }
};

// 用户添加
const addUser = (req, res, next) => {
  let name = req.body.name;
  let showName = req.body.showName;
  let password = req.body.password;
  let superAdmin = req.body.superAdmin === '0' ? true : false;
  User.findOne({
    $or: [
      {
        name: name
      },
      {
        showName: showName
      }
    ]
  }).then((result) => {
    if(result){
      res.json({
        status: 1,
        message: '用户名或展示名已经存在',
        data: ''
      })
    }else{
      new User({
        name: name,
        showName: showName,
        password: password,
        superAdmin: superAdmin
      }).save(function (err) {
        if(err){
          res.json({
            status: 1,
            message: '添加管理员失败',
            data: ''
          })
        }else{
          res.json({
            status: 0,
            message: '添加管理员成功',
            data: ''
          })
        }
      });
    }
  });
};
// 用户删除
const deleteUser = (req, res, next) => {
  let id = req.query.userId;
  User.deleteOne({
    _id: id
  }).then((result) => {
    if(result.n){
      res.json({
        status: 0,
        message: '删除成功',
        data: result
      })
    }else{
      res.json({
        status: 0,
        message: '删除成功',
        data: result
      })
    }
  })
};
// 获取用户列表
const userList = (req, res, next) => {
  let page = req.query.page || 1;//当前页
  let pageSize = 10;//每页显示数量
  let count = 0;//数据总量
  let pageCount = 0;//页码总数
  let searchText = req.query.searchText || '';//查询字段

  let selector = {};//查询条件
  if(searchText){
    selector = {
      name: searchText
    }
  }

  let limit = pageSize;
  let skip = (page - 1) * limit;
  User.find(selector).then((result) => {
    count = result.length;
    pageCount = Math.ceil(count/pageSize);
    if(result.length){
      User.find(selector).skip(skip).limit(limit).sort({createdDate: -1}).then((result01) => {
        res.json({
          status: 0,
          message: '查询用户成功',
          data: result01,
          pagenation: {
            page: page,
            count: count,
            pageSize: pageSize,
            pageCount: pageCount
          }
        })
      })
    }else{
      res.json({
        status: 1,
        message: '无此用户',
        data: result
      })
    }
  });
};
//根据用户名查询用户ID
const userId = (req, res, next) => {
  let searchText = req.query.searchText;
  User.findOne({
    name: searchText
  }).then((result) => {
    if(result){
      res.json({
        status: 0,
        message: '查询成功',
        data: result
      })
    }else{
      res.json({
        status: 1,
        message: '查询失败',
        data: result
      })
    }
  })
};
//修改密码
const editPsd = (req, res, next) => {
  let id = req.body.userId;
  let password = req.body.password;
  console.log(password)

  User.updateOne({
    _id: id
  },{
    $set: {
      password: password
    }
  }).then((result) => {
    if(result.n){
      delete req.session.userInfo;
      res.json({
        status: 0,
        message: '修改密码成功',
        data: ''
      })
    }else{
      res.json({
        status: 1,
        message: '修改密码失败',
        data: ''
      })
    }
  });
};

module.exports = {
  loginOut,
  getUserInfo,
  addUser,
  deleteUser,
  userList,
  userId,
  editPsd
};