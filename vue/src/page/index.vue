<template>
    <div class="index">
      <div class="index_wrap">
        <div class="index_left">
          <slider-boot :banner-data="bannerData"></slider-boot>
          <div class="content">
            <div class="content_item" v-for="(articleItem,index) in articleData" :key="index" @click="goArticleDetailHandler(articleItem._id)">
              <div class="panel">
                <div class="panel-body">
                  <h4>
                    {{articleItem.title}}
                      <span class="is_top" v-if="articleItem.isTop">置顶</span>
                  </h4>
                  <div class="article_info">
                    <div class="item hidden-xs">
                      <span>作者：</span>
                      <span class="label label-success">{{articleItem.user.showName}}</span>
                    </div>
                    <div class="item hidden-xs">
                      <span>更新时间：</span>
                      <span class="label label-success">{{articleItem.updateDate | dateFormat}}</span>
                    </div>
                    <div class="item">
                      <span>分类：</span>
                      <span class="label label-success" v-if="articleItem.subcategory">{{articleItem.subcategory.name}}</span>
                    </div>
                    <div class="item">
                      <span>评论：</span>
                      <span class="label label-success">{{articleItem.commit.length}}</span>
                    </div>
                    <div class="item">
                      <span>阅读量：</span>
                      <span class="label label-success">{{articleItem.views}}</span>
                    </div>
                  </div>
                  <div class="tag_box" v-if="articleItem.tags.length">
                    <span v-for="(tag,i) in articleItem.tags" :key="i" class="tag tag_success">{{tag}}</span>
                  </div>
                  <div class="des ellipsis_three">
                    {{articleItem.description}}
                  </div>
                </div>
              </div>
            </div>

            <!--page contrl-->
            <div class="content_page">
              <span class="data_count">共 {{count}} 条数据</span>
              <div class="page_box">
                <nav aria-label="Page navigation">
                  <ul class="pagination">
                    <li @click="prePage" :class="{'disabled': page == '1'}">
                      <a href="javascript:;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    <li v-for="(item,index) in pageArr" :key="index" :class="{'active': page == item}" @click="goPage(item)"><a href="javascript:;">{{item}}</a></li>
                    <li @click="nextPage" :class="{'disabled': page == pageCount}">
                      <a href="javascript:;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div class="index_right hidden-xs">
          <pro-info></pro-info>

          <div class="module_list" v-for="(moduleItem, index) in moduleData">
            <custom-module :data="moduleItem" v-if="moduleItem.status"></custom-module>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import proInfo from './proInfo'
  import sliderBoot from './sliderBoot'
  import CustomModule from '@/components/customModule'
  import { articleList, getCustomModuleList, getBannerImage } from '../axios/getData'

  let self;
  export default {
    name: "index",
    data(){
      return {
        page: 1,
        pageCount: 1,
        pageSize: 0,
        count: 0,
        pageArr: [],
        articleData: [],
        moduleData: [],
        bannerData: []
      }
    },
    computed: {
      currentPage(){
        return this.$route.query.page || '';
      }
    },
    components: {
      proInfo,
      sliderBoot,
      CustomModule
    },
    methods: {
      init(){
        let page = this.$route.query.page;
        let subCategoryId = this.$route.query.subCategoryId || "";
        let searchText = '';
        articleList(page, subCategoryId, searchText).then((response) => {
          this.articleData = response.data.data;
          this.count = response.data.pagenation.count;
          this.page = response.data.pagenation.page;
          this.pageSize = response.data.pagenation.pageSize;
          this.pageCount = response.data.pagenation.pageCount;
          this.pageHandler();
        }).catch((err) => {
          this.$toast.error(err)
        });

        getBannerImage().then((response) => {
          if(!response.data.status){
            this.bannerData = response.data.data;
          }
        }).catch((err) => {
          this.$toast.error(err)
        });

        getCustomModuleList().then((response) => {
          if(!response.data.status){
            this.moduleData = response.data.data;
          }
        }).catch((err) => {
          this.$toast.error(err)
        })
      },
      pageHandler(){
        this.pageArr = [];
        for(let a = 1; a <= this.pageCount; a++){
          this.pageArr.push(a)
        }
      },
      goPage(page){
        this.page = page;
        this.$router.push({path:'index',query: {page: this.page}});
        this.init();
      },
      nextPage(){
        if(this.page >= this.pageCount){
          this.page = this.pageCount;
        }else{
          this.page++;
        }
        this.$router.push({path:'index',query: {page: this.page}});
        this.init();
      },
      prePage(){
        if(this.page <= 1){
          this.page = 1;
        }else{
          this.page--;
        }
        this.$router.push({path:'index',query: {page: this.page}});
        this.init();
      },
      goArticleDetailHandler(acticleId){
        this.$router.push({ path: '/articleDetail', query: { id: acticleId }})
      }
    },
    mounted(){
      self = this;
      this.$nextTick(() => {
        this.init()
      })
    },
    watch: {
      'currentPage': (newVal,oldVal) => {
        console.log(newVal,oldVal)
        if(!newVal){
          self.init();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index{
    /*height: 100%;*/

    .index_wrap{
      display: flex;
      flex-direction: row;
    }
    .index_left{
      flex: 1;
      .content{
        .content_item{
          cursor: pointer;
          -webkit-transition: all 0.3s;
          -moz-transition: all 0.3s;
          -ms-transition: all 0.3s;
          -o-transition: all 0.3s;
          transition: all 0.3s;
          &:hover{
            -webkit-transform: translateY(-3px);
            -moz-transform: translateY(-3px);
            -ms-transform: translateY(-3px);
            -o-transform: translateY(-3px);
            transform: translateY(-3px);
            box-shadow: 0px 2px 3px #ccc;
          }
          h4{
            color: #353F4F;
            font-weight: bold;
            font-size: 14px;
            padding: 15px;
            border-bottom: 1px dotted rgba(0, 0, 0, 0.2);
          }
          .is_top{
            display: inline-block;
            background: #ffffff;
            color: #f90!important;
            border: 1px solid #f90!important;
            height: 18px;
            line-height: 16px;
            font-size: 12px;
            font-weight: 400;
            border-radius: 2px;
            padding: 0 5px;
            margin-left: 10px;
          }
          .article_info{
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 15px;
            .item{
              padding-right: 15px;
              span:nth-of-type(1){
                color: #767676;
                font-weight: 500;
                font-size: 11px;
                padding-top: 3px;
                padding-bottom: 3px;
                margin-bottom: 0;
              }
            }
          }
          .tag_box{
            padding-left: 10px;
          }
          .des{
            padding: 15px;
            padding-top: 0;
            margin-top: 5px;
            line-height: 35px;
          }

        }

        .content_page{
          display: flex;
          flex-direction: row;
          align-items: center;
          .data_count{
            padding-right: 15px;
          }
        }
      }
    }
    .index_right{
      width: 300px;
      height: 100%;
      margin-left: 20px;
    }

    @media screen and (max-width: 992px) {
      .index_right{
        width: 240px;
      }
    }
  }
</style>
