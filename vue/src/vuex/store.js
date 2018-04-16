import Vue from 'vue'
import Vuex from 'vuex'
import { getCategory } from '../axios/getData'

Vue.use(Vuex)

const state = {
  navData: [
    {
      name: '首页',
      subItem: [
        {
          subTitle: '首页'
        }
      ]
    }
  ]
};

const mutations = {
  GET_CATEGORY(state, cate){
    state.navData = cate.categoryData
  }
};

const actions = {
  GET_CATEGORY({ commit, state }, categoryData){
    commit('GET_CATEGORY', {
      categoryData: categoryData
    })
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions
})
