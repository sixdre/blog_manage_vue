<template>
    <div class="login-page">
        <div class="login_block">
           <div class="logo_title">
                <!-- <img class="logo" src="../../assets/images/login/logo.png" alt=""> -->
                <div class="title_group">
                    <h1>后台管理系统</h1>
                </div>
            </div>
            <div class="login_body">
                <div class="login_line"></div>
                <div class="login-area">
                    <div class="form-group">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="loginForm" label-position="left" label-width="0px">
                            <el-form-item prop="username" class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon">
                                    <img v-if="focusIndex==1" src="../../assets/images/login/icon_user_white.png" alt="">
                                    <img v-else src="../../assets/images/login/icon_user.png" alt="">
                                    <span  v-if="focusIndex==1" class="split"></span>
                                </span>
                                <el-input  v-model="loginForm.username" @blur="focusIndex=0" @focus="focusIndex=1" type="text"  placeholder="请输入用户名" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon">
                                    <img v-if="focusIndex==2" src="../../assets/images/login/icon_password_white.png" alt="">
                                    <img v-else src="../../assets/images/login/icon_password.png" alt="">
                                    <span  v-if="focusIndex==2" class="split"></span>
                                </span>
                                <el-input v-model="loginForm.password" @blur="focusIndex=0" @focus="focusIndex=2" type="password" placeholder="请输入密码" @keyup.enter.native="submitForm"></el-input>
                            </el-form-item>
                            <el-form-item class="el-input--prefix" style="position:relative;">
                                <span  class="input_icon">
                                    <img v-if="focusIndex==3" src="../../assets/images/login/icon_safe_white.png" alt="">
                                    <img v-else src="../../assets/images/login/icon_safe.png" alt="">
                                    <span  v-if="focusIndex==3" class="split"></span>
                                </span>
                                <el-input style="width:230px;" @blur="focusIndex=0" @focus="focusIndex=3" placeholder="验证码" @keyup.enter.native="submitForm"></el-input>
                                <span class="code"><img src="../../assets/images/login/code.png" alt=""></span>
                            </el-form-item>
                            <!-- <p class="textR">忘记密码？</p> -->
                            <a class="btn-login" type="primary" @click="submitForm">登录</a>
                        </el-form>
                    </div>
                </div>
                 <div class="login_line"></div>
            </div>
        </div>
        <div class="copyright">
            <p>联系方式：1969716722@qq.com</p>
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
    // background: url('../../assets/images/login/login_bg.jpg');
    background: gray;
    background-size: cover;
    .login_block{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 900px;
        height: 430px;
        margin-top: -245px;
        margin-left: -450px;
        .logo_title{
            overflow: hidden;
            text-align: center;
            .title_group{
                color: #fff;
                padding-left: 10px;
                h1{
                    font-weight: bold;
                    font-family: '宋体';
                    font-size: 27px;
                    line-height: 1.7;
                    margin-top: 15px;
                }
                p{
                    font-size: 16px;
                    //  font-weight: bold;
                    font-family: 'PingFang SC';
                }
            }
        }
        .login_body{
            margin-top: 15px;
            overflow: hidden;
            .login_line{
                width: 668px;
                height: 2px;
                margin: 0 auto;
                background: url(../../assets/images/login/login_line.png) no-repeat center;
            }
            .login-area {
                width: 370px;
                padding: 15px 25px;
                margin: 0 auto;
                .el-input__inner{
                    background-color: transparent !important;
                    color: #fff;
                    border-color:#c9c9c9;
                }
                .el-input.is-active .el-input__inner, .el-input__inner:focus {
                    border-color: #00c6ff;
                    outline: 0;
                }
                .el-input__inner:focus::-webkit-input-placeholder{
                    color:#fff;
                }
                 .el-input__inner:focus::-moz-placeholder{   /* Mozilla Firefox 19+ */
                    color:#fff;
                }
                 .el-input__inner:focus:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                    color:#fff;
                }
                 .el-input__inner:focus:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                    color:#fff;
                }
                .loginForm{
                    .input_icon{
                        position: absolute;
                        left: 0;
                        z-index: 1;
                        .split{
                            position: absolute;
                            right: 3px;
                            top: 50%;
                            margin-top: -7.5px;
                            width: 1px;
                            height: 15px;
                            background-color: #c9c9c9;
                            margin-left: -8px;
                        }
                        img{
                            vertical-align: middle;
                            margin: 0 10px;
                        }
                    }
                    .code{
                        img{
                            width: 80px;
                            height: 40px;
                            vertical-align: top;
                            margin-left: 5px;
                            cursor: pointer;
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
        color: #fff;
        text-align: center;
        font-size: 12px;
        line-height: 1.8;
        p{
            font-family: '宋体';
        }
    }

    .btn-login {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0;
        background: url(../../assets/images/login/login_btn.png) no-repeat center;
        background-size: cover;
        border: none;
        border-radius: 4px;
        color: #fff !important;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
      
    }
    
    
}
</style>




