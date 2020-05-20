<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-header style="text-align: right; font-size: 12px">
            <div>
                <span class="header_font_size">溜溜球科技-车辆管理系统</span>
            </div>

            <div>
                <el-dropdown>
                    <i class="el-icon-user-solid" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <el-aside style="background-color: rgb(238, 241, 246)" width="200px">
                <el-menu :default-openeds="['/index']" router unique-opened>

                    <!--首页-->
                    <el-menu-item index="/index">
                        <i class="el-icon-s-home"></i>首页
                    </el-menu-item>

                    <!--用户管理-->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user"></i>用户管理
                        </template>
                        <el-menu-item index="/user">管理员档案列表</el-menu-item>
                    </el-submenu>

                    <!--车辆信息管理-->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-receiving"></i>车辆管理
                        </template>
                        <el-menu-item index="/car">
                            <template slot="title">
                                <i class="el-icon-document"></i>车辆档案列表
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/car/maintain">
                            <template slot="title">
                                <i class="el-icon-document"></i>车辆维修记录
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/car/other">
                            <template slot="title">
                                <i class="el-icon-odometer"></i>创建维修记录
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!--驾驶员信息管理-->
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>驾驶员管理
                        </template>
                        <el-menu-item index="/driver">
                            <template slot="title">
                                <i class="el-icon-document"></i>驾驶员档案列表
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <!--出车信息管理-->
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-copy-document"></i>出车管理
                        </template>
                        <el-menu-item index="/activity/create/-1">
                            <template slot="title">
                                <i class="el-icon-plus"/>创建出车记录
                            </template>
                        </el-menu-item>

                        <el-menu-item index="/activity">
                            <template slot="title">
                                <i class="el-icon-document"></i>出车记录列表
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/activity/location">
                            <template slot="title">
                                <i class="el-icon-location"/>车辆定位
                            </template>
                        </el-menu-item>

                    </el-submenu>
                    <!--数据导出-->
                    <el-menu-item index="/export">
                        <i class="el-icon-wallet"></i>数据导出
                    </el-menu-item>
                    <!--关于-->
                    <el-menu-item index="/about">
                        <i class="el-icon-info"></i>关于
                    </el-menu-item>

                </el-menu>
            </el-aside>
            <el-main>
                <transition>
                    <router-view/>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "home",
        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push("/login");
            }
        }
    };
</script>

<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .el-header {
        background-color: #409EFF;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        font-size: 50px;

        > div {
            display: flex;
        }

        .header_font_size {
            font-size: 25px;
        }
    }

    .el-aside {
        background-color: #333;
        color: #333;
    }

    svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
</style>

