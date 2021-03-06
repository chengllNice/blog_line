
/*
* 后台管理博文部分
* */

const Category = require('../../schema/category');
const Subcategory = require('../../schema/subcategory');
const User = require('../../schema/user');
const Article = require('../../schema/article');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();


const dateTime = (day) => {
  let nowDate = new Date();
  nowDate.setDate(nowDate.getDate()-day);//前day天的日期
  let dateArr = [];
  for(let i=0; i<= day; i++){
    dateArr.push(nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate());
    nowDate.setDate(nowDate.getDate()+1);
  }

  return dateArr;
};

//查询博文近一周的评论数和点赞数
const articleAgr = (req, res, next) => {
  let dateArr = dateTime(7);
  let sevenDate = new Date(dateArr[0]);
  Article.find({
    $or: [
      {
        'commit.createdDate': {
          $gt: sevenDate
        }
      },
      {
        'likes.createDate': {
          $gt: sevenDate
        }
      }
    ]

  }).then((result) => {
    let obj = {};
    dateArr.forEach((dateItem,dateIndex) => {
      let preDate = new Date(dateArr[dateIndex]);
      let nextDate = new Date(dateArr[dateIndex+1]);
      let commitnum = 0;//计数commit
      let likesnum = 0;//计数likes
      result.forEach((content, index) => {
        let commitArr = content.commit;
        let likesArr = content.likes;
        commitArr.forEach((commitItem, commitIndex) => {
          if((commitItem.createdDate>=preDate) && (commitItem.createdDate<nextDate)){
            commitnum++;
          }
        });

        likesArr.forEach((likesItem, likesIndex) => {
          if((likesItem.createDate>=preDate) && (likesItem.createDate<nextDate)){
            likesnum++;
          }
        });
      });
      obj[dateArr[dateIndex]] = {
        'commit': commitnum,
        'likes': likesnum
      }
    });

    let commit = [];
    let likes = [];
    Object.keys(obj).forEach((key) => {
      commit.push(obj[key].commit);
      likes.push(obj[key].likes);
    });

    res.json({
      status: 0,
      message: '',
      data: {
        commit: commit.slice(0,commit.length-1),
        likes: likes.slice(0,likes.length-1),
        date: dateArr.slice(0,likes.length-1)
      }
    })
  })
};
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
      markType: markType,
      likes: []
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
      Article.find(selector,{content: 0,description: 0,tags: 0,markType: 0}).populate(['user', 'subcategory']).skip(skip).limit(limit).sort({updateDate: -1}).then((result01) => {
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
//博文置顶操作
const articleIsTop = (req, res, next) => {
  let top = req.body.isTop;
  let id = req.body.articleId;

  Article.updateOne({
    _id: id
  },{
    $set: {
      isTop: top
    }
  }).then((result) => {
    res.json({
      status: 0,
      message: '修改置顶',
      data: ''
    })
  })
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
  changeCommitStatus,
  articleIsTop,
  articleAgr
};