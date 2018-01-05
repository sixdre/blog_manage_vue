<template>
	<el-menu :router="true" background-color="#324157" class="el-menu-vertical-demo" :collapse="isCollapse" text-color="#fff" active-text-color="#ffd04b" style="height: 100%;" mode="vertical" :default-active="$route.path">
		<nav-item :routes="navList"></nav-item>
	</el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import navItem from './navItem.vue'
export default {
	components: { navItem },
	data(){
		return {
			isCollapse:false
		}
	},
	computed: {
		// 使用对象展开运算符将 getter 混入 computed 对象中
		...mapGetters([
			'navList'
		])
	}
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 202px;
	min-height: 400px;
}
</style>