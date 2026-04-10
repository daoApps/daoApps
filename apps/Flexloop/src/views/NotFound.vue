<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 404 错误页面
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.not-found h1 {
  font-size: 8rem;
  color: #6366f1;
  margin: 0;
}

.not-found p {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 1rem 0 2rem;
}
</style>
