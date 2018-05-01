<template>
    <div class="article-detail">
      <div class="container-fluid" style="padding: 0;">
        <div class="article_main">
          <div class="article_left">
            <div class="title">
              <div class="title_left">
                <h2>{{articleData.title}}</h2>

                <div class="article_info">
                  <span class="mark_custom " :class="[articleData.markType === '转载' ? 'mark_reprint': 'mark_original']">{{articleData.markType}}</span>
                  <div class="tag_box">
                    <span class="tag tag_success" v-for="(item, index) in articleData.tags" :key="index">{{item}}</span>
                  </div>
                  <div class="item">
                    <span>作者：</span>
                    <span class="edit_time">{{articleUserName}}</span>
                  </div>
                  <div class="item">
                    <span>分类：</span>
                    <span class="edit_time">{{articleCateName}}</span>
                  </div>
                  <div class="item">
                    <span>更新时间：</span>
                    <span class="edit_time">{{articleData.updateDate | dateFormat}}</span>
                  </div>
                  <div class="item">
                    <span>阅读量：</span>
                    <span class="edit_time">{{articleData.views}}</span>
                  </div>
                </div>
              </div>

              <div class="title_right">
                <likes-btn tooltip="感谢点赞" :likes-num="articleData.likes"></likes-btn>
              </div>
            </div>
            <div class="main_content" v-html="articleContent"></div>

            <div class="likes_box">
              <likes-btn class="" tooltip="感谢点赞" :likes-num="articleData.likes"></likes-btn>
            </div>

            <div class="commit_box">
              <h4>评论</h4>
              <div class="commit_form">
                <textarea name="" class="form-control" id="commitContent" cols="30" rows="4" maxlength="200" placeholder="请输入评论信息，限制字符长度200"></textarea>
                <div class="submit_btn">
                  <button class="btn btn-success" @click="submitCommitHandler">提交评论</button>
                </div>
              </div>

              <div class="commit_list" v-if="commitData.length">
                <div class="commit_item" v-for="(commitItem, index) in commitData">
                  <div class="user_img"><img src="../../static/images/userDefault.jpg" alt=""></div>
                  <div class="user_commit_info">
                    <div class="user_name_time">
                      <div class="user_name">{{commitItem.userName}}</div>
                      <div class="commit_time">{{commitItem.createdDate | dateFormat}}</div>
                    </div>

                    <div class="commit_content">{{commitItem.content}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="article_right hidden-xs">
            <div class="module_list" v-for="(moduleItem, index) in moduleData">
              <custom-module :data="moduleItem"></custom-module>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { articleDetail, submitCommit, getCustomModuleList } from '../axios/getData'
  import CustomModule from '@/components/customModule'
  import likesBtn from '@/components/likesBtn'
  import io from 'socket.io-client'
  import { socketUrl } from "../config/config";
  import { isIE, isPC } from '../config/utils'

  export default {
    name: "article-detail",
    data(){
      return {
        articleContent: {},
        articleData: {},
        moduleData: [],
        socket: null,
        articleTitle: '',
        commitData: []
      }
    },
    components: {
      CustomModule,
      likesBtn
    },
    computed: {
      articleId(){
        return this.$route.query.id;
      },
      articleUserName(){
        let name = '';
        if(this.articleData.user){
          name = this.articleData.user.showName
        }
        return name;
      },
      articleCateName(){
        let name = '';
        if(this.articleData.subcategory){
          name = this.articleData.subcategory.name
        }
        return name;
      }
    },
    methods: {
      init(){
        let id = this.articleId;
        articleDetail(id).then((response) => {
          this.articleTitle = response.data.data.title;
          this.articleData = response.data.data;
          this.commitData = response.data.data.commit.reverse();
          this.articleContent = response.data.data.content.article;
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
      submitCommitHandler(){
        let id = this.articleId;
        let commitText = $('#commitContent').val().trim();
        if(!commitText || commitText.length > 200){
          this.$toast.error('请输入正确的评论信息');
          return;
        }
        submitCommit(id, commitText).then((response) => {
          if(!response.data.status){
            this.init();
            let articleTitle = this.articleTitle;
            this.socket = io(socketUrl);
            this.socket.emit('commitwillsubmit', {msg: {id: id, title: articleTitle, text: commitText}});
            $('#commitContent').val('');
          }else{
            this.$toast.error(response.data.message)
          }
        }).catch((err) => {
          this.$toast.error(err)
        })
      },
      isNiceScroll(){
        if(!isIE() && isPC()) {
          this.$nextTick(() => {
            $('.main_content pre').niceScroll();
          });
        }else{
          $('.main_content pre').css({'overflow': 'auto!important'})
        }
      }
    },
    mounted(){
      this.init();
      //this.isNiceScroll();
    },
    updated(){
      //this.isNiceScroll();
    }
  }
</script>

<style lang="scss">
  .article-detail{
    .article_main{
      min-height: 600px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .article_left{
        flex: 1;
        .title{
          padding: 20px 0 10px 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          .title_left{
            flex: 1;
          }
          .title_right{
            max-width: 95px;
            margin-left: 20px;
            padding-top: 30px;
          }
          h2{
            font-size: 24px;
            color: #000;
            padding-bottom: 20px;
          }

          .article_info{
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            &>*{
              margin-bottom: 10px;
            }
            .item{
              padding-right: 15px;
              span:nth-of-type(1){
                color: #767676;
                font-weight: 500;
                font-size: 13px;
                padding-top: 3px;
                padding-bottom: 3px;
                margin-bottom: 0;
              }
            }
          }
        }

        .main_content{
          min-height: 400px;
        }

        .likes_box{
          text-align: center;
        }

        .commit_box{
          border-top: 1px solid #cccccc;
          padding-top: 20px;
          margin-top: 40px;
          h4{
            margin-bottom: 20px;
          }
          .submit_btn{
            margin-top: 20px;
            text-align: right;
          }
          .commit_list{
            margin-top: 30px;
            .commit_item{
              display: flex;
              padding-bottom: 10px;
              margin-bottom: 10px;
              border-bottom: 1px dotted #cccccc;
              .user_img{
                width: 50px;
                height: 50px;
                margin-right: 20px;
                img{
                  width: 100%;
                  height: 100%;
                }
              }
              .user_commit_info{
                flex: 1;
                .user_name_time{
                  display: flex;
                  margin-bottom: 10px;
                  .user_name{
                    font-weight: 600;
                    color: #666;
                  }
                  .commit_time{
                    margin-left: 30px;
                  }
                }

                .commit_content{
                  font-size: 14px;
                  line-height: 26px;
                }
              }
            }
          }
        }
      }

      .article_right{
        width: 300px;
        padding-left: 20px;
        margin-left: 20px;
        padding-top: 20px;
        a{
          color: #1abc9c;
          border-bottom: 1px solid rgba(0,154,97,0.25);
          cursor: pointer;
          &:hover{
            text-decoration: none;
            color: #009a61;
            border-bottom: 1px solid rgba(0,154,97,1);
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .article_left{
      width: 100%;
    }
  }
</style>
