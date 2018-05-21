<template>
	<div id="content" class="prehome old_style">
		<div class="clear">
			<div style="color:#0092ff;text-shadow:0 -1px 1px #B5B5B5; margin-left:100px;float:left;">
				<div style="font-size: 200px;">404</div>
				<div style="font-size: 50px;">Not Found</div>
			</div>
			<img style="float:left;margin: 100px 0 0 40px;" :src="imgSrc">
		</div>
		<div style="margin-top:64px;font-size:26px;text-align:center;">
			<router-link style="color:rgb(0, 146, 255);text-decoration: underline;text-shadow:0 -1px 1px #B5B5B5;" to="/" >回首页</router-link>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			imgSrc:require('../../assets/images/404_island.png')
		}
	},
}
</script>

<style lang="less" scoped>
#content {
	width: 100%;
	min-height: 600px;
	border-radius: 5px;
	color: #525252;
	padding: 0 0 50px;
	padding-top: 85px;
	&.prehome {
		background: none;
		border: 0;
		box-shadow: none;
	}
	&.old_style {
		width: 980px;
		margin: 0 auto;
	}
}

</style>