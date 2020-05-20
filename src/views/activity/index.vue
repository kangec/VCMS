<template>
    <div>
        <div style="display: inline">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>出车管理</el-breadcrumb-item>
                <el-breadcrumb-item>出车记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card>
            <el-table :data="activityTableData" :default-sort="{prop: 'date', order: 'descending'}"
                      :row-class-name="tableRowClassName" border height="550px"
                      style="width: 100%" v-loading="loading">
                <el-table-column align="center" label="出车单号" prop="aid" sortable width="130">
                </el-table-column>
                <el-table-column align="center" label="开始时间" prop="startTime" sortable width="170">
                </el-table-column>
                <el-table-column align="center" label="结束时间" prop="endTime" sortable width="170">
                </el-table-column>
                <el-table-column align="center" label="车牌" prop="plateNumber" width="130">
                </el-table-column>
                <el-table-column align="center" label="驾驶员" prop="name" width="130">
                </el-table-column>
                <el-table-column align="center" label="用车原因" prop="event">
                </el-table-column>
                <el-table-column align="center" label="状态" width="">
                    <template slot-scope="scope">
                        <el-switch :active-value="true" :disabled="!scope.row.status" :inactive-value="false"
                                   @change="update(scope.row)" active-color="#13ce66"
                                   active-text="出车中" inactive-color="#ff4949" inactive-text="已完成"
                                   v-model="scope.row.status"></el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    import {Message} from "element-ui";

    export default {
        name: "index",
        data() {
            return {
                activityTableData: [],
                update_form: {
                    aid: '',
                    status: ''
                },
                loading: true
            }
        },
        created() {
            this.getActivitiesList();
        },
        methods: {
            getActivitiesList() {
                this.$http.get(`/activities`).then(async res => {
                    this.activityTableData = res.data.data;
                    this.loading = false;
                })
            },
            update(row) {
                this.$http.put('/activities', row).then(async res => {
                    if (res.data.code === 20000) {
                        Message({message: res.data.message, type: "success"});
                        this.getUserList();
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }
                })
            },
            tableRowClassName({row}) {
                if (row.status === true) {
                    return 'success-row';
                } else if (row.status === false) {
                    return 'fail-row';
                }
                return '.warning-row';
            }
        }
    }
</script>

<style>
    .block_table {
        margin-top: 10px;
    }

    .el-table .warning-row {
        background: #f3fd84;
    }

    .el-table .success-row {
        background: #F0F9EB;
    }

    .el-table .fail-row {
        background: #FDF5E6;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>
