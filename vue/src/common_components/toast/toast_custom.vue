<template>
    <div class="modal_custom">
      <!--全局提示框组件-->
      <transition name="toast">
          <div v-if="visible" class="dialog-tips dialog-center">
            <div class="dialog_outer">
              <div class="toast_icon_box"><img class="toast_icon" :src="icon_path" alt=""></div>
              <div>{{message}}</div>
            </div>
        </div>
      </transition>
    </div>
</template>

<script>
  export default {
    name: "toast_custom",
    data() {
      return {
        visible: false,
        message: "",
        icon_path: require('./images/info.png')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal_custom{
    .toast-enter-active {
      transition: all .5s;
    }
    .toast-leave-active {
      -webkit-transition: all 0.2s;
      -moz-transition: all 0.2s;
      -ms-transition: all 0.2s;
      -o-transition: all 0.2s;
      transition: all 0.2s;
    }
    .toast-enter {
      transform: translateY(-55px);
    }
    .toast-leave-to{
      opacity: 0;
    }

    .dialog_outer{
      position: relative;
      left: -50%;
      white-space: nowrap;
      padding: 6px 12px 8px 12px;
      background-color: #fefefe;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      box-shadow: 0px 0px 5px 0 #ccc;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .dialog-tips{
      position: absolute;
      z-index: 2000;
    }
    .dialog-center {
      top: 50px;
      left: 50%;
      /*transform: translateX(-50%);*/
    }

    .toast_icon_box{
      margin-right: 10px;
      .toast_icon{
        width: 20px;
        height: 20px;
      }
    }
  }
</style>
