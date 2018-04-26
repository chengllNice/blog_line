<template>
  <div class="my-header">

    <header class="header">
      <div class="my_header_wrap">
        <div class="nav_wrap">
          <ul class="nav_box hidden-xs">
            <li>
              <router-link :to="{name: 'index'}">首页</router-link>
            </li>
            <li v-for="(navItem,index) in navData.categoryData" :key="index" @mouseover="navDropDownHandler(index+1)" @mouseout="navDropUpHandler(index+1)" v-if="navItem.name">
              <a href="#">{{navItem.name}}</a>
              <div class="nav_dropDown_hide" v-if="navItem.subItem">
                <div class="item">
                  <div class="panel">
                    <div class="panel-body">
                      <div class="nav_drop_list">
                        <div class="nav_drop_item" v-for="sub in navItem.subItem">
                          <a @click="categorySearchHandler(sub.id)">
                            <div class="img-responsive">
                              <img :src="sub.imgSrc" alt="">
                            </div>
                            <div class="img_title"><h4>{{sub.subTitle}}</h4></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="nav_xs visible-xs" @click="asideToggleHandler">
            <span class="nav_icon">
              <i class="fa fa-navicon"></i>
            </span>
          </div>
        </div>
        <div class="">
          <div class="search_wrap">
            <input type="text" class="form-control search_input" @keyup.enter="titleSearchHandler" placeholder="请输入博文标题搜索...">
            <div class="search_icon" @click="titleSearchHandler"><button class="btn btn-default"><i class="fa fa-search"></i></button></div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { getCategory, getSubCategory } from '../axios/getData'
  export default {
    name: "my-header",
    data(){
      return {
        navDropShow: 0,
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
                id: item._id,
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
      categorySearchHandler(subCategoryId){
        this.$router.push({path: 'articleListSearch', query: {subCategoryId: subCategoryId}});
        window.location.reload();
      },
      titleSearchHandler(){
        let text = $('.search_input').val().trim();
        this.$router.push({path: 'articleListSearch', query: {searchText: text}});
        window.location.reload();
      },
      navDropDownHandler(index){
        $('.nav_box>li').eq(index).children('.nav_dropDown_hide').stop().slideDown();
      },
      navDropUpHandler(index){
        $('.nav_box>li').eq(index).children('.nav_dropDown_hide').stop().slideUp();
      },
      // 屏幕小于768时点击导航图标控制aside
      asideToggleHandler(){
        this.$emit('asideToggle')
      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style lang="scss" scoped>

  .my-header{
    width: 100%;

    .my_header_wrap{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .header {
      background: #1abc9c;

      a {
        text-decoration: none;
      }

      .nav_wrap{
        height: 100%;
        .nav_box {
          display: flex;
          flex-direction: row;
          align-items: center;

          li{
            &>a{
              padding: 20px 15px;
              display: block;
              color: #fff;
            }
            .nav_dropDown_hide{
              position: absolute;
              top: 60px;
              left: 0;
              z-index: 1000;
              width: 100%;
              background: #fff;
              display: none;

              .nav_drop_list{
                display: flex;
                flex-direction: row;
                padding: 20px 50px;
              }
              .nav_drop_item {
                padding: 0 40px 0 0;
                margin: 0 40px 0 0;
                border-right: 1px solid #ccc;
                text-align: center;
                cursor: pointer;
              }
              .nav_drop_item:nth-last-of-type(1){
                border-right: 1px solid #fff;
              }
              .nav_drop_item img{
                height: 50px;
              }
            }
            &:hover>a{
              background-color: rgba(26, 160, 140, 0.8)!important;
            }
          }

          .panel{
            margin-bottom: 20px;
            box-shadow: 0px 1px 1px #f3f3f3;
          }

        }

        .nav_xs{
          .nav_icon{
            display: block;
            padding: 14px 20px;
            font-size: 22px;
            color: #fff;
          }
        }
      }


      .search_wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 13px 15px;

        .search_input{
          border-radius: 4px 0 0 4px;
        }
        .search_icon button{
          border-radius: 0 4px 4px 0;
          color: #fff;
          background: #ddd;
        }
      }
    }
  }

  .slideToggle-enter-active, .slideToggle-leave-active{
    transition: all 1s;
  }
  .slideToggle-enter, .slideToggle-leave-to {
    opacity: 0;
  }
</style>
