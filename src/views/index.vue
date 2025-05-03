<template>
  <div>
    后台首页
    {{ store.username }}
  </div>
</template>

<script setup>
import { appStore } from '~/store/'

const store = appStore();

</script>

<style scoped>

</style>