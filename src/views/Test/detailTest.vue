<template>
	<div class="detailTest">
		<!-- 选择试卷 -->
		<div class="item">1.选择试卷</div>
		<div class="paper">
			<div style="height: 40px;line-height: 40px;">已选择的试卷：<span class="sel">{{selectPaper}}</span>
				<router-link tag="a" target="_blank" :to="{ name : 'PaperDetailPaper' , params : { id :paperID} }">
					试卷预览
				</router-link>
			</div>
		</div>
		<!-- 考试信息 -->
		<div class="item">2.考试信息</div>
		<div class="info">
			<el-form :inline="true" ref="infoForm" :model="infoForm">
				<el-form-item label="考试名称:" prop="Name">
					<el-input v-model="infoForm.Name" style="width: 300px;" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="开考时间:" prop="StartTime">
					<el-date-picker v-model="infoForm.StartTime" type="datetime" placeholder="选择日期时间" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒"
					 value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px" :disabled="true"></el-date-picker>
				</el-form-item>
				</el-form-item>
				<el-form-item label="考试时长(分钟):" prop="Length">
					<el-input v-model="infoForm.Length" type="number" placeholder="请输入数字" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="考试类型:" prop="Category">
					<el-radio-group v-model="infoForm.Category" :disabled="true">
						<el-radio label="期末考试"></el-radio>
						<el-radio label="模拟考试"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</div>
		<!-- 添加考生 -->
		<div class="item">3.添加考生</div>
		<div class="add">
			<el-form :inline="true">
				<el-form-item label="参考人数:">
					{{allNum}}
				</el-form-item>
			</el-form>
			<!-- 选择的班级 -->
			<div class="flex">
				<div class="class" v-for="(item,index) in classList">
					<div class="list flex">
						<div style="font-weight: bold;"> {{item.Name}}</div>
					</div>
					<div class="list">{{item.CAS}}</div>
					<div class="list flex">
						<div>班级人数：{{item.Counts}}人</div>
						<el-button @click="selStu(item,index)" size="mini">查看学生</el-button>
					</div>
				</div>
			</div>
			<!-- 学生列表的模态框 -->
			<el-dialog title="学生信息" :visible.sync="stuListDialog" width="35%" :close-on-click-modal="false"
			 :close-on-press-escape="false" :show-close="false">
				<div class="flex">
					<div class="student" v-for="(item,index) in studentList" :class="{'isShow':item.isShow}">
						<div class="list">学生姓名： {{item.Name}}</div>
						<div class="list">学生编号： {{item.ID}}</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="stuSure()">关 闭</el-button>
				</span>
			</el-dialog>
		</div>
		<!-- 选择老师 -->
		<div class="item">4.其他设置</div>
		<div class="other">
			<el-form ref="infoForm" :model="infoForm" :inline="true">
				<el-form-item>
					<div>已分配的阅卷教师 :
						<el-button class="sel">{{teacher}}/{{infoForm.Examiner}}</el-button>
					</div>
				</el-form-item>
				<el-form-item>
					<div>已分配的监考教师 :
						<el-button class="sel">{{teacher}}/{{infoForm.Invigilator}}</el-button>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<!-- 底部 -->
		<div class="footer1">
			<el-button @click="save()">返回考试列表</el-button>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		props: ['id'],
		data() {
			return {
				classList: [], //班级列表
				studentList: [], //学生列表
				stuListDialog: false, //学生列表的模态框
				allNum: "", //所有参考人数
				loadStu: [], //载入的已选择的学生id
				selectPaper: '暂无', //已选择的试卷
				paperID: "",
				teacher: '',
				infoForm: {
					ID: "",
					PaperID: "",
					Name: "",
					Category: "",
					StartTime: "",
					Length: 120,
					Course: this.Course,
					Invigilator: "暂无", //监考老师
					Examiner: "暂无", //阅卷老师
					Status: "inactive",
					CreatorID: "",
					Creator: "",
					CreateDate: "",
					UpdateDate: "",
				},
			}
		},
		created() {
			this.loadList()
		},

		methods: {
			// 关闭模态框
			async stuSure() {
				this.stuListDialog = false
			},
			// 点击选择学生√
			async selStu(item, index) {
				var data = {
					"FuncCode": "GetSList",
					"Data": {
						"Params": [
							item.ID
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						for (var i = 0; i < jsonObj.length; i++) {
							if (this.loadStu.indexOf(jsonObj[i].ID) != -1) {
								jsonObj[i]['isShow'] = true
							} else(
								jsonObj[i]['isShow'] = false
							)
						}
						this.studentList = jsonObj //学生列表
					}
				})
				this.stuListDialog = true
			},
			// 点击返回
			async save() {
				this.$router.push('/test/list')
			},
			// 载入
			async loadList() {
				// 载入试卷信息
				this.paperID = this.id
				let id = this.id
				var data = {
					"FuncCode": "GetEx",
					"Data": {
						"Params": [id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.allNum = jsonObj.Table2.length //人数
						for (var i = 0; i < jsonObj.Table2.length; i++) {
							this.loadStu.push(jsonObj.Table2[i].StudentID) //选中的学生ID
						}
						this.selectPaper = jsonObj.Table3[0].Name //已选择试卷名称
						this.paperID = jsonObj.Table3[0].ID //已选择试卷的ID
						for (var i = 0; i < jsonObj.Table1.length; i++) {
							var data = {
								"FuncCode": "GetCls",
								"Data": {
									"Params": [
										jsonObj.Table1[i].Classes
									]
								},
							}
							Joggle.get(data).then((response) => {
								if (response.indexOf("Fail:") == -1) {
									var jsonObj = JSON.parse(response);
									this.classList.push(jsonObj) //班级列表
								} else {
									this.$message.warning(response);
								}
							})
						}
						this.infoForm = jsonObj.Table[0] //考试头的信息
					} else {
						this.$message.warning(response);
					}
				})
				// 获取用户信息
				var data = {
					"FuncCode": "GetUser",
					"Data": {
						"Params": [sessionStorage.id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						// 赋值用户名
						this.infoForm.Creator = jsonObj[0].Name
						this.infoForm.CreatorID = sessionStorage.id
					} else {
						this.$message.warning(response);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.detailTest {
		font-size: 14px;

		.flex {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		a {
			color: #2C3E50;
			size: 14px;
		}

		.el-breadcrumb {
			margin-bottom: 20px;
		}

		.el-form-item {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		// 每一条
		.item {
			border: 1px solid rgb(217, 217, 217);
			border-radius: 5px;
			padding: 5px;
			font-weight: 600;
			width: 100%;
			background-color: rgb(218, 240, 251);
		}

		//底
		.footer1 {
			margin-top: 20px;
			height: 50px;
			line-height: 50px;
			background-color: #CCCCCC;
			text-align: center;
		}

		//选择试卷
		.paper {

			// 已选择的试卷
			.sel {
				padding: 3px 5px;
				border: 1px solid #CCCCCC;
			}
		}

		// 添加班级
		.add {
			.flex {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
			}

			// 班级列表√
			.class {
				height: 100px;
				width: 300px;
				border: 2px solid rgb(22, 89, 129);
				background-color: rgb(226, 243, 253);
				padding: 5px;
				margin: 0 10px 10px 0;

				.flex {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between
				}

				.list {
					line-height: 32px;

					i:hover {
						color: rgb(24, 163, 255);
					}
				}
			}
		}

		// 学生列表
		.student {
			border: 2px solid rgb(227, 227, 227);
			padding: 5px;
			margin: 0 10px 10px 0;
			width: 185px;

			.list {
				line-height: 25px;
			}
		}

		.isShow {
			border: 2px solid rgb(22, 89, 129);
			background-color: rgb(226, 243, 253);
		}

		.other {
			.sel {
				margin-right: 5px;
				padding: 3px 5px;
				border: 1px solid #CCCCCC;
			}
		}

	}
</style>
