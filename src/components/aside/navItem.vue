<template>
	<div>
		<div v-for="(item,index) in routes" :key="index">
			<el-submenu :index="item.name" v-if="item.child&&item.child.length>0">
				<template v-if="!item.hidden">
					<template slot="title">
						<i v-if='item.icon' :class="item.icon"></i>
						<span slot="title">{{item.name}} </span>
					</template>
					<div v-for="(child,index) in item.child" :key="index" v-if='!child.hidden'>
						<nav-item class='nest-menu' v-if='child.child&&child.child.length>0'  :routes='[child]'> </nav-item>
						<router-link v-else :to="child.path">
							<el-menu-item :index="child.path">
								<template slot="title"><i v-if='child.icon' :class="child.icon"></i>{{child.name}} </template>
							</el-menu-item>
						</router-link>
					</div>
				</template>
			</el-submenu>

			<router-link v-else :to="item.path">
				<template v-if="!item.hidden">
					<el-menu-item :index="item.path">
						<template slot="title"><i v-if='item.icon' :class="item.icon"></i>{{ item.name}} </template>
					</el-menu-item>
				</template>
			</router-link>
		</div>
		<!-- <el-submenu index="3">
			<template slot="title"> <i class="el-icon-message"></i>导航 </template>
			<el-menu-item index="/article/publish">下拉一</el-menu-item>
			<el-menu-item index="/article/list">下拉二</el-menu-item>
		</el-submenu>
		<el-menu-item index="2">
			<i class="el-icon-menu"></i>
			<span slot="title">导航二{{navList}}</span>
		</el-menu-item> -->
	</div>
</template>

<script>

export default {
	name: 'navItem',
	props: {
		routes: {
			type: Array
		}
	}
}
</script>

<style>

</style>