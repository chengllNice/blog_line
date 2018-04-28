<template>
    <div class="module-item">
      <Form ref="moduleItemForm" :model="moduleItemForm" :rules="moduleItemRule" :label-width="100">
        <div v-if="isModuleType">
          <FormItem prop="title" label="列表项标题">
            <Input type="text" placeholder="请输入模块列表项的标题" v-model="moduleItemForm.title"></Input>
          </FormItem>
          <FormItem prop="href" label="列表项链接">
            <Input type="text" placeholder="请输入模块列表项的标题" v-model="moduleItemForm.href"></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem prop="title" label="图片标题">
            <Input type="text" placeholder="请输入图片标题" v-model="moduleItemForm.title"></Input>
          </FormItem>
          <FormItem prop="href" label="图片链接">
            <Input type="text" placeholder="请输入图片链接" v-model="moduleItemForm.href"></Input>
          </FormItem>
          <FormItem label="上传图片">
            <div class="demo-upload-list" v-if="uploadList.status">
              <template v-if="uploadList.status === 'finished'">
                <img :src="uploadList.response.data">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(uploadList.response.data)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(uploadList.response.data)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="uploadList.showProgress" :percent="uploadList.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload
              v-if="!uploadList.status"
              ref="upload"
              name="module"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              type="drag"
              action="/manage/moduleUpload"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片展示" v-model="visible">
              <img :src="uploadList.response.data" v-if="visible" style="width: 100%">
            </Modal>
          </FormItem>
        </div>
      </Form>
    </div>
</template>

<script>
  import { deleteUploadImage } from "../axios/getData";

  export default {
    name: "module-item",
    props: ['isModuleType', 'moduleData'],
    computed: {

    },
    data(){
      let validHref = (rule, value, callback) => {
        let reg = /^(((https?|ftp|news):\/\/|\w+(\.\w+)+)(:\w+)?).*/;
        if(!reg.test(value)){
          callback('请输入正确的链接地址，类似：http://www.baidu.com');
          return;
        }
        callback();
      };
      return {
        imgName: '',
        visible: false,
        uploadList: {},
        moduleItemForm: {
          title: '',
          href: ''
        },
        moduleItemRule: {
          title: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          href: [
            {required: true, message: '请输入链接', trigger: 'blur'},
            {validator: validHref, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(){
        if(this.moduleData){
          this.moduleItemForm = this.moduleData;
          this.uploadList = {
            status: 'finished',
            response: {
              data: this.moduleData.url
            }
          }
        }
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (filepath) {
        deleteUploadImage(filepath).then((response) => {
          if(!response.data.status){
            this.$Message.success('删除图片成功');
            this.uploadList = {};
          }
        }).catch((err) => {
          this.$Message.error(err);
        })
      },
      handleSuccess (res, file) {
        this.uploadList = file;
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: '只支持jpg,jpeg,png格式的图片'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件大小错误',
          desc: '最大支持2M的文件大小'
        });
      },
      handleBeforeUpload () {

      }
    },
    mounted () {
      this.$nextTick(() => {
        setTimeout(()=>{
          this.init();
        },500)
      })
    }
  }
</script>

<style lang="scss" scoped>
.module-item{
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}
</style>
