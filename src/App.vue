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
	@import './style/common';

	#app {
		position: relative;
		width: 100%;
		height: auto;
		min-height: 100%;
		display: flex;
	}
</style>