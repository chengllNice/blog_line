<template>
  <div class="login">
    <div class="login_wrap">
      <Card style="width:350px">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="login_form">
          <Form :model="loginForm">
            <FormItem>
              <Input v-model="loginForm.name" ref="name" placeholder="请输入用户名..." @on-enter="loginHandler">
              <span slot="prepend"><Icon type="person"></Icon></span>
              </Input>
            </FormItem>
            <FormItem>
              <Input v-model="loginForm.password" ref="password" placeholder="请输入密码..." @on-enter="loginHandler">
                <span slot="prepend"><Icon type="locked"></Icon></span>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="loginHandler">登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { login } from '@/axios/getData'
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          name: '',
          password: ''
        }
      }
    },
    methods: {
      loginHandler(){
        let name = this.$refs.name.value.trim();
        let password = this.$refs.password.value.trim();
        if(!name || !password){
          this.$Message.warning('请输入用户名和密码');
          return;
        }else{
          login(name, password).then((response) => {
            if(!response.data.status){
              this.$Message.success('登录成功');
              setTimeout(() => {
                this.$router.push('manage')
              },1000)
            }else{
              this.$Message.error('登录失败');
            }
          }).catch((err) => {
            this.$Message.error(err);
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #cccccc url("../../static/images/login_bg.jpg");
    background-size: cover;
    background-position: center;
    position: relative;

    .login_wrap {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);

      .login_form{
        span{
          font-size: 16px;
        }
      }
    }
  }
</style>
