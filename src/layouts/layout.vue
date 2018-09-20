<template>
  <el-container class="main_layout">
    <el-aside width="210px">
      <aside-component></aside-component>
    </el-aside>
    <el-container>
      <el-header>
        <header-component></header-component>
      </el-header>
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
.main_layout{
  position: absolute;
  height: 100%;
  width: 100%;
}
.el-header,
.el-footer {
  background-color: #fff;
  height: 70px !important;
}
.el-aside{
  overflow: visible;
}
.el-main {
  background-color: #fff;
  color: #333;
  padding:10px 30px;
}

</style>