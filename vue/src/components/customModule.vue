<template>
    <div class="custom-module">
      <div class="panel" v-if="moduleData.name">
        <div class="panel-body">
          <div class="module_wrap">
            <div class="module_title" v-if="data.name.mark">
              <h5>{{data.name.text}}</h5>
            </div>
            <!--图片类型-->
            <div class="data_list" v-if="isModuleType">

              <a :href="data.content[0].href" target="_blank">
                <img :src="data.content[0].url" alt="">
                <p>{{data.content[0].title}}</p>
              </a>
            </div>
            <!--列表类型-->
            <div class="data_list" v-else>
              <div class="item" v-for="(item, index) in data.content" :key="index">
                <a :href="item.href" target="_blank">
                  {{item.title}}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "custom-module",
    props: ['data'],
    computed: {
      isModuleType(){
        return this.data.moduleType;
      },
      moduleData(){
        return this.data;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-module{

    a{
      display: inline-block;
      width: 100%;
      text-decoration: none;
      color: #1abc9c;
      border-bottom: 1px solid rgba(0, 154, 97, 0.25);
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover{
        text-decoration: none;
        color: #009a61;
        border-bottom: 1px solid rgba(0,154,97,1);
      }
    }

    .module_title{
      padding-bottom: 10px;
      border-bottom: 1px dotted #cccccc;
      margin-bottom: 15px;
      h5{
        border-left: 3px solid #1abc9c;
        font-weight: 600;
        padding: 3px 0 3px 10px;
      }
    }

    .data_list{
      img{
        width: 100%;
        margin-bottom: 10px;
      }
      &>*{
        margin: 10px 0;
      }
    }
  }

</style>
