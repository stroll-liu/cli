<script lang="ts" setup>
</script>

<template>
  <router-link :to="{ path: '/' }" >首页</router-link>
  &nbsp;&nbsp;&nbsp;
  <router-link :to="{ path: '/overview' }" >概览</router-link>
  <router-view></router-view>
</template>
