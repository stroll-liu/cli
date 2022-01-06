<template>
  <p>次数 <span :class="{ countStyle: count }">{{count}}</span></p>
  <h1 class="red">overview</h1>
  <n-button @click="ClickOn" >接口</n-button>
</template>

<script setup>
import {
  ref, getCurrentInstance
} from 'vue'
const { proxy, appContext } = getCurrentInstance()

const count = ref(0)
const { query: ApiQuery } = appContext.config.globalProperties.$api

function ClickOn () {
  count.value++
  ApiQuery.alert1().then(() => {
    alert(count.value)
  })
}
</script>

<style scoped lang="stylus">
.red
  color: red
.countStyle
  color: #409eff
  font-size: 20px
</style>
