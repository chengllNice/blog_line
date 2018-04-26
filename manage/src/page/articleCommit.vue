<template>
  <div class="article-commit">
    <div class="bread_box">
      <Breadcrumb>
        <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
        <BreadcrumbItem>博文评论</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="article_info_box">
      <Card :bordered="false">
        <p slot="title">文章详情</p>
        <div class="article_item">
          <span class="label">博文标题：</span>
          <span>{{articleData.title}}</span>
        </div>
        <div class="article_item">
          <span class="label">博文ID：</span>
          <span>{{articleData._id}}</span>
        </div>
        <div class="article_item">
          <span class="label">评论数：</span>
          <span>{{commitList.length}}</span>
        </div>
      </Card>
    </div>
    <div class="article_commit_box">
      <h2>评论列表</h2>
      <div class="commit_list">
        <div class="commit_item" v-for="(item, index) in commit" :key="index">
          <div class="commit_left">
            <div class="commit_header">
              <div class="commit_name">{{item.userName}}</div>
              <div class="commit_data">{{item.createdDate | dateFilter}}</div>
              <div class="commit_status" @click="changeCommitStatusHandler(item.id, item.status)">
                <span class="tag tag_error" v-if="item.status == '未读'" color="red">{{item.status}}</span>
                <span class="tag tag_success" v-else color="blue">{{item.status}}</span>
              </div>
            </div>
            <div class="commit_content">{{item.content}}</div>
          </div>
          <div class="opare">
            <span @click="deleteHandler(item.id)" v-if="userInfo._id === articleData.user">
              <Icon type="trash-a"></Icon>
            </span>
          </div>
        </div>
      </div>
      <div class="page_box">
        <Page :total="totalCommit" show-elevator show-total :page-size="pageSize" @on-change="pageHandler"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import { articleDetail, deleteCommit, changeCommitStatus } from "../axios/getData";
  import { mapState } from 'vuex'
  export default {
    name: "article-commit",
    data(){
      return {
        articleData: {},
        commit: [],//每页显示的评论
        commitList: '',//返回的全部评论
        pageSize: 5,
        page: 1,
        totalCommit: 0
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      init(){
        let articleId = this.$route.query.id;
        if(!articleId){
          this.$Message.warning('获取博文内容失败');
          this.$router.push('articleList');
          return;
        }
        articleDetail(articleId).then((response) => {
          this.articleData = response.data.data;
          this.totalCommit = response.data.data.commit.length;
          this.commitList = response.data.data.commit.reverse();
          this.commit = this.commitList.slice(0, this.pageSize);
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      pageHandler(page){
        let startPage = (page-1)*this.pageSize;
        let endPage = page*this.pageSize;
        this.commit = this.commitList.slice(startPage, endPage);
      },
      deleteHandler(commitId){
        let articleId = this.$route.query.id;
        deleteCommit(commitId, articleId).then((response) => {
          if(!response.data.status){
            this.$Message.success('删除评论成功');
            this.init();
          }else{
            this.$Message.error('删除评论失败')
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      changeCommitStatusHandler(commitId, status){
        let articleId = this.articleData._id;
        let statusEnd = '';
        if(status == '未读'){
          statusEnd = '已读';
        }else{
          statusEnd = '未读'
        }
        changeCommitStatus(articleId, commitId, statusEnd).then((response) => {
          let res = response.data;
          console.log(!res.status)
          if(!res.status){
            this.$Message.success(res.message);
            this.init();
          }else{
            this.$Message.error(res.message);
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.init()
      })
    },
    filters: {
      dateFilter(value){
        let date = new Date(value);
        let year = date.getFullYear();
        let mouth = date.getMonth()+1;
        let day = date.getDay();
        let H = date.getHours();
        let M = date.getMinutes();
        let S = date.getSeconds();
        if(mouth<10){
          mouth = '0' + mouth;
        }
        if(day<10){
          day = '0' + day;
        }
        if(H<10){
          H = '0' + H;
        }
        if(M<10){
          M = '0' + M;
        }
        if(S<10){
          S = '0' + S;
        }
        let nowDate = `${year}-${mouth}-${day}  ${H}:${M}:${S}`
        return nowDate;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .article-commit{

    .article_info_box{
      .ivu-card{
        box-shadow: 0px 0px 4px #ccc;
      }
      .article_item{
        .label{
          display: inline-block;
          width: 80px;
          text-align: right;
          margin: 10px 0;
          margin-right: 10px;
          color: #2d8cf0;
        }
      }
    }

    .article_commit_box{
      margin: 20px 0;
      h2{
        margin-bottom: 20px;
      }
      .commit_list{
        margin-bottom: 20px;
        .commit_item{
          border: 1px solid #ddd;
          margin-bottom: -1px;
          background: #ffffff;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          &:nth-of-type(1){
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
          &:nth-last-of-type(1){
            margin-bottom: 0;
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
          }

          .commit_left{
            flex: 1;
            padding: 10px 15px;
            .commit_header{
              display: flex;
              align-items: center;

              .commit_name{
                font-weight: bold;
                margin: 2px 0;
                margin-right: 15px;
              }
              .commit_data{
                margin: 2px 0;
                margin-right: 15px;
              }
              .commit_status{
                .tag{
                  display: inline-block;
                  height: 22px;
                  line-height: 22px;
                  margin: 2px 4px 2px 0;
                  padding: 0 8px;
                  border-radius: 3px;
                  font-size: 12px;
                  vertical-align: middle;
                  opacity: 1;
                  overflow: hidden;
                  cursor: pointer;
                  color: #ffffff;
                }
                .tag_success{
                  background: #2d8cf0;
                  &:hover{
                    opacity: 0.85;
                  }
                }
                .tag_error{
                  background: #ed3f14;
                  &:hover{
                    opacity: 0.85;
                  }
                }
              }
            }
            .commit_content{
              margin: 5px 0 10px 0;
            }
          }
          .opare{
            width: 60px;
            height: auto;
            line-height: 75px;
            cursor: pointer;
            background: #ed3f14;
            color: #ffffff;
            text-align: center;
            font-size: 24px;
            font-weight: 200;
          }
        }
      }
    }
  }

</style>
