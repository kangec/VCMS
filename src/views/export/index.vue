<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据导出</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button @click="maintain" type="primary">维修记录导出</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button @click="activity" type="primary">出车记录导出</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button type="primary">驾驶员档案导出</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button type="primary">车辆档案导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {
            activity() {
                window.open(`http://localhost:8083/api/v1/activities/export`)
            },
            maintain() {
                window.open(`http://localhost:8083/api/v1/maintains/export`)
            }
        }
    };
</script>

<style lang="scss" scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .last-child {
        margin-bottom: 0;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .el-button {
        width: 100%;
        height: 60px;
    }


</style>
