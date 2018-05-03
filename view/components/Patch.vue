<template>
  <div>
    <div class="menubar">
      <Select placeholder="请选择App版本" style="width:200px" @on-change="handleAppVersionChanged">
        <Option v-for="item in appVersions" :value="item.id" :key="item.version+item.os">{{ item.os + ' | ' + item.version }}</Option>
      </Select>
      <Button v-show="!!this.currentAppVersion" type="primary" @click="handleAddPatch">新增补丁</Button>
    </div>
    <Table stripe :loading="loading" type='expand' :columns="versionColumns" :data="versions"></Table>
    <Page :total="totalNumber" show-sizer simple></Page>
    <Modal
    v-model="showAddVersion"
    @on-ok="confirmAddVersion"
    @on-cancel="cancelAddVersion">
      <i-form ref="versionForm" :model="versionForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="补丁文件" prop="patchFiles">
          <Upload
          :before-upload="handleUploadPatch"
          action="//jsonplaceholder.typicode.com/posts/"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <div v-if="patchFile !== null">上传文件: {{ patchFile.name }} <Button type="text" @click="uploadPatchFile" :loading="loadingPatchStatus">{{ loadingPatchStatus ? '上传中' : '点击上传' }}</Button></div>
        </FormItem>
        <FormItem label="补丁map" prop="patchMapFiles">
          <Upload
          :before-upload="handleUploadPatchMap"
          action="//jsonplaceholder.typicode.com/posts/"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <div v-if="patchMapFile !== null">上传文件: {{ patchMapFile.name }} <Button type="text" @click="uploadPatchMapFile" :loading="loadingPatchMapStatus">{{ loadingPatchMapStatus ? '上传中' : '点击上传' }}</Button></div>
        </FormItem>
        <FormItem label="渠道编号" prop="channels">
          <Select v-model="versionForm.channels" multiple style="width:260px">
              <Option v-for="item in channels" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="更新方式" prop="action">
          <Select v-model="versionForm.action" style="width:260px">
              <Option v-for="item in updateActions" :value="item.name" :key="item.name">{{ item.desc }}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本号" prop="version">
          <Input v-model="versionForm.version" placeholder="请输入版本号..."></Input>
        </FormItem>
        <FormItem label="版本描述" prop="intro">
          <Input v-model="versionForm.intro" placeholder="请输入版本描述..."></Input>
        </FormItem>
      </i-form>
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
  import config from '../config'
  import PatchExtend from 'components/PatchExtend'
  import { normalizeDate, uploadQiniuFile } from '../utils'

  export default {
    components: { PatchExtend },
    props: {
      loading: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        action: 'add',
        patchFile: null,
        patchMapFile: null,
        currentVersionId: '',
        currentAppVersion: '',
        showAddVersion: false,
        showDeleteModel: false,
        loadingPatchStatus: false,
        loadingPatchMapStatus: false,
        versionForm: {
          version: '',
          action: '',
          enable: false,
          intro: '',
          channels: [],
          patchFiles: [],
          patchMapFiles: []
        },
        ruleValidate: {
          version: [
            { required: true, message: '请输入版本号', trigger: 'blur' }
          ],
          action: [
            { required: true, message: '请选择更新方式', trigger: 'change' }
          ],
          intro: [
            { required: true, message: '请输入补丁描述', trigger: 'blur' }
          ],
          patchFiles: [
            { required: true, type: 'array', message: '请上传补丁文件', trigger: 'change' }
          ]
        },
        versionColumns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(PatchExtend, {
                props: {
                  patchItem: params.row
                }
              })
            }
          },
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
            title: '更新渠道',
            key: 'channels'
          },
          {
            title: '启用',
            key: 'enable',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.enable
                },
                on: {
                  'on-change': (value) => {
                    this.setupEnable(params.row.id, value)
                  }
                }
              })
            }
          },
          {
            title: '更新方式',
            key: 'action',
            render: (h, params) => {
              return h('span', {
              }, this.updateActions.find(it => it.name === params.row.action).desc)
            }
          },
          {
            title: '补丁文件',
            key: 'patchFiles',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDownloadFiles(params.row.patchFiles)
                  }
                }
              }, '下载')
            }
          },
          {
            title: '补丁map文件',
            key: 'patchMapFiles',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDownloadFiles(params.row.patchMapFiles)
                  }
                }
              }, '下载')
            }
          },
          {
            title: '操作',
            key: 'method',
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
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleEditVersion(params.row)
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ]
      }
    },
    computed: {
      appVersions () {
        return this.$store.state.application.list
      },
      versions () {
        return this.$store.state.patch.list
      },
      totalNumber () {
        return this.$store.state.patch.totalNumber
      },
      updateActions () {
        return this.$store.state.project.updateActions
      },
      channels () {
        return this.$store.state.project.channels
      },
      token: function () {
        return this.$store.state.misc.qiniuToken
      }
    },
    methods: {
      confirmAddVersion () {
        this.$refs.versionForm.validate(valid => {
          if (!valid) {
            return this.$Notice.warning({
              title: '温馨提示',
              desc: '参数错误'
            })
          }
          this.versionForm.appVersionId = this.currentAppVersion
          this.$Notice.info({
            title: '温馨提示',
            desc: '后台正在生成补丁文件, 请耐心等待...'
          })
          const action = this.action === 'add' ? 'patch/CREATE' : 'patch/UPDATE'
          this.$store.dispatch(action, {
            data: this.versionForm
          })
            .then(() => {
              this.patchFile = null
              this.patchMapFile = null
              this.$refs.versionForm.resetFields()
              return this.reloadList()
            })
        })
      },
      uploadFile (file, onDone) {
        uploadQiniuFile(this.token, this.currentAppVersion, file, (err, res) => {
          if (err) {
            return this.$Notice.error({
              title: '上传失败',
              desc: err.message
            })
          }
          this.$store.dispatch('misc/QINIU_MD5', {
            params: { key: res.key }
          })
            .then(key => {
              this.$Notice.success({
                title: '上传成功'
              })
              res.hash = key
              onDone(err, res)
            })
        })
      },
      uploadPatchFile () {
        this.loadingPatchStatus = true
        this.versionForm.version =
          this.patchFile.name.split('-')[1].split('.zip')[0]
        this.uploadFile(this.patchFile, (err, res) => {
          this.loadingPatchStatus = false
          if (!err && res) {
            this.versionForm.patchFiles[0] = res
          }
        })
      },
      uploadPatchMapFile () {
        this.loadingPatchMapStatus = true
        this.uploadFile(this.patchMapFile, (err, res) => {
          this.loadingPatchMapStatus = false
          if (!err && res) {
            this.versionForm.patchMapFiles[0] = res
            console.log(this.versionForm.patchMapFiles)
          }
        })
      },
      setupEnable (id, value) {
        this.$store.dispatch('patch/UPDATE', {
          data: {
            id,
            enable: value
          }
        })
      },
      handleUploadPatch (file) {
        this.patchFile = file
        return false
      },
      handleUploadPatchMap (file) {
        this.patchMapFile = file
        return false
      },
      handleAppVersionChanged (id) {
        this.currentAppVersion = id
        this.reloadList()
      },
      handleAddPatch () {
        this.action = 'add'
        this.showAddVersion = true
      },
      reloadList () {
        const params = { appVersionId: this.currentAppVersion }
        return this.$store.dispatch('patch/FETCH', {
          params
        })
      },
      handleDeleteVersion (version) {
        this.showDeleteModel = true
        this.currentVersionId = version.id
      },
      confirmDelete () {
        this.showDeleteModel = false
        this.$store.dispatch('patch/DELETE', {
          data: { id: this.currentVersionId }
        })
          .then(() => {
            return this.reloadList()
          })
      },
      handleDownloadFiles (files) {
        files.forEach(it => {
          window.open(config.qiniu.publicHost + '/' + it.key)
        })
      },
      handleEditVersion (item) {
        this.action = 'edit'
        this.showAddVersion = true
        Object.assign(this.versionForm, item)
      },
      cancelAddVersion () {
        this.patchFile = null
        this.patchMapFile = null
        this.showAddVersion = false
        this.$refs.versionForm.resetFields()
      }
    }
  }
</script>

<style scoped>
  @import '../styles/base.css';
</style>