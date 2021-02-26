<template>
  <div class="login">
    <div class="login-con">
      <Card class="login-card" title="欢迎登录" :bordered="false">
        <Form ref="loginForm" :model="loginForm" :rules="loginRule">
          <FormItem prop="username" :style="{paddingTop: '10px'}">
            <Input prefix="ios-person-outline" v-model="loginForm.username" placeholder="请输入用户名" />
          </FormItem>
          <FormItem prop="password">
            <Input type="password" prefix="ios-lock-outline" v-model="loginForm.password" placeholder="请输入密码" />
          </FormItem>
          <FormItem prop="code">
            <Input prefix="ios-image-outline" v-model="loginForm.code" placeholder="请输入验证码" maxlength="6" />
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="handleSubmit('loginForm')">登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRule: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.handleLogin(this.loginForm).then(res => {
            this.getUserInfo().then(res => {
              this.$router.push({
                name: this.$config.homeName
              })
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  background-image: url('../../assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;

    .login-card {
    }
  }
}
</style>
