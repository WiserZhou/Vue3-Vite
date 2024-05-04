<template>
  <div class="wholeWrapper">
    <img src="../assets/loginBcg.png" alt="图片走丢啦~~">
    <div class="loginBox">
      <h3>培训管理系统</h3>
      <div class="userStyle">
        <span>* 用&nbsp;户&nbsp;名</span>
        <el-input v-model="username" style="width: 240px" placeholder="请输入员工用户名"/>
      </div>
      <div class="passwordStyle">
        <span>* 密&nbsp;&nbsp;&nbsp;&nbsp;码</span>
        <el-input
            v-model="password"
            style="width: 240px"
            type="password"
            placeholder="请输入密码"
            show-password
        />
      </div>
      <div class="btns">
        <el-button type="primary" round @click="loginIn()">登录</el-button>
        <el-button type="info" round>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {ref} from 'vue';
import baseAxios from '@/api/baseAxios';
import {ElMessage} from 'element-plus';

const router = useRouter();
const username = ref("");
const password = ref("");

function loginIn() {
  baseAxios({
    url: "/login",
    method: "post",
    data: {
      username: username.value,
      password: password.value
    }
  }).then(res => {
    console.log(res.data);
    if (res.data.code) {
      localStorage.setItem("token", res.data.data);
      ElMessage({
        message: '登录成功！',
        type: 'success',
      })
      router.push('/classManage');
    } else {
      ElMessage.error(res.data.msg);
    }
  })
}
</script>

<style scoped>
.wholeWrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

h3 {
  font: 400 40px 'Microsoft YaHei';
}

.loginBox {
  display: flex;
  width: 520px;
  height: 400px;
  background-color: rgba(128, 255, 255, 0.117647058823529);
  border: 1px solid rgba(215, 215, 215, 1);
  border-radius: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.5);
}

.loginBox div {
  margin: 10px;
}

.btns {
  display: flex;
  width: 420px;
  justify-content: space-around;
}
</style>