<template>
  <div id="app">
    <Navigation></Navigation>
    <transition name="fade" mode="out-in" :duration="100">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
  import Navigation from 'components/Navigation'

  export default {
    components: { Navigation },
    data: function () {
      return { loading: true }
    },
    created: function () {
      this.loading = false
    }
  }
</script>

<style>

.content {
  width: 80%;
  margin: 0 auto;
}

.content-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}
  
</style>
