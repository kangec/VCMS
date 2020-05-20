<template>
    <div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>创建维修记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card class="line">
            <el-form :model="activity_form" label-width="120px" ref="activity_form">
                <el-form-item label="车辆">
                    <el-select placeholder="请选择被维修车辆" style="width: 70%" v-model="activity_form.cid">
                        <el-option :key="item.cid" :label="item.carModels+'   '+item.plateNumber+'  '+item.loaded"
                                   :value="item.cid"
                                   v-for="item in activity_select_cid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驾驶员" label-width="120px">
                    <el-select placeholder="请选择驾驶员" style="width: 70%" v-model="activity_form.driver">
                        <el-option :key="item.pid" :label="item.name" :value="item.name"
                                   v-for="item in activity_select_pid"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="开始时间" label-width="120px">
                    <el-date-picker :picker-options="pickerOptions"
                                    align="right" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始的日期和时间"
                                    style="width: 70%"
                                    type="datetime"
                                    v-model="activity_form.startTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" label-width="120px">
                    <el-date-picker :picker-options="pickerOptions"
                                    align="right" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束的日期和时间"
                                    style="width: 70%"
                                    type="datetime"
                                    v-model="activity_form.endTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="维修人员" label-width="120px">
                    <el-input style="width: 70%" v-model="activity_form.technician"></el-input>
                </el-form-item>
                <el-form-item label="花费（元）" label-width="120px">
                    <el-input style="width: 70%" v-model="activity_form.money"></el-input>
                </el-form-item>

                <el-form-item label="维修/保养/加油" label-width="120px">
                    <el-radio label="维修" v-model="activity_form.reason">维修</el-radio>
                    <el-radio label="保养" v-model="activity_form.reason">保养</el-radio>
                    <el-radio label="加油" v-model="activity_form.reason">加油</el-radio>
                </el-form-item>

                <el-form-item label="更换配件:" label-width="120px">
                    <el-input :rows="1" style="width: 70%" type="textarea"
                              v-model="activity_form.accessories"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit" type="primary">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {Message} from "element-ui";

    export default {
        name: "CreateLine",
        data() {
            return {
                activity_form: {
                    cid: '',
                    driver: '',
                    startTime: '',
                    endTime: '',
                    accessories: '',
                    reason: '',
                    technician: '',
                    money: 0
                },
                activity_select_cid: [],
                activity_select_pid: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        methods: {
            onSubmit() {
                this.$http.post('/maintains', this.activity_form).then(async res => {
                    if (res.data.code === 20000) {
                        Message({message: res.data.message, type: "success"});
                        await this.$router.push('/car/maintain')
                    } else if (res.data.code === 20001) {
                        Message({message: res.data.message, type: "error"});
                    } else {
                        Message({message: "服务器开小差了", type: "error"});
                    }

                })
            },
            getCarsList() {
                this.$http.get('/cars').then(res => {
                    // eslint-disable-next-line no-console
                    this.activity_select_cid = res.data.data;
                });
            },
            getDriverList() {
                this.$http.get('/drivers').then(res => {
                    // eslint-disable-next-line no-console
                    this.activity_select_pid = res.data.data;
                });
            },
        },
        created() {
            this.getCarsList();
            this.getDriverList();

        },
    }
</script>

<style scoped>
    .line {
        text-align: center;
    }
</style>
