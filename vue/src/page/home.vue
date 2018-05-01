<template>
  <div class="home">
    <div class="aside_wrap visible-xs">
      <aside-nav></aside-nav>
    </div>
    <div class="main">
      <my-header @asideToggle="asideToggleHandler"></my-header>
        <div class="container_main" :class="{'overScroll': isScroll}">
          <div class="view_main">
            <router-view></router-view>
          </div>
          <my-footer></my-footer>
        </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '@/components/MyHeader'
  import asideNav from '@/components/asideNav'
  import myFooter from '@/components/MyFooter'
  import { isIE, isPC } from '../config/utils'
  export default {
    name: "home",
    data(){
      return {
        toggleAside: true
      }
    },
    computed: {
      isScroll(){
        return (isPC() && isIE());
      }
    },
    components: {
      myHeader,
      asideNav,
      myFooter
    },
    methods: {
      asideToggleHandler(){
        this.toggleAside = !this.toggleAside;
        if(this.toggleAside){
          $('.aside_wrap').css({'transform': 'translateX(-240px)'});
          $('.main').css({'transform': 'translateX(0px)'})
        }else{
          $('.aside_wrap').css({'transform': 'translateX(0)'});
          $('.main').css({'transform': 'translateX(240px)'})
        }
      },
      getNiceScroll(){
        let option = {
          cursorcolor: '#1abc9c',//改变滚动条颜色
          cursorwidth: '6px',//滚动条宽度
          cursorborder: '0px',//滚动条边框
          background: 'rgb(66, 79, 99)' //滚动条轨道的背景
        };
        $('.container_main').niceScroll(option);
      },
    },
    mounted(){
      if(!isIE() && isPC()){
        this.$nextTick(() => {
          setTimeout(()=>{
            this.getNiceScroll()
          },1000)
        });
      }
    },
    watch: {
      $route(){
        if(!isIE() && isPC()){
          this.$nextTick(() => {
            setTimeout(() => {
              $('.container_main').getNiceScroll().resize();
              $(".container_main").getNiceScroll(0).doScrollTop(0);
            },1000);
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  .home{
    width: 100%;
    height: 100%;

    .aside_wrap, .main{
      height: 100%;
      -webkit-transition: all 0.5s;
      -moz-transition: all 0.5s;
      -ms-transition: all 0.5s;
      -o-transition: all 0.5s;
      transition: all 0.5s;

      .container_main{
        height: 100%;
        overflow: scroll;
      }
      .overScroll{
        overflow: auto;
      }
      .view_main{
        padding: 20px 50px;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .view_main{
      padding: 5px 5px 10px 5px!important;
    }
    .aside_wrap{
      width: 240px;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      overflow: auto;
      -webkit-transform: translateX(-240px);
      -moz-transform: translateX(-240px);
      -ms-transform: translateX(-240px);
      -o-transform: translateX(-240px);
      transform: translateX(-240px);
    }
    .main {
      width: 100%;
      /*margin-left: 240px;*/
    }
  }
</style>
