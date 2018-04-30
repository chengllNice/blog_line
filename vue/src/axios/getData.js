import axios from 'axios'
const BASE_URL = '/admin';

//获取博文列表
export const articleList = (page, subCategoryId, searchText) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/articleList', {
      params: {
        page: page,
        subCategoryId: subCategoryId,
        searchText: searchText
      }
    }).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
//获取博文详情
export const articleDetail = (articleId) => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/articleDetail', {
      params: {
        articleId: articleId
      }
    }).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
//获取目录列表
export const getCategory = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getCategory',).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
//获取子目录
export const getSubCategory = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getSubCategory',).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
// 提交评论
export const submitCommit = (id, commitText) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/commitText',{
      articleId: id,
      commitText: commitText
    }).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
// 点赞
export const articleLikes = (id) => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + '/articleLikes',{
      articleId: id
    }).then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res)
      }
    })
  })
};

// 获取模块列表
export const getCustomModuleList = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getCustomModuleList').then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};

// 获取模块列表
export const getBannerImage = () => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + '/getBannerImage').then((res) => {
      if(!res.data.status){
        resolve(res)
      }else{
        reject(res.data.message)
      }
    })
  })
};
