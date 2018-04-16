<template>
    <div class="slider-boot">

      <div id="sliderBoot" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li data-target="#sliderBoot" v-for="(bootItem, index) in sliderData" :data-slide-to="index" :class="{'active': index === 0}"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
          <div class="item" v-for="(item,index) in sliderData" :key="index" :class="{'active': index === 0}">
            <a :href="item.href" target="_blank">
              <img :src="item.url" alt="">
            </a>
          </div>
        </div>

        <!-- Controls -->
        <a class="left carousel-control" href="#sliderBoot" role="button" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#sliderBoot" role="button" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>

      <div class="visible-lg">
        <div class="banner_small_box">
          <div class="item_01" v-for="(item,index) in sliderData" :key="index" :class="{'active': index === defaultSliderItemIndex}" @click="bannerContrlHandler(index)">
            <div class="border_active"></div>
            <img :src="item.url" alt="...">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  let index = 0;
  let self = null;
  $(function () {
    $('#sliderBoot').on('slid.bs.carousel',function () {
      index = $(this).children('.carousel-indicators').children('.active').index();
      self.defaultSliderItemIndex = index;
    })
  });

  export default {
    name: "slider-boot",
    props: ['bannerData'],
    data(){
      return {
        defaultSliderItemIndex: index
      }
    },
    computed: {
      sliderData(){
        return this.bannerData;
      }
    },
    methods: {
      bannerContrlHandler(index){
        this.defaultSliderItemIndex = index;
        $('#sliderBoot').carousel(index);
      }
    },
    mounted(){
      self = this;
    }
  }
</script>

<style lang="scss" scoped>
  .slider-boot{
    width: 100%;
    /*height: 320px;*/
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    .slide{
      flex: 1;
      img{
        width: 100%;
      }
    }

    .carousel-inner{
      height: 100%;
      &>*{
        height: 100%;
      }
      img{
        height: 100%;
      }
    }

    .banner_small_box{
      margin-left: 20px;
      height: 100%;
      display: flex;
      width: 208px;
      flex-direction: column;
      justify-content: space-between;
      .item_01{
        width: 100%;
        height: 72px;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;

        &+.item_01{
          margin-top: 10px;
        }
        .border_active{
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #d5d5d5;
        }
        img{
          width: 198px;
          height: 62px;
          margin: auto;
        }
        &:hover{
          border-color: #1abc9c;
          -webkit-transform: scale(1.05);
          -moz-transform: scale(1.05);
          -ms-transform: scale(1.05);
          -o-transform: scale(1.05);
          transform: scale(1.05);
        }
      }
      .active{
        .border_active{
          border-color: #1abc9c;
          &:before{
            content: '';
            position: absolute;
            left: -20px;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid #1abc9c;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }
        }
      }
    }

    @media screen and (min-width: 1200px) {
      .banner_small_box{
        .item_01 {
          height: 90px;
          img{
            height: 80px;
          }
        }
      }
    }
  }
</style>
