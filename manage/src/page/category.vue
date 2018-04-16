<template>
    <div class="category">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>目录列表</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="category_list_box">
        <h2>目录列表</h2>
        <Table :columns="columnscategory" :data="datacategory"></Table>
      </div>
      <div class="category_list_box">
        <h2>子目录列表</h2>
        <Table :columns="columnsSubCategory" :data="dataSubCategory"></Table>
      </div>
      <!--删除的模态框-->
      <Modal
        v-model="deleteModel"
        title="删除提示"
        @on-ok="sureDeleteHandler"
        @on-cancel="cancelHandler">
        <p>确定要删除此条数据么？</p>
        <div class="deleteAlt">要删除的目录为：<span style="font-size: 16px;font-weight: bold;color: #1abc9c;">{{deleteName}}</span></div>
      </Modal>

      <!--编辑的模态框-->
      <Modal
        v-model="editCategoryModel"
        title="改变子目录所属目录"
        @on-ok="sureEditHandler"
        @on-cancel="cancelHandler">
        <div class="">
          <Form ref="changeCategoryForm" :model="changeCategoryForm" :rules="changeCategoryRule" :label-width="80">
            <FormItem label="所属目录" prop="subcategory">
              <Select v-model="changeCategoryForm.subcategory" style="width:200px">
                <Option v-for="item in datacategory" :value="item._id" :key="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
</template>

<script>
  import { getSubCategory, getCategory, deleteSubCategory, deleteCategory, editSubCategory } from "../axios/getData";
  import { mapState } from 'vuex'

  export default {
    name: "category",
    data(){
      return {
        deleteModel: false,
        deleteName: '',
        deleteNameId: '',
        editCategoryModel: false,
        changeCategoryForm: {
          subcategory: ''
        },
        changeCategoryRule: {
          subcategory: [
            {required: true, message: '请选择目录', trigger: 'blur'}
          ]
        },
        categoryDelete: false,//子目录和目录删除的切换
        columnsSubCategory: [
          {
            title: '子目录名称',
            key: 'name'
          },
          {
            title: '所属目录名称',
            key: 'category',
            render: (h, params) => {
              let name = '无此目录';
              if(params.row.category){
                name = params.row.category.name;
              }
              return h('div', name)
            }
          },
          {
            title: '编辑',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              if(this.userInfo.superAdmin){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editCategoryModel = true;
                        this.deleteNameId = params.row._id;
                        /*this.deleteModel = true;
                        this.deleteName = params.row.name;
                        this.deleteNameId = params.row._id;
                        this.categoryDelete = true;*/
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deleteModel = true;
                        this.deleteName = params.row.name;
                        this.deleteNameId = params.row._id;
                        this.categoryDelete = true;
                      }
                    }
                  }, '删除')
                ]);
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      disabled: true
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: true
                    }
                  }, '删除')
                ]);
              }
            }
          }
        ],
        dataSubCategory: [],
        columnscategory: [
          {
            title: '目录名称',
            key: 'name'
          },
          {
            title: '编辑',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              if(this.userInfo.superAdmin){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deleteModel = true;//打开模态框
                        this.deleteName = params.row.name;//提示要删除目录的名称
                        this.deleteNameId = params.row._id;//要删除目录的ID
                        this.categoryDelete = false;//false时是删除目录的操作
                      }
                    }
                  }, '删除')
                ]);
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: true
                    }
                  }, '删除')
                ]);
              }
            }
          }
        ],
        datacategory: []
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      init(){
        //获取目录列表
        getCategory().then((response) => {
          console.log(response)
          if(!response.data.status){
            this.datacategory = response.data.data;
          }else{
            this.$Message.error('获取目录列表失败');
          }
        }).catch((err) => {
          this.$Message.error(err)
        });
        //获取子目录列表
        getSubCategory().then((response) => {
          if(!response.data.status){
            this.dataSubCategory = response.data.data;
          }else{
            this.$Message.error('获取子目录列表失败');
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      // 确定删除
      sureDeleteHandler(){
        let id = '';
        if(this.categoryDelete){//子目录删除
          id = this.deleteNameId;
          deleteSubCategory(id).then((response) => {
            if(!response.data.status){
              this.$Message.success('删除子目录成功');
              this.init();
            }else{
              this.$Message.error('删除子目录失败');
            }
          }).catch((err) => {
            this.$Message.error(err)
          })
        }else{//目录删除
          id = this.deleteNameId;
          console.log(id)
          deleteCategory(id).then((response) => {
            if(!response.data.status){
              this.$Message.success('删除目录成功');
              this.init();
            }else{
              this.$Message.error('删除目录失败');
            }
          }).catch((err) => {
            this.$Message.error(err)
          })
        }

      },
      // 确定编辑
      sureEditHandler(){
        this.$refs.changeCategoryForm.validate((valid) => {
          if(valid){
            let categoryId = this.changeCategoryForm.subcategory;
            let subCategoryId = this.deleteNameId;
            editSubCategory(categoryId, subCategoryId).then((response) => {
              if(!response.data.status){
                this.$Message.success('修改成功');
                this.init();
              }else{
                this.$Message.error('修改失败')
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }
        });
      },
      cancelHandler(){

      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .category{
    .bread_box{
      padding: 20px 0;
    }
    .category_list_box{
      margin-bottom: 20px;
      &:hover{
        h2{
          padding-left: 30px;
          color: #1abc9c;
        }
      }
      h2{
        font-size: 16px;
        font-weight: 500;
        color: #000;
        margin-bottom: 20px;
        background-color: #eff0f4;
        border-left: 5px solid #1abc9c;
        cursor: default;
        padding: 5px 10px;
        transition: all 0.3s;
      }
    }
  }
</style>
