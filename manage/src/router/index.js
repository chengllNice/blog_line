import Vue from 'vue'
import Router from 'vue-router'
/*import Home from '@/page/home'
import Manage from '@/page/manage'
import Category from '@/page/category'
import AddCategory from '@/page/addCategory'
import AddSubCategory from '@/page/addSubCategory'
import ArticleList from '@/page/articleList'
import AddArticle from '@/page/addArticle'
import EditArticle from '@/page/editArticle'
import Login from '@/page/Login'
import ArticleCommit from '@/page/articleCommit'
import UserList from '@/page/userList'
import ImageList from '@/page/imageList'
import AddModule from '@/page/addModule'
import ModuleList from '@/page/ModuleList'
import EditModule from '@/page/editModule'*/

const Home = r => require.ensure([], () => {
  r(require('@/page/home'))
}, 'home');
const Manage = r => require.ensure([], () => {
  r(require('@/page/manage'))
}, 'manage');
const Category = r => require.ensure([], () => {
  r(require('@/page/category'))
}, 'category');
const AddCategory = r => require.ensure([], () => {
  r(require('@/page/addCategory'))
}, 'addCategory');
const AddSubCategory = r => require.ensure([], () => {
  r(require('@/page/addSubCategory'))
}, 'addSubCategory');
const ArticleList = r => require.ensure([], () => {
  r(require('@/page/articleList'))
}, 'articleList');
const AddArticle = r => require.ensure([], () => {
  r(require('@/page/addArticle'))
}, 'addArticle');
const EditArticle = r => require.ensure([], () => {
  r(require('@/page/editArticle'))
}, 'editArticle');
const Login = r => require.ensure([], () => {
  r(require('@/page/login'))
}, 'login');
const ArticleCommit = r => require.ensure([], () => {
  r(require('@/page/articleCommit'))
}, 'articleCommit');
const UserList = r => require.ensure([], () => {
  r(require('@/page/userList'))
}, 'userList');
const ImageList = r => require.ensure([], () => {
  r(require('@/page/imageList'))
}, 'imageList');
const AddModule = r => require.ensure([], () => {
  r(require('@/page/addModule'))
}, 'addModule');
const ModuleList = r => require.ensure([], () => {
  r(require('@/page/moduleList'))
}, 'moduleList');
const EditModule = r => require.ensure([], () => {
  r(require('@/page/editModule'))
}, 'editModule');

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/manage',
          name: 'manage',
          component: Manage,
        },
        {
          path: '/category',
          name: 'category',
          component: Category,
        },
        {
          path: '/addCategory',
          name: 'addCategory',
          component: AddCategory,
        },
        {
          path: '/addSubCategory',
          name: 'addSubCategory',
          component: AddSubCategory,
        },
        {
          path: '/articleList',
          name: 'articleList',
          component: ArticleList,
        },
        {
          path: '/addArticle',
          name: 'addArticle',
          component: AddArticle,
        },
        {
          path: '/editArticle',
          name: 'editArticle',
          component: EditArticle,
        },
        {
          path: '/articleCommit',
          name: 'articleCommit',
          component: ArticleCommit,
        },
        {
          path: '/userList',
          name: 'userList',
          component: UserList,
        },
        {
          path: '/imageList',
          name: 'imageList',
          component: ImageList,
        },
        {
          path: '/moduleList',
          name: 'moduleList',
          component: ModuleList,
        },
        {
          path: '/addModule',
          name: 'addModule',
          component: AddModule,
        },
        {
          path: '/editModule',
          name: 'editModule',
          component: EditModule,
        }
      ]
    }
  ]
})
