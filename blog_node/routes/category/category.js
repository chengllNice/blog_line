/*
* 后台管理目录部分
* */

const Category = require('../../schema/category');
const Subcategory = require('../../schema/subcategory');

// 添加目录
const addCategory = (req, res, next) => {
  let name = req.body.name || '';
  console.log(111)
  Category.findOne({
    name: name
  }).then((result) => {
    if (!result) {
      new Category({
        name: name
      }).save(function (err, doc) {
        if (err) {
          res.json({
            status: 1,
            message: err
          })
        } else {
          res.json({
            status: 0,
            message: '保存数据成功'
          })
        }
      });
    } else {
      res.json({
        status: 1,
        message: '该分类已经存在'
      })
    }
  });
};
//获取目录列表
const getCategory = (req, res, next) => {
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
};
//删除目录
const deleteCategory = (req, res, next) => {
  let id = req.query.categoryId || '';
  Category.deleteOne({
    _id: id
  }).then((result) => {
    if (result.n) {
      res.json({
        status: 0,
        message: '目录删除成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '目录删除失败',
        data: result
      })
    }
  })
};
//添加子目录
const addSubCategory = (req, res, next) => {
  let categoryId = req.body.categoryId || '';
  let name = req.body.name || '';
  console.log(categoryId)
  if (!categoryId || !name) {
    res.json({
      status: 1,
      message: '没有传入数据',
      data: ''
    })
  }
  Subcategory.findOne({
    name: name
  }).then((result) => {
    if (!result) {
      Category.findOne({
        _id: categoryId
      }).then((result01) => {
        console.log(result01)
        if (result01) {
          new Subcategory({
            name: name,
            category: categoryId.toString()
          }).save(function (err) {
            if (err) {
              res.json({
                status: 1,
                message: '添加子目录失败',
                data: ''
              })
            } else {
              res.json({
                status: 0,
                message: '添加子目录成功',
                data: ''
              })
            }
          });
        } else {
          res.json({
            status: 0,
            message: '该分类父级目录不存在',
            data: ''
          })
        }
      });
    } else {
      res.json({
        status: 1,
        message: '该子目录已经存在',
        data: ''
      })
    }
  })
};
// 查询子目录列表
const getSubCategory = (req, res, next) => {
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
};
//修改子目录所属目录
const editSubCategory = (req, res, next) => {
  let categoryId = req.body.categoryId || '';
  let subCategoryId = req.body.subCategoryId || '';
  Subcategory.updateOne({
    _id: subCategoryId
  }, {
    category: categoryId
  }).then((result) => {
    if (result.n) {
      res.json({
        status: 0,
        message: '修改成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '修改失败',
        data: result
      })
    }
  })
};
//删除子目录
const deleteSubCategory = (req, res, next) => {
  let id = req.query.subCategoryId || '';
  Subcategory.deleteOne({
    _id: id
  }).then((result) => {
    if (result.n) {
      res.json({
        status: 0,
        message: '子目录删除成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '子目录删除失败',
        data: result
      })
    }
  })
};

module.exports = {
  addCategory,
  getCategory,
  deleteCategory,
  addSubCategory,
  getSubCategory,
  editSubCategory,
  deleteSubCategory
};