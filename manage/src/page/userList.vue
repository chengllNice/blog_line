<template>
    <div class="user-list">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>管理员列表</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="userList_box">
        <div class="add_user_box">
          <Form ref="searchForm" :model="searchForm" inline>
            <FormItem prop="searchText">
              <Input type="text" v-model="searchForm.searchText" placeholder="请输入用户名进行查询..."></Input>
            </FormItem>
            <FormItem>
              <Button @click="searchAdminHandler">搜索</Button>
            </FormItem>
          </Form>
          <div class="add_user_btn_box">
            <Button type="primary" :disabled="!userInfo.superAdmin" @click="addUserModelHandler">添加管理员</Button>
          </div>
        </div>

        <Table :columns="userColumns" :data="userData"></Table>

        <div class="page_box">
          <Page :total="totalData" show-elevator show-total :page-size="pageSize" @on-change="pageHandler"></Page>
        </div>
      </div>

      <!--添加管理员的模态框-->
      <Modal
        v-model="addUserModel"
        title="添加管理员"
        @on-ok="sureAddUserHandler"
        @on-cancel="cancle">
        <Form ref="userForm" :model="userForm" :rules="userRule" :label-width="80">
          <FormItem prop="name" label="用户名">
            <Input type="text" v-model="userForm.name" placeholder="请输入用户登录名..."></Input>
          </FormItem>
          <FormItem prop="showName" label="展示名">
            <Input type="text" v-model="userForm.showName" placeholder="请输入用户展示名..."></Input>
          </FormItem>
          <FormItem label="密码">
            <Input type="text" v-model="userForm.password" disabled></Input>
          </FormItem>
          <FormItem label="权限">
            <Select v-model="userForm.superAdmin" style="width:200px" disabled>
              <Option value="0">超级管理员</Option>
              <Option value="1">普通管理员</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <!--删除管理员的模态框-->
      <Modal
        v-model="deleteUserModel"
        title="添加管理员"
        @on-ok="sureDeleteUserHandler"
        @on-cancel="cancle">
        <p>确认删除管理员？ <span>{{deleteUserName}}</span></p>
      </Modal>
    </div>
</template>

<script>
  import { addUser, getUserList, deleteUser } from "../axios/getData";
  import { mapState } from 'vuex'

  export default {
    name: "user-list",
    data(){
      let validateName = (rule, value, callback) => {
        let reg = /^[a-z]+$/;
        if (!reg.test(value)) {
          callback(new Error('只能注册纯小写字母的用户名'));
        } else {
          callback();
        }
      };
      return {
        addUserModel: false,
        deleteUserModel: false,
        deleteUserId: '',
        deleteUserName: '',
        page: 1,
        totalData: 0,
        pageSize: 0,
        searchForm: {
          searchText: ''
        },
        userForm: {
          name: '',
          showName: '',
          password: '123456',//默认密码
          superAdmin: '1' //默认普通管理员权限
        },
        userRule: {
          name: [
            {required: true, message: '请输入用户登录名', trigger: 'blur'},
            {validator: validateName, trigger: 'blur'}
          ],
          showName: [
            {required: true, message: '请输入用户展示名', trigger: 'blur'}
          ]
        },
        userColumns: [
          {
            title: 'ID',
            key: '_id'
          },
          {
            title: '用户名',
            key: 'name'
          },
          {
            title: '展示名',
            key: 'showName'
          },
          {
            title: '密码',
            key: 'password'
          },
          {
            title: '权限',
            key: 'superAdmin',
            render: (h, params) => {
              let power = params.row.superAdmin ?  '超级管理员' : '普通管理员'
              return h('div',power);
            }
          },
          {
            title: '创建日期',
            key: 'createdDate',
            render: (h, params) => {
              return h('div', (this.dateFormat(params.row.createdDate)))
            }
          },
          {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (h, params) => {
              if(this.userInfo.superAdmin){//如果登录用户是超级管理员
                if(params.row.superAdmin){
                  return h('div',[
                    h('Button', {
                      props: {
                        type: 'error',
                        size: 'small',
                        disabled: true
                      }
                    },'删除')
                  ])
                }else{
                  return h('div',[
                    h('Button', {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.deleteUserModel = true;
                          this.deleteUserId = params.row._id;
                          this.deleteUserName = params.row.name;
                        }
                      }
                    },'删除')
                  ])
                }
              }else{
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: true
                    }
                  },'删除')
                ])
              }
            }
          }
        ],
        userData: []
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      init(searchText){
        let page = this.page;
        getUserList(page, searchText).then((response) => {
          if(!response.data.status){
            this.userData = response.data.data;
            this.totalData = response.data.pagenation.count;
            this.pageSize = response.data.pagenation.pageSize;
            this.$Message.success('查询管理员列表成功');
          }else{
            this.$Message.error('查询管理员列表失败')
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      searchAdminHandler(){
        let searchText = this.searchForm.searchText || '';
        this.init(searchText);
      },
      pageHandler(page){
        this.page = page;
        this.init();
      },
      addUserModelHandler(){
        this.addUserModel = true;
      },
      sureAddUserHandler(){
        this.$refs.userForm.validate((valid) => {
          if(valid){
            let name = this.userForm.name || '';
            let showName = this.userForm.showName || '';
            addUser(name, showName).then((response) => {
              if(!response.data.status){
                this.$Message.success('添加管理员成功');
                this.searchAdminHandler();
              }else{
                this.$Message.error('添加管理员失败: '+response.data.message)
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }else{
            this.$Message.error('请输入正确的用户信息')
          }
        });
      },
      sureDeleteUserHandler(){
        let userId = this.deleteUserId;
        deleteUser(userId).then((response) => {
          if(!response.data.status){
            this.$Message.success('删除管理员成功');
            this.searchAdminHandler()
          }else{
            this.$Message.error(err)
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      cancle(){

      }
    },
    mounted(){
      this.$nextTick(() => {
        this.init()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .user-list{
    .userList_box{
      .add_user_box{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    .page_box{
      padding: 20px 0;
    }
  }
</style>
