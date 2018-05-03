<template>
  <div>
    <div class="content">
      <p class="content-title">{{ profile.name }}</p>
      <span class="project-intro">{{ profile.intro }}</span>      
      <Tabs value="app-version" @on-click="handleTabChanged">
        <TabPane label="应用版本" name="app-version">
          <Application :loading="loading" :projectId="projectId"></Application>
        </TabPane>
        <TabPane label="补丁版本" name="patch-version">
          <Patch :loading="loading" :projectId="projectId"></Patch>
        </TabPane>
        <TabPane label="数据统计" name="statistics">
          <Statistics :loading="loading" :projectId="projectId"></Statistics>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import Patch from 'components/Patch'
  import Application from 'components/Application'
  import Statistics from 'components/Statistics'

  export default {
    components: { Application, Patch, Statistics },
    computed: {
      profile: function () {
        return this.$store.state.project.currentProject
      },
      projectId: function () {
        return this.$route.params.id
      }
    },
    data () {
      return {
        loading: false,
        currentTab: 'app-version'
      }
    },
    methods: {
      handleTabChanged: function (name) {
        this.currentTab = name
      }
    },
    asyncData: function ({ store, route }) {
      return Promise.all([
        store.dispatch('project/FIND_CHANNELS'),
        store.dispatch('project/FIND_ONE', {
          data: { id: route.params.id }
        }),
        store.dispatch('misc/QINIU_TOKEN')
      ])
    }
  }
</script>


<style scoped>

.content .project-intro {
  font-size: 14px;
}

.content .project-tip {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

</style>