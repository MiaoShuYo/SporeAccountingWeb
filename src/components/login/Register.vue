<script setup lang="ts">
import {ref,defineEmits} from "vue";
const emit = defineEmits(['switch']);
const loginData = ref({
  username: '',
  password: '',
  rePassword: ''
});
const register = () => {
  console.log('Login');
}
const toLogin = () => {
  emit('switch');
}
</script>
<template>
  <div style="padding-top:10% ">
    <div style="text-align: center">
      <img src="../../assets/logo.png" style="width:200px;height: 49px; max-height: 100%;" alt="Login Image">
    </div>
    <el-form :model="loginData" label-position="top">
      <el-form-item label="用户名" >
        <el-input style="height:40px;line-height: 40px " v-model="loginData.username"
                  placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input style="height:40px;line-height: 40px " v-model="loginData.password" type="password"
                  placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input style="height:40px;line-height: 40px " v-model="loginData.rePassword" type="password"
                  placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input style="height:40px;line-height: 40px " v-model="loginData.rePassword" type="password"
                  placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input style="height:40px;line-height: 40px " v-model="loginData.rePassword" type="text"
                  placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%;height:40px;line-height: 40px " @click="register">注册</el-button>
        <label>已有账号？</label><el-link :underline="false" type="primary"  v-on:click="toLogin">去登录</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>