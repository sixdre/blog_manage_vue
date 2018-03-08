<template>
    <div class="login-page">
        <div class="login_block">
           <div class="logo_title">
                <div class="title_group">
                    <h1>后台管理系统</h1>
                </div>
            </div>
            <div class="login_body">
                <div class="login_tu">
                    <img src="../../../static/images/login_tu.png" alt="">
                </div>
                <div class="login-area">
                    <div class="logo">
                        <h3>用户登录</h3>
                    </div>
                    <div class="form-group">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="loginForm" label-position="left" label-width="0px">
                            <el-form-item prop="username" class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon"><img src="../../../static/images/icon_user.png" alt=""></span>
                                <el-input  v-model="loginForm.username"  type="text" autofocus placeholder="请输入用户名" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon"><img src="../../../static/images/icon_password.png" alt=""></span>
                                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <el-form-item class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon"><img src="../../../static/images/icon_safe.png" alt=""></span>
                                <el-input style="width:230px;" placeholder="验证码" @keyup.enter.native="submitForm"></el-input>
                                <span class="code"><img src="../../../static/images/code.png" alt=""></span>
                            </el-form-item>
                            <!-- <p class="textR">忘记密码？</p> -->
                            <a class="btn-login" type="primary" @click="submitForm">登录</a>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        data() {
            let username = '';
            let password = '';
            if (process.env.NODE_ENV === 'development') {
                username = 'admin';
                password= '123456';
            } else if (process.env.NODE_ENV === 'production') {
                username = '';
                password = '';
            }
            return {
                loginForm: {
                    username: username,
                    password: password
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password :[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(){
                this.$refs['loginForm'].validate(async (valid) => {
                    if (valid) {
                        let {username,password} = this.loginForm;
                        let res = await this.$Api.login(username,password);
                        if(res.data.code===1){
                            this.$store.commit('user/setName',username);
                            this.$store.commit('user/setToken', res.data.token);
                            this.$store.commit('user/setRole', res.data.userInfo.role);
                            this.$store.commit('user/setAvatar', res.data.userInfo.avatar);
                            let backUrl = this.$route.query.redirect;
                            if(backUrl){
                                this.$router.push(backUrl)
                            }else{
                                this.$router.push('/')
                            }
                        }else{
                            this.$message.error(res.data.message);
                        }
                    } else {
                        return false;
                    }

                })
                
            },
            
        }
    }
</script>

<style lang="less" >
.el-input--prefix .el-input__inner {
    padding-left: 40px;
}
.login-page{
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../../static/images/login_bg.png') no-repeat center;
    background-size: cover;
    .login_block{
        width: 900px;
        margin: 0 auto;
        .logo_title{
            overflow: hidden;
            margin-top: 60px;
            .logo{
                float: left;
            }
            .title_group{
                color: #fff;
                text-align: center;
                margin-bottom: 30px;
                // float: left;
                // padding-left: 10px;
                // h1{
                //     font-weight: normal;
                //     font-size: 27px;
                // }
                // p{
                //     font-size: 14px;
                // }
            }
        }
        .login_body{
            margin-top: 80px;
            overflow: hidden;
            .login_tu{
                float: left;
            }
            .login-area {
                float: right;
                width: 410px;
                height: 410px;
                background-color: #fff;
                padding: 0 35px;
                .logo {
                    width: 100%;
                    text-align: center;
                    h3{
                        font-size: 24px;
                        padding: 30px 0;
                        color: #333;
                    }
                    img {
                        width: 160px;
                    }
                }
                .loginForm{
                    .input_icon{
                        position: absolute;
                        left: 0;
                        z-index: 1;
                        img{
                            vertical-align: middle;
                            margin: 0 10px;
                        }
                    }
                    .code{
                        img{
                            width: 102px;
                            height: 40px;
                            vertical-align: top;
                        }
                    }
                }
            }
        }
    }
    


    .btn-login {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 40px;
        padding: 0;
        background: #0075d3;
        border: none;
        border-radius: 4px;
        color: #fff !important;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
      
    }
    
    
}
</style>

