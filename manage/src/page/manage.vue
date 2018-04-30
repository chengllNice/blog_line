<template>
    <div class="manage">
      <!--<mavon-editor style="height: 100%" ref="md" v-model="content" :toolbarsFlag="false" :subfield="false" defaultOpen="preview"></mavon-editor>-->

      <div id="echartsCommit" class="echartsCommit_box"></div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  import { articleAgr} from "../axios/getData";

  export default {
    name: "manage",
    data(){
      return {
        content: ''
      }
    },
    methods: {

      init(){
        articleAgr().then((response) => {
          let date = response.data.data.date;
          let commit = response.data.data.commit;
          let likes = response.data.data.likes;
          this.canvasHandler(date,commit,likes);
        }).catch((err) => {
          this.$Message.error(err.data.message)
        })
      },

      canvasHandler(date,commit,likes){
        let echartsCommit = echarts.init(document.getElementById('echartsCommit'));
        let colors = ['#5793f3','#65cea7'];
        echartsCommit.setOption({
          color: colors,
          title: {
            text: '数据统计'
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data:['评论量', '点赞量']
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
            data: date
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'评论量',
              type:'line',
              smooth: true,
              areaStyle: {
                normal: {

                }
              },
              data:commit
            },
            {
              name:'点赞量',
              type:'line',
              smooth: true,
              areaStyle: {
                normal: {

                }
              },
              data:likes
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
    padding: 20px 0;
    .echartsCommit_box{
      width: 800px;
      height: 500px;
      box-shadow: 0px 0px 3px #ccc;
    }
  }
</style>
