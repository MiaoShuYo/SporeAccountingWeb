<script setup lang="ts">
import {ref,defineEmits} from "vue";
const emit = defineEmits(['switch']);
const loginData = ref({
  username: '',
  password: ''
});
const login = () => {
  console.log('Login');
}
const toRegister = () => {
  emit('switch',"register");
}
const toRetrievePassword=()=>{
  emit('switch',"retrievePassword")
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
      <el-form-item>
        <el-button type="primary" style="width: 100%;height:40px;line-height: 40px " @click="login">登录</el-button>
        <el-link :underline="false" style="text-align: left; width: 50%;display: block;margin-top: 10px;" type="primary" v-on:click="toRetrievePassword">忘记密码</el-link>
        <el-link :underline="false" style="text-align: right; width: 50%;display: block;margin-top: 10px" type="primary"  v-on:click="toRegister">注册</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 35px;
}
:deep(.el-form-item__label){
  font-size: 16px;
}
</style>