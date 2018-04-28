
const CustomModule = require('../../schema/customModule');
const upload = require('../multer/multer');
const fs = require('fs');

// 上传图片
const moduleUpload = (req, res, next) => {
  let uploader = upload.single('module');
  uploader(req, res, (err) => {
    if(err){
      res.json({
        status: 1,
        message: '上传失败'
      })
    }else{
      res.json({
        status: 0,
        message: '上传成功',
        data: req.file.path.slice(7)
      })
    }
  })
};

// 删除图片
const deleteUploadImage = (req, res, next) => {
  let path = req.body.path;
  fs.unlink('../dist/'+path, (err) => {
    if(err){
      res.json({
        status: 1,
        message: '删除图片失败'
      })
    }else{
      res.json({
        status: 0,
        message: '删除图片成功'
      })
    }
  })

};

// 添加自定义模块
const addCustomModule = (req, res, next) => {
  let name = req.body.name;
  let sortIndex = req.body.sortIndex;
  let moduleType = req.body.moduleType;//0:文本列表  1：图片展示
  let content = req.body.content;
  let mark = true;
  //默认图片类型不展示模块名
  if(moduleType === '1'){
    mark = false
  }

  new CustomModule({
    name: {
      text: name,
      mark: mark
    },
    sortIndex: sortIndex,
    moduleType: moduleType,
    content: content
  }).save((err) => {
    if(err){
      res.json({
        status: 1,
        message: '保存失败',
        data: ''
      })
    }else{
      res.json({
        status: 0,
        message: '保存成功',
        data: ''
      })
    }
  });
};

// 获取模块列表
const getCustomModuleList = (req, res, next) => {
  CustomModule.find({}).sort({sortIndex: 1}).then((result) => {
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
};

// 修改模块展示状态
const changeModuleStatus = (req, res, next) => {
  let id = req.body.id;
  CustomModule.findOne({
    _id: id
  }).then((result01) => {
    let status = !result01.status;
    CustomModule.updateOne({
      _id: id
    },{
      $set: {
        'status': status
      }
    }).then((result) => {
      if(result.n){
        res.json({
          status: 0,
          message: '修改成功',
          data: result
        })
      }else{
        res.json({
          status: 1,
          message: '修改失败'
        })
      }
    })
  });
};

// 修改模块name展示状态
const changeModuleNameMark = (req, res, next) => {
  let id = req.body.id;
  CustomModule.findOne({
    _id: id
  }).then((result01) => {
    CustomModule.updateOne({
      _id: id
    },{
      $set: {
        'name.mark': !result01.name.mark
      }
    }).then((result) => {
      if(result.n){
        res.json({
          status: 0,
          message: '修改成功',
          data: result
        })
      }else{
        res.json({
          status: 1,
          message: '修改失败'
        })
      }
    })
  });
};

// 编辑模块
const editModule = (req, res, next) => {
  let id = req.body.id;
  let name = req.body.name;
  let sortIndex = req.body.sortIndex;
  let content = req.body.content;
  CustomModule.updateOne({
    _id: id
  },{
    $set: {
      'name.text': name,
      sortIndex: sortIndex,
      content: content
    }
  }).then((result) => {
    if(result.n){
      res.json({
        status: 0,
        message: '修改成功',
        data: result
      })
    }else{
      res.json({
        status: 1,
        message: '修改失败',
        data: ''
      })
    }
  })
};

// 删除模块
const deleteModule = (req, res, next) => {
  let id = req.body.id;
  CustomModule.findOne({
    _id: id
  }).then((result01) => {
    if(result01.moduleType == '1'){
      fs.unlink('../dist/'+result01.content[0].url, (err) => {
        if(err){
          res.json({
            status: 1,
            message: '删除模块失败'
          })
        }else{
          CustomModule.remove({
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
                status: 1,
                message: '删除失败',
                data: ''
              })
            }
          })
        }
      })
    }
  })
};

// 获取模块详情
const getModuleDetail = (req, res, next) => {
  let id = req.query.id;
  CustomModule.findOne({
    _id: id
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

module.exports = {
  moduleUpload,
  deleteUploadImage,
  addCustomModule,
  getCustomModuleList,
  changeModuleStatus,
  changeModuleNameMark,
  editModule,
  deleteModule,
  getModuleDetail
};