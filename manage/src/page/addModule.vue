<template>
    <div class="add-module">
      <div class="bread_box">
        <Breadcrumb>
          <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
          <BreadcrumbItem>添加模块</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="content">
        <Form ref="moduleForm" :model="moduleForm" :rules="moduleRule" :label-width="80">
          <div class="module_com">
            <div class="module_title">
              <h4>模块信息</h4>
            </div>
            <FormItem prop="name" label="模块名称">
              <Input type="text" placeholder="请输入模块名称" v-model="moduleForm.name"></Input>
            </FormItem>
            <FormItem prop="sortIndex" label="模块等级" required>
              <InputNumber :max="10" :min="0" :step="1" v-model="moduleForm.sortIndex"></InputNumber>
            </FormItem>
            <FormItem prop="moduleType" label="模块类型">
              <Select v-model="moduleForm.moduleType" style="width:200px" placeholder="请选择">
                <Option value="0">列表类型</Option>
                <Option value="1">图片类型</Option>
              </Select>
            </FormItem>
          </div>
        </Form>
        <div v-if="isModuleType">
          <div class="module_title">
            <h4>模块内容列表项信息</h4>
            <div class="add_item">
              <Button type="primary" size="small" @click="addNewModuleItem"> + 添加新列表项</Button>
            </div>
          </div>
          <div class="module_item" v-for="(item, index) in moduleItemNum">
            <p>第{{index+1}}列表项</p>
            <module-item :is-module-type="isModuleType"></module-item>
          </div>
        </div>
        <div v-else>
          <div class="module_title">
            <h4>模块内容图片信息</h4>
          </div>
          <module-item :is-module-type="isModuleType"></module-item>
        </div>

        <div class="submit_btn_box">
          <Button type="primary" @click="submitFormHandler">提交</Button>
        </div>
      </div>
    </div>
</template>

<script>
  import moduleItem from '../components/moduleItem'
  import { addCustomModule } from '../axios/getData'
  export default {
    name: "add-module",
    data(){
      return {
        moduleItemData: {},
        moduleItemNum: [1],
        moduleForm: {
          name: '',
          sortIndex: 0,
          moduleType: '0'
        },
        moduleRule: {
          name: [
            {required: true, message: '请输入模块名称', trigger: 'blur'}
          ],
          moduleType: [
            {required: true, message: '请选择模块类型', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isModuleType(){
        return this.moduleForm.moduleType === '0' ? true : false
      }
    },
    components: {
      moduleItem
    },
    methods: {
      addNewModuleItem(){
        this.moduleItemNum.push(1)
      },
      submitFormHandler(){
        let itemContent = [];//子组件列表项的值
        this.$children.forEach((item, index) => {
          if(item.moduleItemForm){
            if(this.moduleForm.moduleType === '1'){
              item.$refs.moduleItemForm.validate((valid) => {
                if(valid){
                  if(item.uploadList.status){
                    itemContent.push({
                      url: item.uploadList.response.data,
                      href: item.moduleItemForm.href,
                      title: item.moduleItemForm.title,
                    })
                  }
                }
              })
            }else{
              item.$refs.moduleItemForm.validate((valid) => {
                if(valid){
                  itemContent.push(item.moduleItemForm)
                }
              })
            }
          }
        });
        if(itemContent.length != this.moduleItemNum.length){
          itemContent = [];
          return;
        }

        let name = this.moduleForm.name;
        let sortIndex = this.moduleForm.sortIndex;
        let moduleType = this.moduleForm.moduleType;

        this.$refs.moduleForm.validate((valid) => {
          if(valid){
            addCustomModule(name, sortIndex, moduleType, itemContent).then((response) => {
              if(!response.data.status){
                this.$Message.success('添加模块成功');
                this.$refs.moduleForm.resetFields();
                this.moduleItemNum = [1];
                this.$children.forEach((item, index) => {
                  if(item.moduleItemForm){
                    item.moduleItemForm.title = '';
                    item.moduleItemForm.href = '';
                    item.uploadList = {};
                  }
                });
              }
            }).catch((err) => {
              this.$Message.error(err)
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .add-module{
    .module_title{
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px dotted #cccccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .module_item{
      border-bottom: 1px dotted #cccccc;
      margin-bottom: 20px;
    }
    .module_com{

    }
  }
</style>
