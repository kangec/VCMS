<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
            <el-breadcrumb-item>车辆维修记录</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="always">
            <el-table :data="list" height="523px"
                      style="width: 100%"
                      v-loading="value">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form class="demo-table-expand" inline label-position="left">
                            <el-form-item label="维修单号：">
                                <span>{{ props.row.mid }}</span>
                            </el-form-item>
                            <el-form-item label="车 辆 ID：">
                                <span>{{ props.row.cid }}</span>
                            </el-form-item>
                            <el-form-item label="送修司机：">
                                <span>{{ props.row.driver }}</span>
                            </el-form-item>
                            <el-form-item label="维修/保养/加油：">
                                <span>{{ props.row.reason }}</span>
                            </el-form-item>
                            <el-form-item label="维修人员：">
                                <span>{{ props.row.technician }}</span>
                            </el-form-item>
                            <el-form-item label="更换配件：">
                                <span>{{ props.row.accessories }}</span>
                            </el-form-item>
                            <el-form-item label="送修时间：">
                                <span>{{ props.row.startTime}}</span>
                            </el-form-item>
                            <el-form-item label="返回时间：">
                                <span>{{ props.row.endTime }}</span>
                            </el-form-item>
                            <el-form-item label="花费（元）:">
                                <span>{{ props.row.money }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        label="车辆 ID"
                        prop="cid">
                </el-table-column>
                <el-table-column
                        label="送修司机"
                        prop="driver">
                </el-table-column>
                <el-table-column
                        label="维修人员"
                        prop="technician">
                </el-table-column>
                <el-table-column
                        label="维修/保养/加油"
                        prop="reason">
                </el-table-column>
                <el-table-column
                        label="花费(元)"
                        prop="money">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleEdit(scope.row)"
                                size="mini">编辑
                        </el-button>
                        <el-button
                                @click="handleDelete(scope.row)"
                                size="mini"
                                type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="currentPage"
                    :hide-on-single-page="total<pageSize"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    layout="total, prev, pager, next, jumper">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {Message} from "element-ui";

    export default {
        data() {
            return {
                value: true,
                total: 0,
                pageSize: 0,
                currentPage: 1,
                list: [],
            }
        },
        created() {
            this.getMaintainList(1)
        },
        methods: {
            handleSizeChange() {

            },
            handleCurrentChange(val) {
                this.getMaintainList(val)
            },
            handleEdit() {

            },
            handleDelete(row) {
                this.$confirm('此操作将不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('/maintains/' + row.mid).then(res => {
                        if (res.data.code === 20000) {
                            Message({message: res.data.message, type: "success"});
                            this.getMaintainList(this.currentPage)
                        } else if (res.data.code === 20001) {
                            Message({message: res.data.message, type: "error"});
                        } else {
                            Message({message: "服务器开小差了", type: "error"});
                        }
                    })
                }).catch(() => {
                    //几点取消的提示
                });
            },
            getMaintainList(pageNum) {
                this.$http.get('/maintains/' + pageNum).then(res => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                    this.pageSize = res.data.data.pageSize;
                    this.value = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-dialog {
        height: 180px;
        width: 360px;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .elupload {
        margin: 10px auto;
    }

</style>
