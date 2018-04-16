<template>
    <div class="manage">
      <!--<mavon-editor style="height: 100%" ref="md" v-model="content" :toolbarsFlag="false" :subfield="false" defaultOpen="preview"></mavon-editor>-->

      <div id="echartsCommit" class="echartsCommit_box"></div>
    </div>
</template>

<script>
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import echarts from 'echarts'
  export default {
    name: "manage",
    data(){
      return {
        content: ''
      }
    },
    components: {
      mavonEditor
    },
    methods: {
      init(){
        let echartsCommit = echarts.init(document.getElementById('echartsCommit'));
        echartsCommit.setOption({
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['评论量', '点赞量', '浏览量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'评论量',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'点赞量',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'浏览量',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330, 410]
            }
          ]
        });
      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .manage{
    width: 100%;
    padding: 10px;
    .echartsCommit_box{
      width: 800px;
      height: 500px;
      box-shadow: 0px 0px 3px #ccc;
    }
  }
</style>
