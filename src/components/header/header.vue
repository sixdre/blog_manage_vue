<template>
    <el-row class="app-header">
        <span style="color:#fff;">{{date}}</span>
        <el-col :span="4" class="userinfo">
            <el-dropdown trigger="hover">
                <span class="el-dropdown-link userinfo-inner"><img :src="avatar"/> {{username}} </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>{{role}}</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment'
export default {
    data(){
        return {
           date:null
        }
    },
	computed: {
		// 使用对象展开运算符将 getter 混入 computed 对象中
		...mapGetters([
            'role',
            'username',
            'avatar'
        ]),
        
        // avatar(){
        //     // return '../../../static/avatar.jpeg'
        //     return this.$store.state.user.avatar
        // }
    },
    created(){
        setInterval(()=>{
            this.date = moment().format('YYYY-MM-DD HH:mm:ss');
        },1000)    
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
.userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
    .userinfo-inner {
        cursor: pointer;
        color:#fff;
        img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
        }
    }
}
</style>