<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="loginFromRules" class="login-form" label-position="left" ref="loginFormRef">

            <div class="title-container">
                <h3 class="title">登 录</h3>
            </div>

            <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
                <el-input
                        auto-complete="on"
                        name="username"
                        placeholder="Username"
                        ref="username"
                        tabindex="1"
                        type="text"
                        v-model="loginForm.username"
                />
            </el-form-item>

            <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
                <el-input
                        :key="passwordType"
                        :type="passwordType"
                        @keyup.enter.native="handleLogin"
                        auto-complete="on"
                        name="password"
                        placeholder="Password"
                        ref="password"
                        tabindex="2"
                        v-model="loginForm.password"
                />
            </el-form-item>

            <el-button @click="login" style="width:100%;margin-bottom:30px;" type="primary">登 录</el-button>

        </el-form>
    </div>
</template>

<script>
    import {Message} from "element-ui";

    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    id: 21,
                    username: 'admin',
                    password: 'admin'
                },
                loginFromRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
                    ],
                },
                passwordType: 'password',
            }
        },
        methods: {
            login() {
                this.$refs.loginFormRef.validate(valid => {
                    if (!valid) return;
                    this.$http.post('admins/login', this.loginForm).then(res => {
                        if (res.data.code === 20000) {
                            Message({message: res.data.message, type: "success"});
                            window.sessionStorage.setItem('token', res.data.data)
                            this.$router.push("/");
                        } else if (res.data.code === 20002) {
                            Message({message: res.data.message, type: "error"});
                        } else if (res.data.code === 20003) {
                            Message({message: res.data.message, type: "error"});
                        }
                    })
                });
            },


        }
    }
</script>

<style lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        width: 100%;
        height: 100%;

        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
        }
    }
</style>
