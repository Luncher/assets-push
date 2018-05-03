<template>
  <div>
    <div class="menubar">
      <Button type="primary" @click="showAddVersion = true">新增版本</Button>
    </div>
    <Table stripe :loading="loading" :columns="versionColumns" :data="versions"></Table>
    <Page :total="totalNumber" show-sizer simple></Page>
    <Modal
    v-model="showAddVersion"
    @on-ok="confirmAddVersion"
    @on-cancel="cancelAddVersion">
      <Form ref="versionForm" :model="versionForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="平台号" prop="os">
          <Select v-model="versionForm.os" style="width:260px">
              <Option v-for="item in platforms" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本号" prop="version">
          <Input v-model="versionForm.version" placeholder="请输入版本号..."></Input>
        </FormItem>
        <FormItem label="版本描述" prop="intro">
          <Input v-model="versionForm.intro" placeholder="请输入版本描述..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
    v-model="showDeleteModel" 
    title="确定删除该版本信息?" 
    @on-ok="confirmDelete"
    @on-cancel="showDeleteModel = false">
      <p>删除之后版本信息不可恢复</p>
    </Modal>
  </div>
</template>

<script>
  import { normalizeDate } from '../utils'
  export default {
    props: {
      projectId: {
        type: String,
        required: true
      },
      loading: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        showAddVersion: false,
        showDeleteModel: false,
        currentVersionId: '',
        versionForm: {
          version: '',
          intro: '',
          os: ''
        },
        ruleValidate: {
          version: [
            { required: true, message: '请输入版本号', trigger: 'blur' }
          ],
          intro: [
            { required: true, type: 'string', message: '请输入项目描述', trigger: 'blur' }
          ],
          os: [
            { required: true, message: '请选择系统类型', trigger: 'change' }
          ]
        },
        versionColumns: [
          {
            title: '版本号',
            key: 'version'
          },
          {
            title: '版本描述',
            key: 'intro'
          },
          {
            title: '更新时间',
            key: 'updatedAt',
            render: (h, params) => {
              return h('span', {
              }, normalizeDate(params.row.updatedAt))
            }
          },
          {
            title: '平台',
            key: 'os'
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
                  on: {
                    click: () => {
                      this.handleDeleteVersion(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    computed: {
      versions: function () {
        return this.$store.state.application.list
      },
      totalNumber: function () {
        return this.$store.state.application.totalNumber
      },
      platforms: function () {
        return this.$store.state.project.platforms
      }
    },
    methods: {
      confirmAddVersion: function () {
        this.$refs.versionForm.validate(valid => {
          if (!valid) {
            return this.$Notice.warning({
              title: '温馨提示',
              desc: '参数错误'
            })
          }
        })
        this.versionForm.projectId = this.projectId
        this.$store.dispatch('application/CREATE', {
          data: this.versionForm
        })
          .then(() => {
            this.$refs.versionForm.resetFields()
            return this.reloadList()
          })
      },
      handleDeleteVersion: function (version) {
        this.showDeleteModel = true
        this.currentVersionId = version.id
      },
      confirmDelete: function () {
        this.showDeleteModel = false
        this.$store.dispatch('application/DELETE', {
          data: { id: this.currentVersionId }
        })
          .then(() => {
            return this.reloadList()
          })
      },
      reloadList: function () {
        return this.$store.dispatch('application/FETCH', {
          params: {
            projectId: this.projectId
          }
        })
      },
      cancelAddVersion: function () {
        this.showAddVersion = false
        this.$refs.versionForm.resetFields()
      }
    },
    mounted: function () {
      return this.reloadList()
    }
  }
</script>

<style scoped>
  @import '../styles/base.css';
</style>