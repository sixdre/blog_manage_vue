<template>
    <div class="login-page">
        <div class="login_block">
           <div class="logo_title">
            </div>
            <div class="login_body">
                <div class="l_title">
                    <h5>登录</h5>
                    <span>SIGN IN</span>
                </div>
                <div class="login-area">
                    <div class="form-group">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="loginForm" label-position="left" label-width="0px">
                            <el-form-item prop="username" class="el-input--prefix" style="position:relative;margin-bottom:30px;">
                                <span  class="input_icon">
                                    <img src="../../assets/images/login/icon_phone.png" alt="">
                                </span>
                                <el-input class="my_input"  v-model="loginForm.username" type="text"  placeholder="请输入登录账号" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="el-input--prefix" style="position:relative;margin-bottom:30px;">
                                <span class="input_icon">
                                    <img src="../../assets/images/login/icon_password.png" alt="">
                                </span>
                                <el-input class="my_input" v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <!-- <p class="textR">忘记密码？</p> -->
                            <el-button class="login_btn" @click="submitForm" :loading="loading">登录</el-button>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p> Copyright © 2004-2016  </p>
        </div>
    </div>
</template>

<script>
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
                loading:false,
                focusIndex:0,
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
                        this.loading= true;
                        let {username,password} = this.loginForm;
                        this.$store.dispatch('user/login',{username,password}).then(res=>{
                            if(res.data.code===1){
                                let backUrl = this.$route.query.redirect;
                                if(backUrl){
                                    this.$router.push(backUrl)
                                }else{
                                    this.$router.push('/')
                                }
                            }else{
                                this.$message.error(res.data.message);
                            }
                            this.loading= false;
                        },(err)=>{
                            this.$message.error('登录失败');
                            this.loading= false;
                        })
                    } else {
                        return false;
                    }

                })
                
            },
            
        }
    }
</script>

<style lang="less" >
.my_input{
    border: 0;
    input{
        border: 0;
        border-bottom: 1px solid #eee;
    }
}
.el-input--prefix .el-input__inner {
    padding-left: 40px;
}
.login-page{
    position: absolute;
    width: 100%;
    height: 100%;
    // background: url('../../assets/images/login/login_bg.png');
    background-size: contain;
    .login_block{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 500px;
        height: 500px;
        margin-top: -250px;
        margin-left: -250px;
        .logo_title{
            overflow: hidden;
        }
        .login_body{
            margin-top: 15px;
            overflow: hidden;
            background-color: #fff;
            padding: 60px 60px;
            position: relative;
            .sanjiao{
                position: absolute;
                top: 10px;
                left: 10px;
            }
            .l_title{
                margin-bottom: 50px;
                h5{
                    display: inline;
                    color: #4c4c4c;
                    font-size: 30px;
                }
                span{
                    color: #28b779;
                    font-size: 25px;
                }
            }
            .login-area {
                margin: 0 auto;
                .el-input__inner{
                    background-color: transparent !important;
                    color: #666;
                    border-color:#c9c9c9;
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
                }
            }
        }
    }
    
    .copyright{
        position: absolute;
        bottom: 25px;
        left:0;
        right: 0;
        color: #000000;
        text-align: center;
        font-size: 12px;
        line-height: 1.8;
    }

    .login_btn {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0;
        background: #28b779;
        background-size: cover;
        border: none;
        border-radius: 4px;
        color: #fff !important;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        margin-top: 40px;
      
    }
    
    
}
</style>

