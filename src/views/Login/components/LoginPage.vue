<template>
  <div class="login-wrapper">
    <el-tabs v-model="activeName" class="tabs">
      <!-- 登录项(优先显示) -->
      <el-tab-pane label="登录" name="login">
        <div class="user-mes">
          <el-form :model="loginMessage" size="large" status-icon :rules="rules" ref="loginMessage" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input v-model="loginMessage.username" placeholder="请输入账号" autocomplete="off" @focus="inputHandleClick"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginMessage.password" placeholder="请输入密码" show-password autocomplete="off" @focus="inputHandleClick"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button" @click="submitLoginForm('loginMessage')">登录</el-button>
            </el-form-item>
          </el-form>
          <p class="errorWarn" v-show="showWarn">*你输入的账号或密码有误，请重新输入！</p>
          <p class="login-tips">还未有账号？请先注册。</p>
        </div>
      </el-tab-pane>
      <!-- 注册项 -->
      <el-tab-pane label="注册" name="register">
        <div class="user-mes">
          <el-form :model="regiMessage" status-icon size="large" :rules="rules" ref="regiMessage" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input show-word-limit class="input-mes" v-model="regiMessage.username" placeholder="请输入账号" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" v-model="regiMessage.password" show-password autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" class="button" @click="submitRegiForm('regiMessage')">注册</el-button>
            </el-form-item>
          </el-form>
          <p class="login-tips">请输入6-15字符的账号和密码。<br/>期待你的加入！</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { postRegUser, postLogUser } from '@/api/demo';

export default {
  name: 'LoginPage',
  data() {
    return {
      // 有相关登录/注册选择的data
      showWarn: false,
      // 有关账号密码提交的data
      loginMessage: {
        username: '',
        password: ''
      },
      regiMessage: {
        username: '',
        password: ''
      },
      // 规则
      rules: {
        username: [
          {
            required: true, message: '别忘记输入账号呀！', trigger: 'blur'
          },
          {
            min: 3, max: 10, message: '账号应为 3 到 10 个字符呀！', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '别忘记输入密码呀！', trigger: 'blur'
          },
          {
            min: 6, max: 15, message: '密码应为 6 到 15 个字符呀！', trigger: 'blur'
          }
        ]
      },
      // 要设置初始值为login才能刷新时立即显示login输入框部分
      activeName: 'login'
    };
  },
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    ...mapMutations(['changeLoginStatus', 'saveId']),
    // 登录 信息提交,并判断是否存在对应账号
    submitLoginForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await postLogUser(this.loginMessage);
          if (res.ret === 0) {
            // 将登录用户信息和id保存到store,但刷新页面后id会变为String类型
            this.saveId(res.userid);
            this.changeLoginStatus(this.loginMessage);
            this.$message('欢迎来到轻足迹！');
            this.$router.push('/mapTrack');
          } else if (res.ret === 1) { this.$message('密码错误或该账号未注册，请重新输入！'); }
        } else {
          return false;
        }
      });
    },
    submitRegiForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await postRegUser(this.regiMessage);
          if (res.ret === 0) {
            this.$message('注册成功，欢迎登陆！');
            this.activeName = 'login';
          } else if (res.ret === 1) { this.$message('账号已存在，请重新输入账号！'); }
        } else {
          return false;
        }
      });
    },
    inputHandleClick() {
      this.showWarn = false;
    },
  }
};
</script>

<style lang="scss">
//修改tab中的label标签
//需要在无scoped限制的style中设置，且需要父级选择器加持优先级
.login-wrapper #tab-register,#tab-login {
  font-size: 16px;
}
</style>
<style lang="scss">
@import '@/theme/variable.scss';
.login-wrapper {
  height: 450px;
  width: 380px;
  background-color: $--background-color-base;
  margin: 100px auto 0;
  border: 1px solid rgb(221, 218, 218);
  border-radius: 5px;
}
.tabs {
  margin: 30px 50px;
}
// 登录页提示
.login-tips {
  font-size: 13px;
  color: $--color-info;
  text-decoration: underline;
  margin-top: 50px;
}
.user-mes {
  width: 280px;
  margin: 0 auto;
  margin-top: 10px;
}
//提交按钮样式
.button {
  width: 100%;
  height: 50px;
  margin: 30px auto 0;
  font-size: 16px;
}
.errorWarn {
  font-size: 12px;
  color: $--color-danger;
}
</style>
