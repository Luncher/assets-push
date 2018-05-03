<template>
  <div class="content">
    <p class="content-title">项目列表</p>
    <div class="project-action">
      <Button type="primary" @click="showAddProjectDialog = true">创建项目</Button>
    </div>
    <Table stripe @on-row-click="handleProjectClicked" :columns="projectListColumns" :data="projectList"></Table>
    <Page :total="totalNumber" show-sizer simple></Page>
    <Modal
    v-model="showAddProjectDialog"
    @on-ok="confirmAddProject"
    @on-cancel="cancelAddProject">
      <Form ref="projectForm" :model="projectForm" :rules="projectFormRules" :label-width="80">
        <FormItem label="项目名称" prop="name">
          <Input v-model="projectForm.name" placeholder="请输入项目名称..."></Input>
        </FormItem>
        <FormItem label="项目描述" prop="intro">
          <Input v-model="projectForm.intro" placeholder="请输入项目描述..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal 
    v-model="showDeleteModel" 
    title="确定删除该版本信息?" 
    @on-ok="confirmDeleteProject"
    @on-cancel="showDeleteModel = false">
      <p>删除之后信息不可恢复</p>
    </Modal>
  </div>
</template>

<script>
  import { normalizeDate } from '../utils'

  export default {
    data () {
      return {
        deleteProjectId: '',
        showDeleteModel: false,
        showAddProjectDialog: false,
        projectForm: {
          name: '',
          intro: ''
        },
        projectFormRules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请输入项目描述', trigger: 'blur' }
          ]
        },
        projectListColumns: [
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '项目描述',
            key: 'intro'
          },
          {
            title: '创建时间',
            key: 'createdAt',
            render: (h, params) => {
              return h('span', {
              }, normalizeDate(params.row.createdAt))
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'click': (event) => {
                      event.stopPropagation()
                      this.handleDeleteProjectClicked(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    methods: {
      confirmAddProject: function () {
        this.$refs.projectForm.validate(valid => {
          if (!valid) {
            return this.$Notice.warning({
              title: '温馨提示',
              desc: '参数错误'
            })
          }
          return this.$store.dispatch('project/CREATE', {
            messageDefault: '创建失败',
            data: this.projectForm
          })
            .then(() => {
              this.$refs.projectForm.resetFields()
              return this.loadList()
            })
        })
      },
      cancelAddProject: function () {
        this.showAddProjectDialog = false
        this.$refs.projectForm.resetFields()
      },
      loadList: function () {
        return this.$store.dispatch('project/FETCH')
      },
      handleDeleteProjectClicked: function (project) {
        this.showDeleteModel = true
        this.deleteProjectId = project.id
      },
      confirmDeleteProject: function () {
        return this.$store.dispatch('project/DELETE', {
          data: { id: this.deleteProjectId }
        })
          .then(() => {
            return this.loadList()
          })
      },
      handleProjectClicked: function (project) {
        return this.$store.dispatch('project/SETUP', project)
          .then(() => {
            this.$router.push('/projects/' + project.id)
          })
      }
    },
    computed: {
      projectList: function () {
        return this.$store.state.project.list
      },
      totalNumber: function () {
        return this.$store.state.project.totalNumber
      }
    },
    asyncData: function ({ store }) {
      return store.dispatch('project/FETCH')
    }
  }
</script>

<style scoped>

.project-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 10px;
}

</style>

