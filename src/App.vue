<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app'
	}
</script>

<style lang="less">
	@import './assets/css/common.less';

	#app {
		position: relative;
		width: 100%;
		height: auto;
		min-height: 100%;
		background-color: #f1f1f1;
		
	}
</style>