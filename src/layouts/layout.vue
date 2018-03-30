<template>
  <el-container>
    <el-header>
      <header-component></header-component>
    </el-header>
    <el-container>
      <el-aside style="width:auto;">
        <aside-component></aside-component>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import headerComponent from '@/components/header'
import asideComponent from '@/components/aside'
export default {
  components: {
    headerComponent,
    asideComponent
  },


}
</script>

<style>
.el-header,
.el-footer {
  background-color: #242f42;
  line-height: 60px;
}

.el-main {
  background-color: #fff;
  color: #333;
  padding: 10px;
}
</style>