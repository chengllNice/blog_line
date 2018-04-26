import axios from 'axios'

const BASE_URL = '/manage';

// 登录请求
export const login = (name, password) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/login', {
      name: name,
      password: password
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('登录失败')
      }
    })
  })
};
//退出登录
export const loginOut = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/loginOut').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('退出失败')
      }
    })
  })
};
//home请求，判断是否登录
export const isLogin = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getUserInfo').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('请先登录')
      }
    })
  })
};
// 添加管理员
export const addUser = (name, showName) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/addUser',{
      name: name,
      showName: showName
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};
// 删除管理员
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/deleteUser',{
      params: {
        userId: userId
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('删除管理员失败')
      }
    })
  })
};
// 获取管理员列表
export const getUserList = (page, searchText) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/userList',{
      params: {
        page: page,
        searchText: searchText
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};
// 修改密码
export const editPsd = (userId, password) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/editPsd',{
      userId: userId,
      password: password
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('修改密码失败')
      }
    })
  })
};
// 添加目录
export const getUserId = (searchText) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/userId',{
      params: {
        searchText: searchText
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('无此用户')
      }
    })
  })
};
// 添加目录
export const addCategory = (name) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/addCategory',{
      name: name
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('添加失败')
      }
    })
  })
};
// 获取目录列表
export const getCategory = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getCategory').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('获取目录列表失败')
      }
    })
  })
};
//删除目录
export const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/deleteCategory', {
      params: {
        categoryId: id
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('删除目录失败')
      }
    })
  })
};
// 添加子目录列表
export const addSubCategory = (name, categoryId) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/addSubCategory', {
      name: name,
      categoryId: categoryId
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('添加子目录失败')
      }
    })
  })
};
// 获取子目录列表
export const getSubCategory = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getSubCategory').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('获取子目录列表失败')
      }
    })
  })
};
//修改子目录所属目录
export const editSubCategory = (categoryId, subCategoryId) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/editSubCategory',{
      categoryId: categoryId,
      subCategoryId: subCategoryId
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('修改子目录所属目录失败')
      }
    })
  })
};
//删除子目录
export const deleteSubCategory = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/deleteSubCategory', {
      params: {
        subCategoryId: id
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('删除子目录失败')
      }
    })
  })
};
// 添加博文
export const addArticle = (title, description, markType, tags, subcategory, content, userId) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/addArticle', {
      title: title,
      description: description,
      tags: tags,
      subcategory: subcategory,
      content: content,
      userId: userId,
      markType: markType
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('添加博文失败')
      }
    })
  })
};
// 获取博文内容
export const articleDetail = (articleId) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/articleDetail', {
      params: {
        articleId: articleId
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('获取博文内容失败')
      }
    })
  })
};
// 编辑博文
export const editArticle = (articleId, title, description, tags, subcategory, content) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/editArticle', {
      articleId: articleId,
      title: title,
      description: description,
      tags: tags,
      subcategory: subcategory,
      content: content,
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('修改博文失败')
      }
    })
  })
};
//获取博文列表
export const articleList = (page, condition, searchText) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/articleList', {
      params: {
        page: page,
        condition: condition,
        searchText: searchText
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('博文列表获取失败')
      }
    })
  })
};
//修改博文显示状态
export const changeArticleStatus = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/changeArticleStatus', {
      id: id
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};
//修改博文显示状态
export const changeCommitStatus = (articleId, commitId, status) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/changeCommitStatus', {
      articleId: articleId,
      commitId: commitId,
      status: status
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//按目录查询时查询目录Id
export const getsubcategoryId = (searchText) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getsubcategoryId', {
      params: {
        searchText: searchText
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('无此目录')
      }
    })
  })
};
//删除博文
export const deleteArticle = (articleId) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/deleteArticle', {
      params: {
        articleId: articleId
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('删除失败')
      }
    })
  })
};
//删除评论
export const deleteCommit = (commitId, articleId) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/deleteCommit', {
      params: {
        commitId: commitId,
        articleId: articleId
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject('删除评论失败')
      }
    })
  })
};

//上传图片
export const uploadImage = (href, title) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/uploadImage', {
      href: href,
      title: title
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//所有图片bannerImageList
export const getImageList = (href, title) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/imageList').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//轮播图片
export const bannerImageList = (href, title) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/bannerImageList').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};
//改变图片是否为轮播图
export const changeBannerImageList = (isShow, imageList) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/changeBannerImageList',{
      isShow: isShow,
      imageList: imageList
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//删除图片
export const deleteImage = (imageList) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/deleteImage',{
      imageList: imageList
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//添加模块
export const addCustomModule = (name, sortIndex, moduleType, content) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/addCustomModule',{
      name: name,
      sortIndex: sortIndex,
      moduleType: moduleType,
      content: content
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

//删除图片(自定义模块中)
export const deleteUploadImage = (path) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/deleteUploadImage',{
      path: path
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 模块列表
export const getCustomModuleList = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getCustomModuleList').then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 修改模块展示状态
export const changeModuleStatus = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/changeModuleStatus',{
      id: id
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 修改模块展示状态
export const changeModuleNameMark = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/changeModuleNameMark',{
      id: id
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 修改模块
export const editModule = (id, name, sortIndex, content) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/editModule',{
      id: id,
      name: name,
      sortIndex: sortIndex,
      content: content
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 删除模块
export const deleteModule = (id, name, sortIndex) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/deleteModule',{
      id: id
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};

// 获取模块详情
export const getModuleDetail = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getModuleDetail',{
      params: {
        id: id
      }
    }).then((result) => {
      if(!result.data.status){
        resolve(result)
      }else{
        reject(result.data.message)
      }
    })
  })
};
