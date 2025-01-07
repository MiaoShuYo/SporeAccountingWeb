<script setup lang="ts">
import Login from '../components/login/Login.vue'
import Register from '../components/login/Register.vue'
import {type Component, ref} from 'vue'
const currentComponent:Component = ref(Login)


const toggleComponent = () => {
  currentComponent.value = currentComponent.value !==Login ? Register : Login;
}

</script>

<template>
  <div class="container">
    <div class="image-section">
      <img src="../assets/login.svg" class="image" alt="Login Image">
    </div>
    <div class="section">
      <div class="border">
        <component :is="currentComponent" @switch="toggleComponent" />
      </div>
    </div>
  </div>
  <footer class="footer">
    <p>© 2025 MiaoShu Studio. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.image {
  width: 70%;
  max-width: 100%;
  max-height: 100%;
}
.section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 451.5px;
}
.border {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  width: 40%;
  min-height: 45%;
  height: auto;
}
.footer {
  text-align: center;
  padding-bottom: 35px;
  width: 100%;
  position: absolute;
  bottom: 0;
}
@media (max-width: 903px) {
  .section {
    min-width: 100%;
  }
  .image-section {
    display: none;
  }
}
</style>