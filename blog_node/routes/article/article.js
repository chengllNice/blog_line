
/*
* 后台管理博文部分
* */

const Category = require('../../schema/category');
const Subcategory = require('../../schema/subcategory');
const User = require('../../schema/user');
const Article = require('../../schema/article');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// 添加博文
const addArticle = (req, res, next) => {
  let title = req.body.title;
  let description = req.body.description;
  let tags = req.body.tags;
  let content = req.body.content;
  let user = req.body.userId;
  let subcategory = req.body.subcategory;//子目录ID
  let markType = req.body.markType;//子目录ID

  if (title && description && content && user && subcategory && markType) {
    new Article({
      title: title,
      description: description,
      tags: tags,
      content: content,
      subcategory: subcategory,
      user: user,
      markType: markType
    }).save(function (err) {
      if (err) {
        res.json({
          status: 1,
          message: '博文添加失败',
          data: ''
        })
      } else {
        res.json({
          status: 0,
          message: '博文添加成功',
          data: ''
        })
      }
    });
  } else {
    res.json({
      status: 1,
      message: '博文添加失败，请输入完整的信息',
      data: ''
    })
  }
};
//查询博文列表
const articleList = (req, res, next) => {
  let page = req.query.page || 1;
  let pageSize = 10;
  let count = 0;
  let pageCount = 0;
  let searchText = req.query.searchText || '';//查询字段
  let condition = req.query.condition || '';//按条件查询
  let selector = {};//查询条件
  if (condition === '1') {//按标题查询
    selector = {
      title: {
        $regex: searchText,
        $options: '$i'
      }
    }
  }
  if (condition === '2') {//按内容查询
    selector = {
      content: {
        $regex: searchText,
        $options: '$i'
      }
    }
  }

  if (condition === '3') {//按内容查询
    selector = {
      user: searchText
    }
  }

  if (condition === '0') {//按子目录查询
    selector = {
      subcategory: searchText
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
};
//按目录搜索时先返回目录Id
const getsubcategoryId = (req, res, next) => {
  let name = req.query.searchText || '';
  Subcategory.findOne({
    name: name
  }).then((result) => {
    if (result) {
      res.json({
        status: 0,
        message: '查找目录成功',
        data: result
      })
    } else {
      res.json({
        status: 1,
        message: '查找目录失败',
        data: result
      })
    }
  })
};
//编辑博文
const editArticle = (req, res, next) => {
  let id = req.body.articleId || '';
  let title = req.body.title || '';
  let description = req.body.description || '';
  let tags = req.body.tags || '';
  let content = req.body.content || '';
  let subcategory = req.body.subcategory || '';

  if (title && description && content && subcategory) {
    Article.update({
      _id: id
    }, {
      $set: {
        title: title,
        description: description,
        tags: tags,
        content: content,
        subcategory: subcategory,
        updateDate: Date.now()
      }
    }).then((result) => {
      res.json({
        status: 0,
        message: '修改成功',
        data: result
      })
    })
  } else {
    res.json({
      status: 1,
      message: '修改失败，请输入完整的信息',
      data: ''
    })
  }
};
// 删除博文
const deleteArticle = (req, res, next) => {
  let id = req.query.articleId || '';
  Article.deleteOne({
    _id: id
  }).then((result) => {
    res.json({
      status: 0,
      message: '删除成功',
      data: result
    })
  })
};
// 博文详情
const articleDetail = (req, res, next) => {
  let id = req.query.articleId || '';
  Article.findOne({
    _id: id
  }).then((result) => {
    if(result){
      res.json({
        status: 0,
        message: '博文查询成功',
        data: result
      })
    }else{
      res.json({
        status: 1,
        message: '博文查询失败',
        data: result
      })
    }
  })
};
//删除评论内容
const deleteCommit = (req, res, next) => {
  let articleId = req.query.articleId;
  let id = Number(req.query.commitId);

  Article.updateOne({
    _id: articleId
  }, {
    $pull: {
      'commit': {
        id: id
      }
    }
  }).then((result01) => {
    res.json({
      status: 0,
      message: '删除评论成功',
      data: result01
    })
  })
};
//修改博文展示状态
const changeArticleStatus = (req, res, next) => {
  let articleId = req.body.id || '';
  Article.findOne({
    _id: articleId
  }).then((result01) => {
    let status = !result01.status;
    Article.updateOne({
      _id: articleId
    }, {
      $set: {
        'status': status
      }
    }).then((result) => {
      if(result.n){
        res.json({
          status: 0,
          message: '修改状态成功',
          data: ''
        })
      }else{
        res.json({
          status: 1,
          message: '修改状态失败',
          data: ''
        })
      }

    })
  });

};
//修改评论阅读状态
const changeCommitStatus = (req, res, next) => {
  let id = req.body.articleId;
  let status = req.body.status;
  let commitId = req.body.commitId;
  if(commitId != '全部'){
    Article.updateOne({
      _id: id,
      'commit.id': commitId
    },{
      $set: {
        'commit.$.status': status
      }
    }).then((result) => {
      if(result.n){
        res.json({
          status: 0,
          message: '修改成功',
          data: ''
        })
      }else{
        res.json({
          status: 1,
          message: '修改失败',
          data: ''
        })
      }
    })
  }else{
    Article.findOne({
      _id: id
    }).then((result) => {
      let commitDoc = result.commit;
      commitDoc.forEach((item, index) => {
        item.status = '已读'
      });
      Article.updateOne({
        _id: id
      },{
        commit: commitDoc
      }).then((result01) => {
        res.json({
          status: 0,
          message: '修改成功',
          data: ''
        })
      });
    })
  }
};

module.exports = {
  addArticle,
  articleList,
  getsubcategoryId,
  editArticle,
  deleteArticle,
  articleDetail,
  deleteCommit,
  changeArticleStatus,
  changeCommitStatus
};