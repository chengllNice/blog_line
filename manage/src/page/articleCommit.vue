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
          <div class="commit_name">{{item.name}}</div>
          <div class="commit_content">{{item.content}}</div>
          <div class="commit_data">{{item.createdDate | dateFilter}}</div>
          <div class="opare">
            <a @click="deleteHandler(item.id)" v-if="userInfo._id === articleData.user">删除</a>
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
  import { articleDetail, deleteCommit } from "../axios/getData";
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
          this.commitList = response.data.data.commit;
          this.commit = this.commitList.slice(0, this.pageSize)
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
        .commit_item{
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
          margin-bottom: 10px;
          .commit_name{
            margin-bottom: 5px;
            font-weight: bold;
          }
          .commit_content{
            margin: 5px 0 10px 0;
          }
          .commit_data{
            margin-bottom: 5px;
          }
          .opare{

          }
        }
      }
    }
  }

</style>
