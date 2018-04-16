<template>
  <div class="module-list">
    <div class="bread_box">
      <Breadcrumb>
        <BreadcrumbItem to="/manage">首页</BreadcrumbItem>
        <BreadcrumbItem>自定义模块列表</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="content">
      <div class="">
        <Table :columns="columsModuleList" :data="moduleListData"></Table>
      </div>
      <Modal
        v-model="modalShow"
        title="修改模块"
        @on-ok="sureEditModuleHandler">
        <Form ref="moduleEditForm" :model="moduleEditForm" :rules="moduleEditRule" :label-width="80">
          <FormItem prop="name" label="模块名称">
            <Input type="text" v-model="moduleEditForm.name"></Input>
          </FormItem>
          <FormItem prop="sortIndex" label="模块等级" required>
            <InputNumber :max="10" :min="0" :step="1" v-model="moduleEditForm.sortIndex"></InputNumber>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
  import { getCustomModuleList, changeModuleStatus, changeModuleNameMark, editModule, deleteModule } from "../axios/getData";

  export default {
    name: "module-list",
    data(){
      return {
        modalShow: false,
        moduleEditForm: {
          name: '',
          sortIndex: 0
        },
        moduleEditRule: {
          name: [
            {required: true, message: '请输入模块名称', trigger: 'blur'}
          ]
        },
        editModuleId: '',
        columsModuleList: [
          {
            title: '模块名称',
            key: 'name',
            render: (h, params) => {
              return h('div', params.row.name.text)
            }
          },
          {
            title: '模块类型',
            key: 'moduleType',
            render: (h, params) => {
              let text = '';
              text = params.row.moduleType == '0' ? '列表类型' : '图片类型';
              return h('div', text)
            }
          },
          {
            title: '模块等级',
            key: 'sortIndex'
          },
          {
            title: '模块状态',
            key: 'status',
            width: '140',
            render: (h, params) => {
              return h('div', [
                h('Tag', {
                  props: {
                    size: 'small',
                    color: 'blue'
                  }
                }, params.row.status ? '显示' : '隐藏'),
                h('i-switch', {
                  props: {
                    value: params.row.status
                  },
                  on: {
                    'on-change': () => {
                      this.changeModuleStatusHandler(params.row._id);
                    }
                  }
                })
              ])
            }
          },
          {
            title: '是否显示模块名',
            key: 'nameMark',
            width: '140',
            render: (h, params) => {
              return h('div', [
                h('Tag', {
                  props: {
                    color: 'blue'
                  }
                },params.row.name.mark ? '显示' : '隐藏'),
                h('i-switch', {
                  props: {
                    value: params.row.name.mark
                  },
                  on: {
                    'on-change': () => {
                      this.changeModuleNameMarkHandler(params.row._id)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '编辑',
            key: 'action',
            width: '130',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: 'editModule', query: {id: params.row._id}});
                      // this.editModuleHandler(params.row);
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deleteModuleHandler(params.row._id);
                    }
                  }
                }, '删除')
              ])
            }
          },
        ],
        moduleListData: []
      }
    },
    methods: {
      init(){
        getCustomModuleList().then((response) => {
          if(!response.data.status){
            this.moduleListData = response.data.data;
          }
        }).catch((err) => {
          this.$Message.error(err)
        })
      },
      changeModuleStatusHandler(id){
        changeModuleStatus(id).then((response) => {
          if(!response.data.status){
            this.$Message.success('修改成功');
            this.init();
          }
        }).catch((err) => {
          this.$Message.error('修改失败');
        })
      },
      changeModuleNameMarkHandler(id){
        changeModuleNameMark(id).then((response) => {
          if(!response.data.status){
            this.$Message.success('修改成功');
            this.init();
          }
        }).catch((err) => {
          this.$Message.error('修改失败');
        })
      },
      editModuleHandler(module){
        this.modalShow = true;
        this.editModuleId = module._id;
        this.moduleEditForm.name = module.name.text;
        this.moduleEditForm.sortIndex = module.sortIndex;
      },
      sureEditModuleHandler(){
        this.$refs.moduleEditForm.validate((valid) => {
          if(valid){
            let id = this.editModuleId;
            let name = this.moduleEditForm.name;
            let sortIndex = this.moduleEditForm.sortIndex;
            editModule(id, name, sortIndex).then((response) => {
              if(!response.data.status){
                this.$Message.success('修改成功');
                this.init();
                this.$refs.moduleEditForm.resetFields();
              }
            }).catch((err) => {
              this.$Message.error('修改失败');
            })
          }
        })
      },
      deleteModuleHandler(id){
        deleteModule(id).then((response) => {
          if(!response.data.status){
            this.$Message.success('删除成功');
            this.init();
          }
        }).catch((err) => {
          this.$Message.error(err);
        })
      }
    },
    mounted(){
      this.init()
    }
  }
</script>

<style scoped>

</style>
