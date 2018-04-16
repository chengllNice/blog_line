<template>
    <div class="image-list">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>图片列表</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="content">
        <div class="title">
          <Button type="success" @click="addImageHandler">添加图片</Button>
        </div>
        <div class="image_list_wrap">
          <CheckboxGroup v-model="selectedBannerList">
            <div class="show_image_wrap" v-if="bannerImageList.length">
              <div class="show_title">
                <h4>首页轮播图</h4>
                <Button @click="changeBannerList(false)">移出轮播图</Button>
              </div>
              <div class="show_list">
                <div class="item" v-for="(imageItem, index) in bannerImageList">
                  <Card>
                    <div slot="title" class="img_title">
                      <div class="checkbox_box">
                        <Checkbox :label="imageItem._id" size="large">{{imageItem.title}}</Checkbox>
                      </div>
                    </div>
                    <div class="img_box"><img :src="imageItem.url" alt=""></div>
                    <div class="img_href" :title="imageItem.href">{{imageItem.href}}</div>
                  </Card>
                </div>
              </div>
            </div>
          </CheckboxGroup>

          <CheckboxGroup v-model="selectedList">
            <div class="all_image_wrap" v-if="imageList.length">
              <div class="all_title">
                <h4>所有图片列表</h4>
                <ButtonGroup>
                  <Button @click="changeBannerList(true)">添加到展示列表</Button>
                  <Button type="error" @click="deleteSelectedListHandler">删除选中的图片</Button>
                </ButtonGroup>
              </div>
              <div class="all_list">
                <div class="item" v-for="(imageItem, index) in imageList" :class="[imageItem.isShow ? 'selectedBanner': '']">
                  <Card>
                    <div slot="title" class="img_title">
                      <div class="checkbox_box">
                        <Checkbox :label="imageItem._id" size="large">{{imageItem.title}}</Checkbox>
                      </div>
                    </div>
                    <div class="img_box"><img :src="imageItem.url" alt=""></div>
                    <div class="img_href" :title="imageItem.href">{{imageItem.href}}</div>
                  </Card>
                </div>
              </div>
            </div>
          </CheckboxGroup>

        </div>
      </div>

      <!--上传图片的模态框-->
      <Modal
        v-model="uploadImage"
        @on-ok="uploadHandler"
        title="上传图片">
        <div>
          <Upload
            type="drag"
            name="banner"
            :format="['jpg', 'jpeg', 'png']"
            action="/manage/upload"
            :default-file-list="uploadList"
            :before-upload="beforeUploadHandler"
            :on-success="uploadSuccessHandler"
            :on-error="uploadErrorHandler">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽上传图片</p>
            </div>
          </Upload>
          <Form ref="bannerForm" :model="bannerForm" :rules="ruleForm" :label-width="80">
            <FormItem label="图片链接" prop="href">
              <Input type="text" v-model="bannerForm.href" placeholder="请输入链接地址，形如：http://www.baidu.com"></Input>
            </FormItem>
            <FormItem label="图片标题" prop="title">
              <Input type="text" v-model="bannerForm.title" placeholder="请输入图片标题"></Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
</template>

<script>
  import { uploadImage, getImageList, deleteImage, bannerImageList, changeBannerImageList } from "../axios/getData";
  const BASE_IMAGE = '127.0.0.1:8080';

  export default {
    name: "image-list",
    data(){
      let validateHref = (rule, value, callback) => {
        let reg = /^(((https?|ftp|news):\/\/|\w+(\.\w+)+)(:\w+)?).*/;
        if(!reg.test(value)){
          callback('请输入正确的链接地址，类似：http://www.baidu.com');
          return;
        }
        callback();
      };
      return {
        uploadImage: false,
        uploadList: [],
        imageList: [],
        bannerImageList: [],
        selectedList: [],
        selectedBannerList: [],
        bannerForm: {
          href: '',
          title: ''
        },
        ruleForm: {
          href: [
            {required: true, message: '请输入链接地址', trigger: 'blur'},
            {validator: validateHref, trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入图片标题', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(){
        getImageList().then((response) => {
          if(!response.data.status){
            this.imageList = response.data.data;
          }else{
            this.$Message.error('图片列表加载失败')
          }
        });
        bannerImageList().then((response) => {
          if(!response.data.status){
            this.bannerImageList = response.data.data;
          }else{
            this.$Message.error('图片列表加载失败')
          }
        })
      },
      addImageHandler(){
        this.uploadImage = true;
      },
      beforeUploadHandler(file){
        // this.uploadList = [];
      },
      uploadSuccessHandler(response, file, fileList){
        this.uploadList = [fileList[fileList.length-1]]
      },
      uploadErrorHandler(error, file, fileList){

      },
      uploadHandler(){
        this.$refs.bannerForm.validate((valid) => {
          if(valid){
            let href = this.bannerForm.href;
            let title = this.bannerForm.title;
            uploadImage(href, title).then((response) => {
              if(!response.data.status){
                this.$Message.success('上传成功');
                this.init();
                this.bannerForm.href = '';
                this.bannerForm.title = '';
                this.uploadList = [];
              }else{
                this.$Message.error(response.data.message)
              }
            });
          }else{
            this.$Message.error('上传失败')
          }
        })
      },
      deleteSelectedListHandler(){
        if(!this.selectedList.length){
          this.$Message.error('请选择要删除的图片');
          return;
        }
        deleteImage(this.selectedList).then((response) => {
          if(!response.data.status){
            this.$Message.success('图片删除成功');
            this.init()
          }else{
            this.$Message.success('图片删除失败');
          }
        })
      },
      changeBannerList(isShow){
        let imageList = '';
        if(isShow){
          imageList = this.selectedList
        }else{
          imageList = this.selectedBannerList;
        }
        if(!imageList.length){
          this.$Message.error('请选择图片');
          return;
        }
        changeBannerImageList(isShow, imageList).then((response) => {
          if(!response.data.status){
            this.$Message.success('改变成功');
            this.init();
            this.selectedList = [];
            this.selectedBannerList = [];
          }
        })
      }
    },
    mounted(){
      this.init();
    }
  }
</script>

<style lang="scss" scoped>
  .image-list{
    .content{
      .title{
        padding: 10px;
        border-bottom: 1px solid #cccccc;
      }
      .image_list_wrap{
        .all_image_wrap{
          .all_title{
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dotted #cccccc;
          }
          .all_list{
            display: flex;
            flex-wrap: wrap;
            .item{
              padding: 10px;
              width: 25%;
              .img_box{
                img{
                  width: 100%;
                  height: 100%;
                  vertical-align: top;
                }
              }
              .img_href{
                width: 80%;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 10px;
              }
              .img_title{
                width: 80%;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 5px;
              }
            }
            .selectedBanner{
              color: #ed3f14;
            }
          }
        }
        .show_image_wrap{
          border-bottom: 1px solid #cccccc;
          .show_title{
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dotted #cccccc;
          }
          .show_list{
            display: flex;
            flex-wrap: wrap;
            .item{
              padding: 10px;
              width: 25%;
              .img_box{
                img{
                  width: 100%;
                  height: 100%;
                  vertical-align: top;
                }
              }
              .img_href{
                width: 80%;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 10px;
              }
              .img_title{
                width: 80%;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
