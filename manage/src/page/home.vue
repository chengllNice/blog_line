<template>
  <div class="home">
    <Layout class="container">
      <Sider hide-trigger collapsible :collapsed-width="78">
        <div class="layout-logo">
          <a>博客后台管理</a>
        </div>
        <Menu active-name="manage" theme="dark" :accordion="true" width="auto" @on-select="menuHandler">
          <Submenu name="1">
            <template slot="title">
              <Icon type="home"></Icon>
              首页
            </template>
            <MenuItem name="manage">首页</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="person"></Icon>
              用户管理
            </template>
            <MenuItem name="userList">用户列表</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="folder"></Icon>
              目录管理
            </template>
            <MenuItem name="category">目录列表</MenuItem>
            <MenuItem name="addCategory" v-if="userInfo.superAdmin">添加目录</MenuItem>
            <MenuItem name="addSubCategory" v-if="userInfo.superAdmin">添加子目录</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title">
              <Icon type="edit"></Icon>
              博文管理
            </template>
            <MenuItem name="articleList">博文列表</MenuItem>
            <MenuItem name="addArticle">添加博文</MenuItem>
          </Submenu>
          <Submenu name="5">
            <template slot="title">
              <Icon type="image"></Icon>
              图片管理
            </template>
            <MenuItem name="imageList">图片管理</MenuItem>
          </Submenu>
          <Submenu name="6">
            <template slot="title">
              <Icon type="pricetag"></Icon>
              模块管理
            </template>
            <MenuItem name="moduleList">模块列表</MenuItem>
            <MenuItem name="addModule">添加模块</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <div class="header_wrap">
            <div class="wellcome">
              <span v-if="userInfo.superAdmin">您是超级管理员</span>
              <span v-else>您是普通管理员</span>
            </div>
            <div class="header_box">
              <div class="item">
                <Badge count="3">
                  <Icon type="ios-bell-outline"></Icon>
                </Badge>
              </div>
            </div>
            <Menu mode="horizontal">
              <Submenu name="userInfo">
                <template slot="title">
                  <Avatar :src="userAvatar" class="userAvatar"></Avatar>
                  <span class="username" v-if="userInfo.name">{{userInfo.name}}</span>
                  <span class="username" v-else>请登录</span>
                </template>
                <MenuItem name="edit_psd" class="login_out"><span @click="editPasswordHandler">修改密码</span></MenuItem>
                <MenuItem name="login_out" class="login_out"><span @click="loginOutHandler">退出</span></MenuItem>
              </Submenu>
            </Menu>
          </div>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', padding: '0 20px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>

    <audio id="bgsound">
      <source src="../assets/bgsound.mp3" type="audio/mpeg">
      <source src="../assets/bgsound.wav" type="audio/wav">
    </audio>

    <!--修改管理员的模态框-->
    <Modal
      v-model="editPasModel"
      title="修改密码"
      @on-ok="sureEditPsdHandler"
      @on-cancel="cancle">
      <Form ref="editForm" :model="editForm" :rules="editRule" :label-width="80">
        <FormItem prop="password" label="原密码">
          <Input type="text" v-model="editForm.password" placeholder="请输入用户密码..."></Input>
        </FormItem>
        <FormItem prop="newPassword" label="新密码">
          <Input type="text" v-model="editForm.newPassword" placeholder="请输入6-18位任意字符..."></Input>
        </FormItem>
        <FormItem prop="rePassword" label="确认密码">
          <Input type="text" v-model="editForm.rePassword" placeholder="请输入用户确认密码..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {isLogin, loginOut, editPsd} from '@/axios/getData'
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: "home",
    data() {
      //验证密码是否一致
      const validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else {
          if (this.editForm.newPassword !== value) {
            callback(new Error('新密码和确认密码不一致'));
          }
          callback();
        }
      };
      // 新密码验证
      const validateNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (value.length > 18 || value.length < 6) {
            callback(new Error('密码长度为6-18个任意字符'));
          }
          callback();
        }
      };
      return {
        editPasModel: false,//修改密码的model
        editForm: {
          password: '',
          newPassword: '',
          rePassword: ''
        },
        editRule: {
          password: [
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: validateNewPass, trigger: 'blur'}
          ],
          rePassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validateCheckPass, trigger: 'blur'}
          ]
        },
        userAvatar: '/static/images/avatar5.png'
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      ...mapMutations(['userInfoMuta']),
      menuHandler(routerName) {
        this.$router.push(routerName)
      },
      init() {
        isLogin().then((response) => {
          if (!response.data.status) {
            this.username = response.data.data.name;
            this.userId = response.data.data._id;
            this.userInfoMuta(response.data.data);
          } else {
            this.$Message.error('登录错误');
            this.$router.push('login')
          }
        }).catch((err) => {
          this.$Message.error(err);
          this.$router.push('login')
        })
      },
      loginOutHandler() {
        loginOut().then((response) => {
          this.$Message.success('退出成功');
          this.$router.push('login')
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      editPasswordHandler() {
        this.editPasModel = true;
      },
      sureEditPsdHandler() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let userId = userInfo._id;
            let password = this.editForm.newPassword;
            editPsd(userId, password).then((response) => {
              if (!response.data.status) {
                this.$Message.success('修改密码成功,请重新登录');
                setTimeout(() => {
                  this.$router.push('login');
                }, 500);
              } else {
                this.$Message.error('修改密码失败')
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          } else {
            this.$Message.error('请输入输入信息是否正确')
          }
        });
      },
      cancle() {

      }
    },
    mounted() {
      this.init();
    },
    sockets:{
      connect: function(){
        console.log('socket connected')
      },
      commitSubmitDid: function(val){
        this.$Notice.open({
          title: '您有一条新的评论信息',
          desc: '111',
          render: h => {
            return h('div', [
              h('p', val.data.msg.title),
              h('span', val.data.msg.text)
            ])
          },
          duration: 0
        });
        if(val){
          $('#bgsound').trigger('play');
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    .header_wrap {
      height: 100%;
      display: flex;
      justify-content: flex-end;

      .wellcome {
        span {
          padding-right: 20px;
          color: #000;
        }
      }
      & > * {
        height: 100%;
      }
      .header_box {
        font-size: 26px;
        display: flex;
        flex-direction: row;
        padding-right: 10px;
        .item {
          padding: 0 20px;
          cursor: pointer;
          -webkit-transition: all 0.3s;
          -moz-transition: all 0.3s;
          -ms-transition: all 0.3s;
          -o-transition: all 0.3s;
          transition: all 0.3s;
          &:hover {
            background: #424f63;
            color: #65CEA7;
          }
        }
      }
      .userAvatar {
        margin-right: 5px;
      }
      .username {
        margin-right: 5px;
      }
      .login_out {
        padding: 0;
        span {
          display: block;
          padding: 7px 16px 8px;
        }
      }
    }

    .container {
      width: 100%;
      height: 100%;
      .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
      }

      .layout-logo {
        font-size: 20px;
        font-weight: bold;
        padding: 20px 0;
        padding-left: 20px;
        a {
          color: #65cea7;
        }
      }
    }

    .ivu-layout-sider {
      background: #424f63;
      .ivu-layout-sider-children{
        .ivu-menu.ivu-menu-dark.ivu-menu-vertical{
          background: #424f63!important;
        }
      }


      .ivu-menu-item-active.ivu-menu-item-selected {
        background: #2A323F !important;
        color: #65CEA7 !important;
        &:hover {
          background: #2A323F !important;
        }
      }
      .ivu-menu{
        background: #353f4f!important;
        li.ivu-menu-item:hover {
          background: #2A323F !important;
          color: #65CEA7 !important;
        }
      }
    }
  }

</style>
