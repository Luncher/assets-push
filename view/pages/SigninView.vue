<template>
  <div>
    <div class="content">
      <div class="login-content">
        <Input class="login-content-input" v-model="username" placeholder="用户名"></Input>
        <Input class="login-content-input" type="password" v-model="password" placeholder="密码"></Input>
        <Button class="login-button" @click="handleSignin">登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default {
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSignin: function () {
      this.$store.dispatch('user/SIGN_IN', {
        messageUnless: ['用户不存在'],
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then((res) => {
          // const body = res.data
          cookies.set('isLogin', true)
          this.$router.push('/projects')
        })
        .catch(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style scoped>
.login-content {
  height: 260px;
  width: 280px;
  top: 180px;
  right: 220px;
  background: #698AAE;
  position: absolute;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 3px;
}

.login-content-input {
  width: 80%;
}

.login-button {
  width: 80%;
  height: 40px;
  font-size: 16px;
  font-weight:bold;
  border-radius: 5px;  
}
</style>