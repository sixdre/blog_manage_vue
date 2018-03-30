<template>
    <el-row class="app-header">
        <router-link to="/" style="color:#fff;">
            1111
        </router-link>
        <div class="userinfo">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link userinfo-inner"> 
                    <img :src="avatar"/> {{username}} 
                     <i class="el-icon-caret-bottom" style="color:#fff"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="header_time">
            {{moment().format('LL')}} 周{{ moment().format('dddd').substring(2)}}
        </div>
    </el-row>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex';
moment.locale('zh-cn');
export default {
    data(){
        return {
            moment:moment,
        }
    },
	computed: {
		// 使用对象展开运算符将 getter 混入 computed 对象中
		...mapGetters([
            'username',
            'avatar'
        ]),
    },

    methods:{
        logout(){
            this.$confirm('确定退出吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.$store.dispatch('user/logout').then(()=>{
                    this.$router.push('login')
                })
			}).catch(() => {

			});
        }
    }
}
</script>

<style lang="less" scoped>
.app-header{
    margin: 0 -20px;
    padding: 0 20px;
    background: #242f42;
    line-height: 60px;
    .logo{
        vertical-align: middle;
    }
    .userinfo {
        text-align: right;
        padding-right: 10px;
        float: right;
        .userinfo-inner {
            cursor: pointer;
            color:#fff;
            img {
                width: 40px;
                height: 40px;
                border-radius: 20px;
                vertical-align: middle;
            }
        }
    }
    .header_time{
        float: right;
        margin-right: 40px;
        color: #fff;
        font-size: 13px;
    }
}
</style>