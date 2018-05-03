<template>
  <Layout class="layout">
    <Header>
      <Row type="flex" justify="space-between">
        <Col span="2">
          <img style="position: absolute;top: 50%;transform: translateY(-50%);" src="/images/logo.png" @click="handleLogoClicked"/>
        </Col>
        <Col span="2" v-show="isSignin">
          <Dropdown @on-click="handleMenuClicked">
            <Avatar shape="square" :src="user.avatar"></Avatar>
            <DropdownMenu slot="list">
              <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  </Layout>
</template>

<script>
  export default {
    data: () => {
      return {}
    },
    computed: {
      isSignin: function () {
        return this.$store.getters['user/isSignin']
      },
      user () {
        return this.$store.state.user
      }
    },
    methods: {
      handleMenuClicked: function (name) {
        this.$store.dispatch('user/SIGN_OUT')
          .then(() => {
            this.$router.push('/signin')
          })
      },
      handleLogoClicked: function () {
        this.$router.push(this.isSignin ? '/projects' : '/signin')
      }
    },
    mounted: function () {
      return this.$store.dispatch('user/USER_INFO')
    }
  }
</script>

<style>

</style>