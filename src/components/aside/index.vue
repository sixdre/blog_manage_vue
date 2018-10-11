<template>
	<div class="app-aside bg-dark">
		<div class="logo_div">
			<router-link class="title" to="/">后台管理系统</router-link>
		</div>
		<el-menu class="app_menu" 
			:router="true"  
			active-text-color="#28b779"
			mode="vertical" 
			:default-active="$route.path">
			<template v-for="(item,index) in navList">
				<el-submenu :index="item.name" v-if="item.child&&item.child.length>0" :key="index" :show-timeout="0" :hide-timeout="0">
					<template slot="title">
						<i v-if='item.icon' :class="item.icon"></i>
						<span slot="title">{{item.name}} </span>
					</template>
					<el-menu-item v-for="(child,index) in item.child" v-if="!child.hidden" :key="index" :index="child.path">
						<template slot="title">
							<router-link :to="child.path" style="color:#666;">
								<i v-if='child.icon' :class="child.icon"></i>
								{{child.name}}
							</router-link>
						</template>
					</el-menu-item>
				</el-submenu>
				<el-menu-item v-if="!item.child||!item.child.length" :key="index" :index="item.path">
					<template slot="title">
						<router-link :to="item.path" >
							<i v-if='item.icon' :class="item.icon"></i>
							{{ item.name}}
						</router-link>
					</template>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
	
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data(){
        return {
			
        }
	},
	computed: {
		...mapGetters([
            'navList'
        ]),
	},
	methods: {
		
	}
}
</script>

<style lang="less">
@import url('../../assets/css/mixin.less');
.app-aside{
	  max-width: 212px !important;
	  height: 100%;
  	.logo_div{
		height: 70px;
		line-height: 70px;
		position: fixed;
		top: 0;
		left: 0;
		width: 210px;
		z-index: 2;
		background-color: inherit;
		.logo{
			width: 32px;
			height: auto;
			vertical-align: middle;
			margin-right:15px;
		}
		.title{
			color: #fff;
			font-size: 20px;
			font-weight: bold;
			text-align: center;
			display: block;
		}
	}
	.app_menu{
		height: 100%;
		padding-top: 70px;
		// box-shadow: 2px 0 5px rgba(0,0,0,0.1);
		overflow-y: scroll;
		padding-top: 70px;
		background-color: inherit;
		.el-menu-item{
			color: #999 !important; 
			font-size: 16px;
			&.is-active{
				background-color:#f7fcfa !important;
				color: @info_color !important;
				border-left: 4px solid @info_color;
			}
			&>a{
				color: #999 !important; 
				font-size: 16px;
			}
		}
		.el-menu{
			background: transparent;
			.el-menu-item{
				&.is-active{
					border-left: 0;
				}
				&>a{
					font-size: 14px;
				}
			}
		}
		.el-submenu__title{
			span{
				color: #999; 
			}
			font-size: 16px;
		}
		.el-submenu{
			.el-menu-item{
				font-size: 14px;
			}
			&.is-active{
				.el-submenu__title{
					background-color: #3eacff;
					&>span{
						color: #fff !important;
					}
				}
				&>ul{
					li{
						background-color: #2b2e33 !important;
					}
				}
			}
			&>ul{
				li{
					a.active{
						color: #fff !important;
					}
				}
			}
		}
	}
}

	
</style>

