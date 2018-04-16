<template>
    <div class="edit-article">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>编辑博文</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="content">
        <Form ref="articleForm" :model="articleForm" :rules="articleRule" :label-width="80">
          <FormItem label="博文标题" prop="title">
            <Input v-model="articleForm.title" placeholder="请输入博文标题..." style="width: 300px"></Input>
          </FormItem>
          <FormItem label="博文描述" prop="description">
            <Input v-model="articleForm.description" type="textarea" :autosize="{maxRows: 5}" placeholder="请输入博文描述..."></Input>
          </FormItem>
          <FormItem label="博文目录" prop="subcategory">
            <Select v-model="articleForm.subcategory" style="width:200px">
              <Option v-for="item in cityList" :value="item._id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="博文来源" prop="markType">
            <Select v-model="articleForm.markType" disabled style="width:200px">
              <Option value="原创">原创</Option>
              <Option value="转载">转载</Option>
            </Select>
          </FormItem>
          <FormItem label="博文标签">
            <Tag v-for="(tagItem, index) in articleForm.tags"
                 :key="index" v-if="articleForm.tags.length"
                 closable
                 @on-close="tagCloseHandler(index)">{{tagItem}}</Tag>
            <Button @click="addTagToggleHandler" v-if="!tagToggle">+ 添加标签</Button>
            <Input v-if="tagToggle"
                   v-model="tagName"
                   placeholder="标签名"
                   style="width: 100px"
                   @on-enter="addTagHandler"
                   @on-blur="addTagHandler" :maxlength="10"></Input>
          </FormItem>
          <FormItem label="博客内容" prop="content">
            <mavon-editor style="height: 100%" v-model="articleForm.content" @change="contentHandler"></mavon-editor>
          </FormItem>
          <FormItem>
            <Button>重置</Button>
            <Button type="primary" @click="submitHandler">提交</Button>
          </FormItem>
        </Form>
      </div>
    </div>
</template>

<script>
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import { articleDetail, getSubCategory, editArticle } from "../axios/getData";

  export default {
    name: "edit-article",
    data(){
      return {
        articleForm: {
          title: '',
          description: '',
          tags: [],
          subcategory: '',
          content: '',
          markType: ''
        },
        renderHtml: '',
        articleRule: {
          title: [
            {required: true, message: '请输入博文标题', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入博文描述', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入博文内容', trigger: 'blur'}
          ],
          subcategory: [
            {required: true, message: '请选择博文目录', trigger: 'blur'}
          ],
          markType: [
            {required: true, message: '请选择博文来源', trigger: 'blur'}
          ]
        },
        tagName: '',
        tagToggle: false,
        articleId: null,
        cityList: []
      }
    },
    components: {
      mavonEditor
    },
    methods: {
      init(){
        let articleId = this.$route.query.id;
        if(!articleId){
          this.$Message.error('获取博文内容失败');
          this.$router.push('articleList');
          return;
        }
        this.getSubcategoryHandler();//获取子目录列表
        articleDetail(articleId).then((response) => {
          let res = response.data.data;
          this.articleForm.title = res.title;
          this.articleForm.description = res.description;
          this.articleForm.content = res.content.markdown;
          this.articleForm.tags = res.tags;
          this.articleForm.subcategory = res.subcategory;
          this.articleForm.markType = res.markType;
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      getSubcategoryHandler(){
        getSubCategory().then((response) => {
          if(response.status){
            this.cityList = response.data.data;
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      addTagToggleHandler(){
        this.tagName = '';
        this.tagToggle = true;
      },
      addTagHandler(){
        let tagName = this.tagName;
        this.articleForm.tags.push(tagName);
        this.tagToggle = false;
      },
      tagCloseHandler(index){
        this.articleForm.tags.splice(index, 1)
      },
      submitHandler(){
        this.$refs.articleForm.validate((valid) => {
          if(valid){
            let articleId = this.$route.query.id;
            let title = this.articleForm.title.trim();
            let description = this.articleForm.description.trim();
            let tags = this.articleForm.tags;
            let subcategory = this.articleForm.subcategory;
            let content = {
              markdown: this.articleForm.content,
              article: this.renderHtml
            };
            editArticle(articleId, title, description, tags, subcategory, content).then((response) => {
              if(response.status){
                this.$Message.success('修改成功')
              }else{
                this.$Message.error('修改失败')
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }else{
            this.$Message.error('请输入完整的信息')
          }
        })
      },
      contentHandler(value,render){
        this.renderHtml = render;
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .v-note-wrapper {
    z-index: 800;
  }
  .markdown-body{
    z-index: 800;
  }
</style>
