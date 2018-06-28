<template>
    <el-row class="app-header">
        <div class="userinfo">
            <img class="user_avatar" :src="avatar"/>  
            <el-dropdown trigger="click">
                <span class="el-dropdown-link userinfo-inner"> 
                    <span class="username">{{username}}</span>
                     <i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <div class="user_dropdown">
                        <h5 class="username">{{username}}</h5>
                        <div><span class="txt_gray">上次登录：</span>{{userInfo.lastLoginTime|moment}}</div>
                        <div><span class="txt_gray">登录IP：</span>{{userInfo.loginIp}} </div>
                        <router-link class="btn btn-info btn-small" style="width:100%;margin-bottom:10px;margin-top:10px;" to="/password">修改密码</router-link>
                        <div>
                            <span class="btn btn-danger btn-plain btn-small" style="width:100%" @click="logout">退出登录</span>
                        </div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="logout" @click="logout">退出</span>
        </div>
    </el-row>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return {
           
        }
    },
	computed: {
		...mapGetters([
            'username',
            'avatar',
            'userInfo'
        ]),
    },
    created(){
        
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
@import url('../../assets/css/mixin.less');
.user_dropdown{
    min-width: 200px;
    padding: 10px 20px;
    .username{
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
        font-weight: bold;
    }
    &>div{
        margin-bottom: 5px;
    }
}
.logout{
    margin-left: 10px;
    color: #e75c5c;
    cursor: pointer;
}
.app-header{
    position: fixed;
    z-index: 9;
    top: -1px;
    right: 0;
    left: 210px;
    padding: 0 20px;
    background: @info_color;
    line-height: 70px;
    .logo{
        vertical-align: middle;
    }
    .userinfo {
        text-align: right;
        padding-right: 10px;
        float: right;
        .user_tag{
            margin-right: 20px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
        }
        .user_avatar{
            width: 46px;
            height: 46px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 20px;
            border: 1px solid #eee;
        }
        .userinfo-inner {
            cursor: pointer;
            color: #333;
        }
    }
}
</style>