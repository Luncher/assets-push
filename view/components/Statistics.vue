<template>
  <div>
    <div class="menubar">
      <Select placeholder="请选择App版本" style="width:200px" @on-change="handleAppVersionChanged">
        <Option v-for="item in appVersions" :value="item.id" :key="item.version+item.os">{{ item.os + ' | ' + item.version }}</Option>
      </Select>
    </div>
    <Table stripe :columns="columns" :data="patchStatistics"></Table>
    <Page :total="totalNumber" show-sizer simple></Page>
  </div>
</template>

<script>
  export default {
    props: {
      projectId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        appVersion: '',
        columns: [
          {
            title: '补丁版本',
            key: 'patchVersion'
          },
          {
            title: '下载量',
            key: 'downloadCount'
          },
          {
            title: '完成量',
            key: 'downloadComplete'
          },
          {
            title: '成功率',
            key: 'successRate',
            render: (h, params) => {
              return h('span', {}, (params.row.successRate * 100).toFixed(0) + '%')
            }
          }
        ]
      }
    },
    computed: {
      appVersions () {
        return this.$store.state.application.list
      },
      totalNumber () {
        return this.$store.state.statistics.patchStatistics.totalNumber
      },
      patchStatistics () {
        return this.$store.state.statistics.patchStatistics.list
      }
    },
    methods: {
      handleAppVersionChanged: function (id) {
        this.appVersion = this.appVersions.find(it => it.id === id)
        this.loadPatchStatistics()
      },
      loadPatchStatistics: function () {
        return this.$store.dispatch('statistics/FETCH', {
          params: {
            os: this.appVersion.os,
            projectId: this.projectId,
            appVersion: this.appVersion.version
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import '../styles/base.css';
</style>