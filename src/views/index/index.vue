<template>
    <div>

        <el-row :gutter="20">
            <el-col :span="6">
                <!--消息条数-->
                <div class="grid-content bg-purple">
                    <el-badge :value="message" class="item">
                        <el-button @click="getApply" class="el-buttons" type="danger">
                            <svg-icon icon-class="advice"></svg-icon>
                            <span style="margin-left: 10px">未处理</span>
                        </el-button>
                    </el-badge>
                </div>

                <el-dialog :visible.sync="messageDialogVisible" title="已提交的申请" width="50%">
                    <el-table :data="messageTableData" max-height="400px" style="width: 100%">
                        <el-table-column label="使用时段">
                            <template slot-scope="scope">
                                <svg-icon icon-class="startTime"></svg-icon>
                                <span>{{ scope.row.startTime }}</span><br>
                                <br>
                                <svg-icon icon-class="endTime"></svg-icon>
                                <span>{{ scope.row.endTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="申请人（联系方式）"
                                width="180">
                            <template slot-scope="scope">
                                <el-popover placement="top" trigger="hover">
                                    <p>申请人（联系方式）: {{ scope.row.claimer }}</p>
                                    <p>申请理由: {{ scope.row.event }}</p>
                                    <div class="name-wrapper" slot="reference">
                                        <el-tag size="medium">{{ scope.row.claimer }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        @click="handleRejected(scope.row)"
                                        size="mini"
                                        type="primary">驳回
                                </el-button>
                                <el-button
                                        @click="handleDistribution(scope.$index, scope.row)"
                                        size="mini"
                                        type="success">分配
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<span slot="footer" class="dialog-footer">
                        <el-button @click="messageDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="messageDialogVisible = false">确 定</el-button>
                    </span>-->
                </el-dialog>


                <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
                    <el-table :data="tableData" max-height="400px" style="width: 100%">
                        <el-table-column label="使用时段">
                            <template slot-scope="scope">
                                <svg-icon icon-class="startTime"></svg-icon>
                                <span>{{ scope.row.startTime }}</span>
                                <span> - </span>
                                <svg-icon icon-class="endTime"></svg-icon>
                                <span>{{ scope.row.endTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="车辆">
                            <template slot-scope="scope">
                                <el-popover placement="top" trigger="hover">
                                    <p>流水号: {{ scope.row.aid }}</p>
                                    <p>车辆ID: {{ scope.row.cid }}</p>
                                    <p>驾驶员ID: {{ scope.row.pid }}</p>
                                    <div class="name-wrapper" slot="reference">
                                        <el-tag size="medium">{{ scope.row.event }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-badge :value="activities" class="item">
                        <el-button @click="getTableData('nottravel','待出车')" class="el-buttons" type="warning">
                            <svg-icon icon-class="activities"></svg-icon>
                            <span style="margin-left: 10px">待出车</span>
                        </el-button>
                    </el-badge>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-badge :value="achieve" class="item">
                        <el-button @click="getTableData('travel','出车中')" class="el-buttons" type="primary">
                            <svg-icon icon-class="underway"></svg-icon>
                            <span style="margin-left: 10px">出车中</span>
                        </el-button>
                    </el-badge>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-badge :value="success" class="item">
                        <el-button @click="getTableData('accomplish','已完成')" class="el-buttons" type="success">
                            <svg-icon icon-class="success"></svg-icon>
                            <span style="margin-left: 10px">已完成</span>
                        </el-button>
                    </el-badge>
                </div>
            </el-col>
        </el-row>

        <div class="el-row">
            <el-row>
                <el-card>
                    <ve-line :data="lineData" :settings="lineSettings"/>
                </el-card>
            </el-row>
        </div>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <ve-ring :data="ringData" :settings="chartSettings" class=""></ve-ring>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple center">
                        <ve-funnel :data="funnelData"></ve-funnel>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple center">
                        <ve-radar :data="radarData"></ve-radar>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="el-row">
            <el-calendar v-model="value">
            </el-calendar>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            this.lineExtend = {
                series: {
                    label: {
                        normal: {
                            show: true
                        }
                    }
                }
            };
            this.chartSettings = {
                roseType: 'radius'
            };
            this.lineSettings = {
                stack: {'T': ['日完成率', '日发车量', '日完成量', '累计完成量', '累计发车量']},
                area: true
            }
            return {
                messageDialogVisible: false,
                dialogVisible: false,
                messageTableData: [{
                    applyid: '',
                    startTime: '',
                    endTime: '',
                    claimer: '',
                    event: ''
                }],
                tableData: [],
                /*折线图*/
                lineData: {
                    columns: ['日期', '日发车量', '日完成量', '累计发车量', '累计完成量', '日完成率'],
                    rows: []
                },
                /*饼图*/
                ringData: {
                    columns: ['日期', '日发车量', '日完成量', '累计发车量', '累计完成量', '日完成率'],
                    rows: [
                        {'日期': '1/1', '日发车量': 13, '日完成量': 10, '日完成率': 0.32},
                        {'日期': '1/2', '日发车量': 35, '日完成量': 32, '日完成率': 0.26},
                        {'日期': '1/3', '日发车量': 2923, '日完成量': 26, '日完成率': 0.76},
                        {'日期': '1/4', '日发车量': 1723, '日完成量': 14, '日完成率': 0.49},
                        {'日期': '1/5', '日发车量': 3792, '日完成量': 3492, '日完成率': 0.323},
                        {'日期': '1/6', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                        {'日期': '1/7', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                    ]
                },
                /*漏斗图*/
                funnelData: {
                    columns: ['日期', '日发车量', '日完成量', '日完成率'],
                    rows: [
                        {'日期': '1/1', '日发车量': 13, '日完成量': 10, '日完成率': 0.32},
                        {'日期': '1/2', '日发车量': 35, '日完成量': 32, '日完成率': 0.26},
                        {'日期': '1/3', '日发车量': 2923, '日完成量': 26, '日完成率': 0.76},
                        {'日期': '1/4', '日发车量': 1723, '日完成量': 14, '日完成率': 0.49},
                        {'日期': '1/5', '日发车量': 3792, '日完成量': 3492, '日完成率': 0.323},
                        {'日期': '1/6', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                        {'日期': '1/7', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                    ]
                },
                /*雷达图*/
                radarData: {
                    columns: ['日期', '日发车量', '日完成量', '日完成率'],
                    rows: [
                        {'日期': '1/1', '日发车量': 13, '日完成量': 10, '日完成率': 0.32},
                        {'日期': '1/2', '日发车量': 35, '日完成量': 32, '日完成率': 0.26},
                        {'日期': '1/3', '日发车量': 2923, '日完成量': 26, '日完成率': 0.76},
                        {'日期': '1/4', '日发车量': 1723, '日完成量': 14, '日完成率': 0.49},
                        {'日期': '1/5', '日发车量': 3792, '日完成量': 3492, '日完成率': 0.323},
                        {'日期': '1/6', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                        {'日期': '1/7', '日发车量': 4593, '日完成量': 4293, '日完成率': 0.78},
                    ]
                },
                message: 0,
                activities: 0,
                achieve: 0,
                success: 0,
                title: '',
                value: new Date()
            }
        },
        created() {
            this.getMessage();
            this.getLineChartData();
        },
        methods: {
            getMessage() {
                this.$http.get('/index/message').then(res => {
                    this.message = res.data.data.message;
                    this.activities = res.data.data.activities;
                    this.achieve = res.data.data.achieve;
                    this.success = res.data.data.success;
                })
            },
            handleRejected(row) {
                const data = row.claimer;

                const email = data.split("（")[1].split("）")[0]
                this.$http.get('/index/' + email)
                this.$http.delete('/index/apply/' + row.applyid);
                this.getApply()
            },
            handleDistribution(index, row) {
                const data = row.event + '$' + row.claimer + '$' + row.startTime + '$' + row.endTime;
                window.sessionStorage.setItem(index, data);
                this.delete(row.applyid)
                this.$router.push(`/activity/create/${index}`)
            },
            delete(id) {
                this.$http.delete('/index/apply/' + id);
                this.getApply()
            },
            getApply() {
                this.$http.get('/index/apply').then(res => {
                    this.messageTableData = res.data.data;
                    this.messageDialogVisible = true
                })
            },

            getTableData(table, title) {
                this.title = title;
                this.$http.get('/index/' + table).then(res => {
                    this.tableData = res.data.data;
                    this.dialogVisible = true
                })
            },

            getLineChartData() {
                this.$http.get('/index/line').then(res => {
                    this.lineData.rows = res.data.data;
                })
            }
        }
    }
</script>


<style lang="scss" scoped>
    .row {
        width: 25%;
    }

    .el-row {
        margin-bottom: 10px;
        margin-top: 10px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .center {
        margin-left: 40px;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #f9f9ff;
    }

    .bg-purple {
        background: #F9F9F9;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 90px;
    }

    .el-buttons {
        height: 90px;
        width: 100%;
    }

    .item {
        margin-top: 3px;
        margin-right: 20px;
        width: 100%;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
