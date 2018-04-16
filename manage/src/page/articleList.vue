<template>
    <div class="article-list">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>博文列表</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="search_box">
        <Form ref="searchForm" :model="searchForm" inline>
          <FormItem>
            <Select v-model="searchForm.condition" style="width:100px">
              <Option value="0">按目录</Option>
              <Option value="1">按标题</Option>
              <Option value="2">按内容</Option>
              <Option value="3">按用户名</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input v-model="searchForm.searchText" placeholder="请输入搜索内容..." style="width: 200px"></Input>
            <Button type="primary" @click="searchHandler">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div class="content">
        <div class="loading">
          <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="loading_icon"></Icon>
            <div>加载中...</div>
          </Spin>
        </div>
        <Table :columns="columns1" :data="data1"></Table>
      </div>
      <div class="page_box">
        <Page :total="totalData" show-elevator show-total :page-size="pageSize" @on-change="pageHandler"></Page>
      </div>

      <!--删除时的提示模态框-->
      <Modal
        v-model="deleteModel"
        title="删除提示"
        @on-ok="sureDeleteHandler"
        @on-cancel="cancelDeleteHandler">
        <p>确定删除这篇博文么</p>
      </Modal>
    </div>
</template>

<script>
  import { articleList, getsubcategoryId, deleteArticle, getUserId, changeArticleStatus } from "../axios/getData";
  import { mapState } from 'vuex'

  export default {
    name: "article-list",
    data(){
      return {
        deleteModel: false,
        spinShow: true,//loading动画
        articleId: '',
        searchForm: {
          condition: '',
          searchText: ''
        },
        page: 1,
        pageSize: 0,
        totalData: 0,
        columns1: [
          {
            title: 'id',
            key: '_id'
          },
          {
            title: '博文名称',
            key: 'title',
            ellipsis: true
          },
          {
            title: '博文分类',
            key: 'subcategory',
            ellipsis: true,
            render: (h, params) => {
              let subcategoryname = '';
              if(params.row.subcategory == null){
                subcategoryname = '无此目录'
              }else{
                subcategoryname = params.row.subcategory.name;
              }
              return h('div', subcategoryname);
            }
          },
          {
            title: '用户名',
            key: 'user',
            render: (h, params) => {
              let name = '';
              if(params.row.user == null){
                name = '无此用户'
              }else{
                name = params.row.user.name;
              }
              return h('div', name);
            }
          },
          {
            title: '作者',
            key: 'showName',
            render: (h, params) => {
              let name = '';
              if(params.row.user == null){
                name = '无此用户'
              }else{
                name = params.row.user.showName;
              }
              return h('div', name);
            }
          },
          {
            title: '浏览量',
            key: 'views',
            width: '80px'
          },
          {
            title: '点赞数',
            key: 'likes',
            width: '80px'
          },
          {
            title: '评论数',
            key: 'commit',
            width: '80px',
            render: (h, params) => {
              return h('div', params.row.commit.length);
            }
          },
          {
            title: '更新日期',
            key: 'updateDate',
            render: (h, params) => {
              return h('div', this.dateFormat(params.row.updateDate));
            }
          },
          {
            title: '展示状态',
            key: 'status',
            width: '132px',
            render: (h, params) => {
              return h('div', [
                h('Tag', {
                  props: {
                    size: 'small',
                    color: 'blue'
                  }
                }, params.row.status ? '显示' : '隐藏'),
                h('i-switch', {
                  props: {
                    value: params.row.status
                  },
                  on: {
                    'on-change': () => {
                      this.changeArticleStatusHandler(params.row._id);
                    }
                  }
                })
              ])
            }
          },
          {
            title: '编辑',
            key: 'operate',
            width: '200px',
            render: (h, params) => {
              let isUser = false;
              if(!this.userInfo.superAdmin){
                if(params.row.user._id !== this.userInfo._id){
                  isUser = true;
                }
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: 'articleCommit', query: { id: params.row._id }});
                    }
                  }
                }, '查看评论'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    disabled: isUser
                  },
                  style: {
                    marginLeft: '5px',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: 'editArticle', query: { id: params.row._id }});
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: isUser
                  },
                  on: {
                    click: () => {
                      this.deleteArticleHandler(params.row._id)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data1: []
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      init(condition, searchText){
        this.spinShow = true;
        let page = this.page || 1;
        articleList(page, condition, searchText).then((response) => {
          this.data1 = response.data.data;
          this.totalData = response.data.pagenation.count;
          this.pageSize = response.data.pagenation.pageSize;
          this.spinShow = false;
        }).catch((err) => {
          this.$Message.error(err);
          this.spinShow = false;
          this.data1 = [];
          this.totalData = 0;
        })
      },
      searchHandler(){
        let searchText = this.searchForm.searchText.trim() || '';
        if(!searchText){
          this.init();
          return;
        }
        let condition = this.searchForm.condition;
        if(!condition){
          this.$Message.warning('请先选择搜索条件');
          return;
        }
        if(condition === '0'){//按目录搜索
          getsubcategoryId(searchText).then((response) => {
            if(!response.data.status){
              searchText = response.data.data._id.toString();
              this.init(condition, searchText);
            }else{
              this.$Message.error('无此目录');
            }
          }).catch((err) => {
            this.$Message.error(err)
          })
        }else if(condition === '3'){//按用户名搜索
          getUserId(searchText).then((response) => {
            if(!response.data.status){
              searchText = response.data.data._id.toString();
              this.init(condition, searchText);
            }else{
              this.$Message.error('无此用户');
            }
          }).catch((err) => {
            this.$Message.error(err)
          })
        }else {
          this.init(condition, searchText);
        }
      },
      pageHandler(page){
        this.page = page;
        this.searchHandler();
      },
      deleteArticleHandler(articleId){
        this.articleId = articleId;
        this.deleteModel = true;
      },
      sureDeleteHandler(){
        deleteArticle(this.articleId).then((response) => {
          if(!response.data.status){
            this.$Message.success('删除成功');
            this.searchHandler();
          }else{
            this.$Message.error('删除失败');
          }
        }).catch((err) => {
          this.$Message.error(err);
        })
      },
      cancelDeleteHandler(){

      },
      changeArticleStatusHandler(id){
        changeArticleStatus(id).then((response) => {
          if(!response.data.status){
            this.$Message.success('修改状态成功');
            this.init();
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .article-list{
    .page_box{
      padding: 20px 0;
    }
  }
  .content{
    position: relative;
    .loading{
      display: inline-block;
      width: 100%;
      height: 100%;
      position: absolute;
      border: 1px solid #eee;
    }
    .loading_icon{
      animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
    }
  }

</style>
