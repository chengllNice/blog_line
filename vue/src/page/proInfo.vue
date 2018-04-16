<template>
    <div class="pro-info">
      <div class="pro_wrap">
        <div class="panel">
          <div class="panel-body">
            <div class="info_header">
              <div class="info_wrap">
                <div class="info_img">
                  <img src="/static/images/avatar5.png" alt="">
                </div>
                <div class="info_box">
                  <h2>路无止境</h2>
                  <div class="info_des">
                    <div class="">座右铭：勇往直前</div>
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="info_footer">
              <a href="javascript:;" class="wechat_box">
                <img src="/static/images/weCat.png" alt="">
                <img src="/static/images/wechat_1.jpg" alt="" class="wechat_code">
              </a>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=919903021&site=qq&menu=yes" target="_blank"><img src="/static/images/qq.png" alt=""></a>
              <a href="https://weibo.com/u/6104243558/home?wvr=5" target="_blank"><img src="/static/images/sina.png" alt=""></a>
              <a href="https://github.com/chengllLovezy" target="_blank"><img src="/static/images/github1.png" alt=""></a>
            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
  export default {
    name: "pro-info"
  }
</script>

<style lang="scss" scoped>
  .pro-info{

    .pro_wrap{
      .info_header{
        .info_wrap{
          display: flex;
          flex-direction: row;
          .info_img{
            margin-right: 20px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            overflow: hidden;
            border: 1px solid #ccc;
            padding: 2px;
            transition: all 0.5s;
            img{
              width: 80px;
              height: 80px;
            }
            &:hover{
              transform: scale(1.1);
            }
          }
          .info_box{
            h2{
              font-size: 18px;
              font-weight: 500;
              color: #7a7676;
              margin-bottom: 10px;
            }
            .info_des{
              a{
                color: #65CEA7;
              }
            }
          }
        }
      }
      .info_footer{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        a{
          width: 40px;
          position: relative;
          .wechat_code{
            display: none;
            position: absolute;
            top: 40px;
            left: 0;
            width: 150px;
            border: 1px solid #cccccc;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
          }
          &>img:nth-of-type(1){
            width: 40px;
          }
          &:nth-last-of-type(1) img{
            width: 45px;
          }
        }
        .wechat_box:hover{
          .wechat_code{
            display: block;
          }
        }
      }
    }
  }
</style>
