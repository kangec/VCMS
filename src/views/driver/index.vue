<template>
    <div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>驾驶员管理</el-breadcrumb-item>
                <el-breadcrumb-item>驾驶员档案</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-dialog :visible.sync="dialogFormVisible" title="编辑">
            <el-form v-model="driverFormData">
                <el-form-item :label-width="label_width" label="姓名">
                    <el-input autocomplete="off" v-model="driverFormData.name"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="性别">
                    <el-input autocomplete="off" v-model="driverFormData.sex"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="年龄">
                    <el-input autocomplete="off" v-model="driverFormData.age"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="身份证">
                    <el-input autocomplete="off" v-model="driverFormData.cardId"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="联系方式">
                    <el-input autocomplete="off" v-model="driverFormData.phone"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="家庭住址">
                    <el-input autocomplete="off" v-model="driverFormData.address"></el-input>
                </el-form-item>
                <el-form-item :label-width="label_width" label="健康情况">
                    <el-input autocomplete="off" v-model="driverFormData.info"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button @click="updateDriverClick" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-card>
            <el-row :gutter="5">
                <el-col :span="10">
                    <el-input @clear="getDriversList" class="input-with-select" clearable placeholder="姓名"
                              v-model="searchStr">
                        <el-button @click="select" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button @click="clear" icon="el-icon-plus" type="primary">添加驾驶员</el-button>
                </el-col>
                <el-upload
                        :before-upload="beforeUpload"
                        :on-error="onError"
                        :on-success="onSuccess"
                        :show-file-list="false"
                        action="api/v1/drivers/import"
                        style="display: inline">
                    <el-button :disabled="!enabledUploadBtn" icon="el-icon-upload" type="primary">批量添加</el-button>
                </el-upload>
            </el-row>

            <el-table
                    :data="driverTableData"
                    border
                    height="500px" style="width: 100%;margin-top: 20px">
                <el-table-column
                        fixed
                        label="编号"
                        prop="pid">
                </el-table-column>
                <el-table-column
                        label="姓名"
                        prop="name"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="性别"
                        prop="sex"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="年龄"
                        prop="age"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="地址"
                        prop="address">
                </el-table-column>
                <el-table-column
                        label="身份证号码"
                        prop="cardId">
                </el-table-column>
                <el-table-column
                        label="联系电话"
                        prop="phone">
                </el-table-column>
                <el-table-column
                        label="身体状况"
                        prop="info">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleEditClick(scope.row)" size="small" type="warning">编辑</el-button>
                        <el-button @click="handleDeleteClick(scope.row)" size="small" type="primary">删除</el-button>
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
                enabledUploadBtn: true,
                searchStr: '',
                label_width: '100px',
                dialogFormVisible: false,
                driverTableData: [{
                    pid: '',
                    name: '',
                    sex: '',
                    age: '',
                    cardId: '',
                    phone: '',
                    address: '',
                    info: '',
                }],
                driverFormData: [{
                    pid: '',
                    name: '',
                    sex: '',
                    age: '',
                    cardId: '',
                    phone: '',
                    address: '',
                    info: '',
                }]
            }
        },
        created() {
            this.getDriversList()
        },
        methods: {
            clear() {
                this.dialogFormVisible = true
                this.driverFormData = [{
                    pid: '',
                    name: '',
                    sex: '',
                    age: '',
                    cardId: '',
                    phone: '',
                    address: '',
                    info: '',
                }];
            },

            updateDriverClick() {
                this.$http.post('/drivers', this.driverFormData).then(async res => {
                    if (res.data.code === 20000) {
                        await Message({message: res.data.message, type: "success"});
                    } else if (res.data.code === 20001) {
                        await Message({message: res.data.message, type: "error"});
                    } else {
                        await Message({message: "服务器开小差了", type: "error"});
                    }
                }).catch(() => {
                    // Message({message: "服务器开小差了", type: "error"});
                })
                this.dialogFormVisible = false;
                this.getDriversList();
            },
            getDriversList() {
                this.$http.get('/drivers').then(async res => {
                    this.driverTableData = res.data.data;
                    if (res.data.code === 20000) {
                        await Message({message: res.data.message, type: "success"});
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }
                })
            },
            handleEditClick(row) {
                this.dialogFormVisible = true;
                this.driverFormData = row;
            },
            handleDeleteClick(row) {
                this.$confirm('此操作将不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.delete('/drivers/' + row.pid).then(res => {
                        if (res.data.code === 20000) {
                            Message({message: res.data.message, type: "success"});
                            this.getDriversList();
                        } else if (res.data.code === 20001) {
                            Message({message: res.data.message, type: "error"});
                        } else {
                            Message({message: "服务器开小差了", type: "error"});
                        }
                    })
                }).catch(() => {
                    // Message({message: "服务器开小差了", type: "error"});
                });
            },
            select() {
                if (this.searchStr.trim()) {
                    this.$http.get('/drivers/' + this.searchStr).then(res => {
                        this.driverTableData = res.data.data;
                    })
                }
            },
            // eslint-disable-next-line no-unused-vars
            onSuccess(response, file, fileList) {
                this.btnText = '数据导入';
                this.enabledUploadBtn = true;
                if (file.response.code === 20000) {
                    Message({message: file.response.message, type: "success"});
                } else if (file.response.code === 20001) {
                    Message({message: file.response.message, type: "error"});
                } else {
                    Message({message: "服务器开小差了", type: "error"});
                }
            },
            // eslint-disable-next-line no-unused-vars
            onError(err, file, fileList) {
                this.enabledUploadBtn = true;
            },
            // eslint-disable-next-line no-unused-vars
            beforeUpload(file) {
                this.enabledUploadBtn = false;
            }

        }
    }
</script>

<style scoped>

</style>
