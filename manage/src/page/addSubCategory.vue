<template>
    <div class="add-sub-category">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>添加子目录</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="content">
        <Form ref="categoryForm" :model="categoryForm" :rules="categoryRule" :label-width="80">
          <FormItem label="选择目录" prop="category">
            <Select v-model="categoryForm.category" style="width:200px">
              <Option v-for="item in cityList" :value="item._id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="目录名称" prop="name">
            <Input v-model="categoryForm.name" placeholder="请输入子目录名称..."></Input>
          </FormItem>
          <FormItem>
            <Button type="ghost" @click="resetHandler">重置</Button>
            <Button type="primary" style="margin-left: 8px" @click="submitHandler">提交</Button>
          </FormItem>
        </Form>
      </div>
    </div>
</template>

<script>
  import { getCategory, addSubCategory } from '../axios/getData'
  // import imgUpload from '../components/imgUpload'
  export default {
    name: "add-sub-category",
    data(){
      return {
        categoryForm: {
          category: '',
          name: ''
        },
        cityList: [],
        categoryRule: {
          category: [
            {required: true, message: '请选择目录', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入子目录名称', trigger: 'blur'}
          ]
        }
      }
    },
    components: {

    },
    methods: {
      init(){
        getCategory().then((response) => {
          if(response.status){
            this.cityList = response.data.data;
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      submitHandler(){
        this.$refs.categoryForm.validate((valid) => {
          if(valid){
            let name = this.categoryForm.name.trim();
            let categoryId = this.categoryForm.category;
            addSubCategory(name,categoryId ).then((response) => {
              if(response.status){
                this.$refs.categoryForm.resetFields();
                this.$Message.success('添加成功')
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }else{
            this.$Message.error('请输入完整信息')
          }
        })
      },
      resetHandler(){
        this.$refs.categoryForm.resetFields();
      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style scoped>
  .add-sub-category{
    padding-bottom: 10px;
  }
</style>
