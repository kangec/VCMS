<template>
    <div>
        <el-card class="line">
            <div slot="header">
                <h2>溜溜球科技车辆出行申请</h2>
            </div>
            <el-form :model="form" :rules="rules" class="form" label-width="140px" ref="form">
                <el-form-item label="申请人" prop="claimer">
                    <el-input placeholder="例：张山（132##@163.com）" style="width: 70%" v-model="form.claimer"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker align="right"
                                    format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始的日期和时间" style="width: 70%"
                                    type="datetime"
                                    v-model="form.startTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker align="right"
                                    format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束的日期和时间" style="width: 70%"
                                    type="datetime"
                                    v-model="form.endTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请理由" prop="event">
                    <el-input :rows="12" style="width: 70%" type="textarea" v-model="form.event"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit" type="primary">立即申请</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    export default {
        data() {
            return {
                form: {
                    claimer: '',
                    startTime: '',
                    endTime: '',
                    event: ''
                },
                rules: {
                    claimer: [
                        {required: true, message: '请输入姓名和邮箱，用中文括号。', trigger: 'blur'},
                    ],
                    event: [
                        {required: true, message: '请填写具体用途', trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate((vaild) => {
                    // eslint-disable-next-line no-console
                    console.log(vaild)
                    if (vaild) {
                        this.$http.post('/index/apply', this.form).then(res => {
                            if (res.data.code === 20000) {
                                Message({message: res.data.message, type: "success"});
                                this.form = {
                                    claimer: '',
                                    startTime: '',
                                    endTime: '',
                                    event: ''
                                }
                            } else if (res.data.code === 20001) {
                                Message({message: res.data.message, type: "error"});
                            } else {
                                Message({message: "服务器开小差了", type: "error"});
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .el-card {
        margin: 30px;
    }

    .line {
        margin-left: 15%;
        text-align: center;
        width: 70%;
        height: 90%;
    }
</style>
