<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
            <el-breadcrumb-item>车辆档案</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="always">
            <el-row :gutter="30">
                <el-col :span="10">
                    <el-input @clear="getCarsList" class="input-with-select" clearable placeholder="在这里输入"
                              v-model="searchStr">
                        <el-select placeholder="类型选择" slot="prepend" v-model="selectClass">
                            <el-option label="车辆ID" value="cid"></el-option>
                            <el-option label="车牌" value="plateNumber"></el-option>
                            <el-option label="车型" value="carModels"></el-option>
                        </el-select>
                        <el-button @click="select" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!--车辆-->
                    <el-button @click="dialogFormVisible = true" icon="el-icon-plus" type="primary">添加车辆</el-button>
                    <el-dialog :title="title" :visible.sync="dialogFormVisible">
                        <el-form :model="addCarForm">
                            <el-form-item :label-width="formLabelWidth" label="车型">
                                <el-input autocomplete="off" v-model="addCarForm.carModels"></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth" label="车牌">
                                <el-input autocomplete="off" v-model="addCarForm.plateNumber"></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth" label="载重">
                                <el-input autocomplete="off" v-model="addCarForm.loaded"></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth" label="车辆详情">
                            </el-form-item>
                        </el-form>
                        <el-upload :before-upload="beforeUpload" accept="image/jpeg,image/gif,image/png,image/bmp"
                                   action="/api/v1" class="el-dialog" drag ref="newupload">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text b-toaster-top-center">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip b-toaster-top-center" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <div class="dialog-footer" slot="footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button @click="addCars" type="primary">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-col>
            </el-row>

            <el-table :data="tableData"
                      height="510px"
                      style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form class="demo-table-expand" inline label-position="left">
                            <el-form-item label="车 辆 ID：">
                                <span>{{ props.row.cid }}</span>
                            </el-form-item>
                            <el-form-item label="车 牌：">
                                <span>{{ props.row.plateNumber }}</span>
                            </el-form-item>
                            <el-form-item label="车型：">
                                <span>{{ props.row.carModels }}</span>
                            </el-form-item>
                            <el-form-item label="载重（KG）：">
                                <span>{{ props.row.loaded }}</span>
                            </el-form-item>
                            <el-form-item label="车辆详情">
                                <img :src=props.row.info>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="##" type="index"></el-table-column>
                <el-table-column
                        label="车辆 ID"
                        prop="cid">
                </el-table-column>
                <el-table-column
                        label="车牌"
                        prop="plateNumber">
                </el-table-column>
                <el-table-column
                        label="车型"
                        prop="carModels">
                </el-table-column>
                <el-table-column
                        label="载重"
                        prop="loaded">
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
                title: '编辑',
                /*搜索字段*/
                searchStr: '',
                /*添加管理员可见性*/
                dialogFormVisible: false,
                /*批量添加管理员可见性*/
                addAdminByFileFormVisible: false,
                addAdminByFileForm: '',
                formLabelWidth: '100px',
                tableData: [{
                    cid: '',
                    plateNumber: '',
                    carModels: '',
                    loaded: '',
                    info: ''
                }],
                addCarForm: {
                    cid: '',
                    plateNumber: '',
                    carModels: '',
                    loaded: '',
                    info: ''
                },
                selectClass: '',
            }
        },
        created() {
            this.getCarsList()
        },
        methods: {
            beforeUpload(file) {
                let fd = new FormData();
                fd.append('file', file);
                this.$http.post('/cars/upload', fd).then(res => {
                    Message({message: "上传成功", type: "success"});
                    this.addCarForm.info = res.data;
                })
            },
            handleDelete(row) {
                this.$confirm('此操作将不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('cars/' + row.cid).then(res => {
                        if (res.data.code === 20000) {
                            Message({message: res.data.message, type: "success"});
                            this.getCarsList();
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
            // eslint-disable-next-line no-unused-vars
            handleEdit(row) {
                this.dialogFormVisible = true;
                this.addCarForm.carModels = row.carModels
                this.addCarForm.loaded = row.loaded
                this.addCarForm.plateNumber = row.plateNumber
                this.addCarForm.info = row.info;
            },
            getCarsList() {
                this.$http.get('/cars').then(res => {
                    // eslint-disable-next-line no-console
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
            addCars() {
                this.$http.post('cars', this.addCarForm).then(res => {
                    if (res.data.code === 20000) {
                        Message({message: res.data.message, type: "success"});
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }
                })
                this.getCarsList();
                this.dialogFormVisible = false;
                this.addCarForm.resetFields();

            },
            async select() {
                if (this.searchStr === '') return;
                const _str = this.searchStr.trim();
                const res = await this.$http.get(`/cars/` + _str);
                this.tableData = [];
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
