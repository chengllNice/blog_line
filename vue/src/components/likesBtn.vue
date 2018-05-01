<template>
    <div class="likes-btn">
      <div class="likes_wrap">
        <button type="button" class="btn_custom" @click="likesHandler">点赞 <span v-if="likesLength">| {{this.likesLength}}</span></button>
        <div class="btn_tooltip">
          <span class="tool_left"></span>
          {{this.tooltip}}
        </div>

        <transition name="likes">
          <div v-if="isLikes" class="add_likes_animation">
            +1
          </div>
        </transition>

      </div>
    </div>
</template>

<script>
  import { articleLikes} from "../axios/getData";

  export default {
    name: "likes-btn",
    props: ['tooltip','likesNum'],
    data(){
      return {
        isLikes: false
      }
    },
    computed: {
      likesLength(){
        let num = 0;
        if(this.likesNum){
          num = this.likesNum.length;
        }
        return num;
      }
    },
    methods: {
      likesHandler(){
        let articleId = this.$route.query.id || '';
        articleLikes(articleId).then((response) => {
          if(!response.data.status){
            this.isLikes = true;
            setTimeout(() => {
              this.isLikes = false;
            },1000);
          }
          this.$toast.success(response.data.message)
        }).catch((err) => {
          if(err.data.status == '2'){
            this.$toast.warning(err.data.message)
          }else {
            this.$toast.error(err.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .likes-btn{

    .btn_custom{
      background: #1abc9c;
      border: none;
      color: #ffffff;
      border-radius: 3px;
      padding: 8px 20px;
      font-size: 14px;
      outline: none;
      user-select: none;
      background-image: none;
      &:hover{
        opacity: 0.9;
      }
    }

    .likes_wrap{
      position: relative;
      display: inline-block;
      .btn_tooltip{
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        height: 25px;
        transform: translate(10px,2px);
        background: #000;
        color: #ffffff;
        font-size: 13px;
        padding: 2px 20px;
        cursor: default;
        white-space:nowrap;
        border-radius: 3px;

        .tool_left{
          display: inline-block;
          position: absolute;
          left: -13px;
          top: 50%;
          transform: translateY(-50%);
          width: 0px;
          border-width: 7px;
          border-style: solid;
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: #000;
          border-bottom-color: transparent;
        }
      }
    }

    .likes_wrap:hover{
      .btn_tooltip{
        display: block;
      }
    }

    .likes-enter-active{
      transition: all 1.5s;
    }
    .likes-leave-to{
      opacity: 0;
    }
    .likes-enter{
      transform: translateY(-100px);
    }
    .add_likes_animation{
      width: 22px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      font-weight: bold;
      color: #ffffff;
      background: #1abc9c;
      border-radius: 50%;
      display: inline-block;
      position: absolute;
      right: 2px;
      bottom: 0;
    }
  }
</style>
