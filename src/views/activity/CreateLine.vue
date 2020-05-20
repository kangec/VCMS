<template>
    <div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>出车管理</el-breadcrumb-item>
                <el-breadcrumb-item>出车</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card class="line" element-loading-spinner="el-icon-loading" element-loading-text="创建成功，正在下发通知。。"
                 v-loading="value">
            <el-form :model="activity_form" label-width="80px" ref="activity_form">
                <el-form-item label="车辆">
                    <el-select placeholder="请选择出车车辆" style="width: 70%" v-model="activity_form.cid">
                        <el-option :key="item.cid"
                                   :label="item.carModels+'   '+item.plateNumber+'  '+item.loaded" :value="item.cid"
                                   v-for="item in activity_select_cid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驾驶员">
                    <el-select placeholder="请选择驾驶员" style="width: 70%" v-model="activity_form.pid">
                        <el-option :key="item.pid" :label="item.name+'   '+item.sex+'   '+item.info"
                                   :value="item.pid"
                                   v-for="item in activity_select_pid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker :picker-options="pickerOptions"
                                    align="right" format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择开始的日期和时间"
                                    style="width: 70%"
                                    type="datetime"
                                    v-model="activity_form.startTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker :picker-options="pickerOptions"
                                    align="right" format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择结束的日期和时间"
                                    style="width: 70%"
                                    type="datetime"
                                    v-model="activity_form.endTime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="事由">
                    <el-input :rows="10" style="width: 70%" type="textarea" v-model="activity_form.event"></el-input>
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
    export default {
        name: "CreateLine",
        data() {
            return {
                value: false,
                activity_form: {
                    cid: '',
                    pid: '',
                    startTime: '',
                    endTime: '',
                    event: '',
                    status: true
                },
                activity_select_cid: [],
                activity_select_pid: [],
                mail: '',
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
                // eslint-disable-next-line no-console
                console.log(this.activity_form)
                this.value = true;
                this.$http.post('/activities/' + this.mail, this.activity_form).then(() => {
                    this.value = false
                    this.$router.push('/activity')
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
            getApplyData() {
                const index = this.$route.params.index;
                if (index != -1) {
                    const data = window.sessionStorage.getItem(index);
                    this.activity_form.event = data.split("$")[0];
                    this.mail = data.split("（")[1].split("）")[0]
                    this.activity_form.startTime = data.split("$")[2];
                    this.activity_form.endTime = data.split("$")[3];
                }
            }
        },
        created() {
            this.getCarsList();
            this.getDriverList();
            this.getApplyData();
        },
    }
</script>

<style scoped>
    .line {
        text-align: center;
    }
</style>
