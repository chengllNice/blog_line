<template>
    <div class="add-category">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>添加目录</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="add_category_box">
        <div class="select_box">
          <Form ref="categoryForm" :model="categoryForm" :rules="categoryRules" :label-width="80">
            <FormItem label="目录名称" prop="name">
              <Input v-model="categoryForm.name" placeholder="请输入目录名称..."></Input>
            </FormItem>
            <FormItem>
              <Button type="ghost" @click="resetHandler">重置</Button>
              <Button type="primary" style="margin-left: 8px" @click="submitCategoryHandler">提交</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
</template>

<script>
  import { addCategory } from "../axios/getData";

  export default {
    name: "add-category",
    data(){
      return {
        categoryForm: {
          name: ''
        },
        categoryRules: {
          name: [
            {required: true, message: '请输入目录名', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 提交方法
      submitCategoryHandler(){
        this.$refs.categoryForm.validate((valid) => {
          if(valid){
            let name = this.categoryForm.name.trim();
            if(!name){
              this.$Message.warning('请输入目录名');
              return;
            }
            addCategory(name).then((response) => {
              if(response.status){
                this.$Message.success('添加目录成功');
                this.categoryForm.name = '';
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }else{
            this.$Message.error('添加失败');
          }
        });
      },
      // 重置方法
      resetHandler () {
        this.$refs.categoryForm.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .add-category{
    padding-bottom: 10px;
  }
</style>
