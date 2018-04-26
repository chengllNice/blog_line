<template>
  <div class="aside-nav">
    <!--屏幕宽度小于768-->
    <div class="nav_aside visible-xs">
      <div class="aside_wrap_inner">
        <ul class="nav nav-pills nav-stacked">
          <li>
            <div class="media loggesd_user">
              <img src="/static/images/avatar5.png" alt="" class="media-object">
              <div class="media-body">
                <h4>路无止境</h4>
                <span>座右铭：勇往直前</span>
              </div>
            </div>
          </li>
          <li class="nav_list">
            <a href="javascript:;" @click="categorySearchHandler('-1')">
              <i class="fa fa-tags"></i>
              <span>首页</span>
              <i></i>
            </a>
          </li>
          <li class="nav_list" v-for="(navItem,index) in navData.categoryData" :key="index">
            <a href="javascript:;" @click="asideToggleHandler(index)">
              <i class="fa fa-tags"></i>
              <span>{{navItem.name}}</span>
              <i class="fa fa-angle-down"></i>
            </a>
            <ul class="sub_nav_list" v-if="navItem.subItem">
              <li v-for="(item,i) in navItem.subItem" :key="i" @click="categorySearchHandler(item.id)">
                <a href="javascript:;">{{item.subTitle}}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { getCategory, getSubCategory } from '../axios/getData'
  export default {
    name: "aside-nav",
    data(){
      return {
        categoryData: []
      }
    },
    computed: {
      ...mapState(['navData'])
    },
    methods: {
      ...mapActions(['GET_CATEGORY']),
      init(){
        getCategory().then((response) => {
          if(!response.data.status){
            this.categoryData = response.data.data;
            getSubCategory().then((res) => {
              if(!res.data.status){
                let categoryData = this.categoryFormat(res.data.data);
                this.$store.dispatch('GET_CATEGORY', {
                  categoryData: categoryData
                })
              }else{
                this.$toast.error(res.data.message)
              }
            }).catch((err) => {
              this.$toast.error(err)
            })
          }else{
            this.$toast.error(response.data.message)
          }
        }).catch((err) => {
          this.$toast.error(err)
        })
      },
      categoryFormat(data){
        let reData = [];
        let obj = {};
        let subItem = [];
        let num = 0;
        this.categoryData.forEach((cate, i) => {
          obj = {};
          subItem = [];
          data.forEach((item, index) => {
            if(cate.name === item.category.name){
              obj['name'] = item.category.name;
              subItem.push({
                id: item.category._id,
                subTitle: item.name,
                imgSrc: '/static/images/html5.png'
              });
              obj['subItem'] = subItem;
            }
          });
          if(obj.name){
            reData.push(obj)
          }
        });
        return reData;
      },
      //aside侧边导航toggle事件
      asideToggleHandler(index){
        $('.nav_list').eq(index+1).children('.sub_nav_list').slideToggle();
        if($('.nav_list').eq(index+1).children('a').children('i').eq(1).hasClass('fa-angle-down')){
          $('.nav_list').eq(index+1).children('a').children('i').eq(1).removeClass('fa-angle-down').addClass('fa-angle-up');
        }else{
          $('.nav_list').eq(index+1).children('a').children('i').eq(1).removeClass('fa-angle-up').addClass('fa-angle-down');
        }
      },
      categorySearchHandler(subCategoryId){
        console.log(subCategoryId)
        if(subCategoryId == '-1'){
          this.$router.push({name: 'index'});
        }else{
          this.$router.push({path: 'articleListSearch', query: {subCategoryId: subCategoryId}});
        }
        window.location.reload();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .aside-nav {
    width: 100%;
    height: 100%;
    background: #424f63;
    .nav_aside{
      width: 100%;
      height: 100%;
      background: #424f63;
      .loggesd_user {
        padding: 0 0 15px 12px;
        margin: 15px 0 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        .media-object{
          width: 45px;
          border-radius: 3px;
          float: left;
        }
        .media-body{
          padding-left: 20px;

          h4{
            font-size: 15px;
            margin: 5px 0 0 0;
          }
          span{
            display: block;
            margin-top: 5px;
            color: #d7d7d7;
          }
        }
      }

      .nav_list{
        width: 100%;
        &>a{
          background-color: #353f4f;
          color: #65cea7;
          span{
            margin-left: 3px;
          }
          &>i:nth-last-of-type(1){
            float: right;
            margin-top: 5px;
          }
        }
        .sub_nav_list{
          list-style: none;
          display: none;
          margin: 0;
          padding: 0;
          background: rgba(66,85,105,0.8);
          a{
            color: #fff;
            font-size: 13px;
            display: block;
            padding: 10px 5px 10px 50px;
            text-decoration: none;
            transition: all 0.2s ease-out 0s;

            &:hover{
              background: #353F4F;
            }
          }
        }
      }
    }
  }
</style>
