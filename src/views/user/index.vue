<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="always">
            <el-row :gutter="40">
                <el-col :span="10">
                    <el-input @clear="getUserList" class="input-with-select" clearable onkeyup="this.value=this.value.replace(/[^\w\u4E00-\u9FA5]/g,'');
                            " placeholder="用户名" v-model="searchStr">
                        <el-button @click="select" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <!--添加管理员-->
                    <el-button @click="dialogFormVisible = true" icon="el-icon-plus" type="primary">添加管理员</el-button>
                    <el-dialog :title="title" :visible.sync="dialogFormVisible">
                        <el-form :model="addAdminForm" :rules="rules">
                            <el-form-item :label-width="formLabelWidth" label="用户名" prop="ac">
                                <el-input autocomplete="off" v-model="addAdminForm.username"></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth" prop="pass">
                                <label slot="label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
                                <el-input autocomplete="off" v-model="addAdminForm.password"></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth" prop="check">
                                <label slot="label">确认密码</label>
                                <el-input autocomplete="off" v-model="password2"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="dialog-footer" slot="footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button @click="addAdmin" type="primary">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-col>
                <el-col :span="5">
                    <!--批量导入-->
                    <el-upload
                            :before-upload="beforeUpload"
                            :on-error="onError"
                            :on-success="onSuccess"
                            :show-file-list="false"
                            action="api/v1/admins/import"
                            style="display: inline">
                        <el-button :disabled="!enabledUploadBtn" icon="el-icon-upload" type="primary">批量添加</el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <el-table :data="tableData"
                      border
                      height="500px"
                      size="medium"
                      style="width: 100%">
                <el-table-column fixed label="##" type="index"></el-table-column>
                <el-table-column
                        label="编号"
                        prop="aid"
                        width="250px">
                </el-table-column>
                <el-table-column
                        label="姓名"
                        prop="username"
                        width="300px">
                </el-table-column>
                <el-table-column
                        label="密码"
                        prop="password"
                        width="300px">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200px">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" size="small" type="text">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import {Message} from "element-ui";
    import {isString} from '../../utils/validate.js'

    export default {
        name: "index",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.password2 !== '') {
                        this.$refs.addAdminForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addAdminForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                enabledUploadBtn: true,
                title: '编辑',
                /*表格数据*/
                tableData: [],
                /*搜索字段*/
                searchStr: '',
                /*添加管理员可见性*/
                dialogFormVisible: false,
                /*批量添加管理员可见性*/
                addAdminByFileFormVisible: false,
                addAdminForm: {
                    aid: '',
                    username: '',
                    password: '',
                },
                addAdminByFileForm: '',
                formLabelWidth: '120px',
                password2: '',
                rules: {
                    ac: [
                        {required: true, message: '字母数字下划线', validator: isString, trim: 'blur'}
                    ],
                    pass: [
                        {required: true, validator: validatePass, trim: 'blur'}
                    ],
                    check: [
                        {required: true, validator: validatePass2, trim: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            handleDelete(row) {
                this.$confirm('此操作将不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('admins/' + row.aid).then(res => {
                        if (res.data.code === 20000) {
                            Message({message: res.data.message, type: "success"});
                            this.getUserList();
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
            handleEdit(row) {
                this.dialogFormVisible = true;
                this.addAdminForm.aid = row.aid;
                this.addAdminForm.username = row.username;
                this.addAdminForm.password = row.password;
                this.addAdminForm.resetFields();
            },
            getUserList() {
                this.$http.get('/admins').then(res => {
                    this.tableData = res.data.data;
                    if (res.data.code === 20000) {
                        Message({message: res.data.message, type: "success"});
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }
                });
            },
            addAdmin() {
                this.$http.post('admins', this.addAdminForm).then(res => {
                    if (res.data.code === 20000) {
                        Message({message: res.data.message, type: "success"});
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }
                })
                this.dialogFormVisible = false;
                this.addAdminForm.resetFields();
                this.getUserList();
            },
            async select() {
                const res = await this.$http.get(`/admins/` + this.searchStr);
                if (res.data.code === 20001) {
                    Message({message: res.data.message, type: "error"});
                    return;
                }
                this.tableData = res.data.data;
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

<style lang="scss" scoped>

    .block {
        margin: auto;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

</style>
