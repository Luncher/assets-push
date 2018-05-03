<template>
  <div>
    <p>增量补丁更新包: </p>
    <Table :columns="tableColumns" :data="patchList"></Table>
  </div>
</template>

<script>
  import config from '../config'

  export default {
    data () {
      return {
        tableColumns: [
          {
            title: '版本号',
            key: 'version'
          },
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '资源hash',
            key: 'hash'
          },
          {
            title: '操作',
            key: 'method',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDownload(params.row)
                    }
                  }
                }, '下载')
              ])
            }
          }
        ]
      }
    },
    computed: {
      patchList: function () {
        const patchFiles = this.patchItem.diffPatchFiles
        return Object.keys(patchFiles).map(it => {
          return {
            version: it,
            name: patchFiles[it].key,
            hash: patchFiles[it].hash
          }
        })
      }
    },
    props: {
      patchItem: {
        type: Object
      }
    },
    methods: {
      handleDownload: function (it) {
        window.open(config.qiniu.publicHost + '/' + it.name)
      }
    }
  }
</script>

<style scoped>
  
</style>