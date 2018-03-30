<template>
  <el-container class="main_layout">
    <el-header>
      <header-component></header-component>
    </el-header>
    <el-container>
      <el-aside style="width:auto;">
        <aside-component></aside-component>
      </el-aside>
      <el-container>
          <el-main>
              <transition name="fade" mode="out-in">
                  <router-view></router-view>
              </transition>
          </el-main>
      </el-container>
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
  position: relative;
  height: 100%;
}
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