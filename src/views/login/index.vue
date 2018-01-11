<template>
    <div class="login-page">
        <div class="login-area">
            <div class="logo">
                
            </div>
            <div class="form-group">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username"  type="text" autofocus placeholder="账户名" @keyup.enter.native="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter.native="submitForm"></el-input>
                    </el-form-item>
                    <!-- <p class="textR">忘记密码？</p> -->
                    <a class="btn-login" type="primary" @click="submitForm()">登录</a>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password :[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                validate: false
            }
        },
        methods: {
            async submitForm(){
                let {username,password} = this.loginForm;
                let res = await this.$Api.login(username,password);
                if(res.data.code===1){
                    this.$store.commit('user/setName',username);
                    this.$store.commit('user/setToken', res.data.token);
                    this.$store.commit('user/setRole', res.data.role.name);
                    let backUrl = this.$route.query.redirect;
                    if(backUrl){
                        this.$router.push(backUrl)
                    }else{
                        this.$router.push('/')
                    }
                }else{
                    this.$message.error(res.data.message);
                }
            },
            
        }
    }
</script>

<style lang="less">
    .login-page{
		position: absolute;
        width: 100%;
        height: 100%;
        background: #2d3a4b;

        .login-area {
            width: 330px;
            margin: 0 auto;
            .logo {
                width: 100%;
                height: 200px;
                text-align: center;
                    img {
                    width: 160px;
                }
            }
        }

        .form-group {
            input::-webkit-input-placeholder{
                color: #7e9fb0;
            }
            position: relative;
            padding-bottom: 20px;
            color: #ccc;
            overflow: hidden;
            .el-input__inner {
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
                background: rgba(0,0,0,.1);
                border: 1px solid rgba(255,255,255,.1);
                border-radius: 4px;
                color: #ccc;
                font-size: 15px;
                overflow: hidden;
                &:hover{
                    border-color: rgba(255,255,255,.2);
                }
                &:focus{
                    border-color: rgba(255,255,255,.4);
                }
            }
            .el-form-item{
                &.is-error .el-input__inner{
                    border-color: #d45b5b;
                }
                &.captcha input{
                    width: 200px;
                }
                &.captcha img{
                    float: right;
                }
            }
            .el-form-item__error{
                color: #d45b5b;
            }
        }

        .btn-login {
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            margin: 10px 0;
            padding: 0;
            background: #424f60;
            border: none;
            border-radius: 4px;
            color: #ccc !important;
            font-size: 18px;
            text-align: center;
            cursor: pointer;
            &:hover{
                background: darken(#424f60, 2%)
            }
        }
        
        .err-msg{
            color: #d45b5b;
        }
        .tip{
            margin-top: 10px;
            color: #ccc;
        }

        .lang-toggle{
            text-align: center;
            color: #ccc;
            span{
                display: inline-block;
                width: 26px;
                height: 26px;
                line-height: 26px;
                border-radius: 50%;
                color: #ccc;
                font-size: 14px;
                text-align: center;
                cursor: pointer;
                &.cur{
                    background: #ff6363;
                    color: #2d3a4b;
                }
            }
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 80px;
            line-height: 80px;
            color: #ccc;
            font-size: 16px;
            text-align: center;
        }
    }
</style>

