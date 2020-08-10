<template>
	<div class="testNew">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>考试&监控</el-breadcrumb-item>
			<el-breadcrumb-item>新建考试</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 选择试卷 -->
		<div class="item">1.选择试卷</div>
		<div class="paper">
			<div style="height: 40px;line-height: 40px;">已选择的试卷：<span class="sel">{{selectPaper}}</span></div>
			<el-form :inline="true">
				<el-form-item label="课程:">
					<el-select v-model="Type" placeholder="请选择类别">
						<el-option v-for="item in optionsFirst" :label="item.Category" :value="item.Category" :key="item.Category"></el-option>
					</el-select>
					<el-select v-model="Course" placeholder="请选择课程">
						<el-option v-for="item in optionsSecond" :key="item.ID" :label="item.Name" :value="item.Name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="searchPaper">搜索试卷</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="search" size="mini" placeholder="输入试卷名称搜索" />
				</el-form-item>
			</el-form>
			<!-- 选出来的所有试卷 -->
			<div class="all">
				<!-- 每块选出来的试卷 -->
				<div :class="{'active':index==active}" @click="selPaper(item,index)" class="list" v-for="(item,index) in paperList.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase())) ">
					<div style="line-height: 32px;">{{item.Name}}</div>
					<el-divider></el-divider>
					<div style="line-height: 32px;">课程： {{item.Course}}</div>
					<div style="line-height: 32px;">试卷总分： {{item.Scores}}分</div>
					<router-link tag="a" target="_blank" :to="{ name : 'PaperDetailPaper' , params : { id : item.ID } }">
						<el-button type="mini" plain class="see">试卷预览</el-button>
					</router-link>
				</div>
			</div>
			<!-- 分页 -->
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="[4, 8, 12, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="paperList.length">
				</el-pagination>
			</div>
		</div>
		<!-- 考试信息 -->
		<div class="item">2.考试信息</div>
		<div class="info">
			<el-form :inline="true" ref="infoForm" :model="infoForm" :rules="rules">
				<el-form-item label="考试名称:" prop="Name">
					<el-input v-model="infoForm.Name" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="开考时间:" prop="StartTime">
					<el-date-picker v-model="infoForm.StartTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
					</el-date-picker>
				</el-form-item>
				</el-form-item>
				<el-form-item label="考试时长(分钟):" prop="Length">
					<el-input v-model="infoForm.Length" type="number" placeholder="请输入数字"></el-input>
				</el-form-item>
				<el-form-item label="考试类型:" prop="Category">
					<el-radio-group v-model="infoForm.Category">
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
				<el-form-item label="所属架构:">
					<el-cascader ref="myCascader" v-model="stuMap" :show-all-levels="false" :props="defaultParams" :options="options"
					 placeholder="请选择班级" @change="handleChange"></el-cascader>
				</el-form-item>
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
						<el-button @click="selStu(item,index)" size="mini">选择学生</el-button>
					</div>
				</div>
			</div>
			<!-- 学生列表的模态框 -->
			<el-dialog title="学生信息" :visible.sync="stuListDialog" width="35%" :close-on-click-modal="false"
			 :close-on-press-escape="false" :show-close="false">
				<div class="flex">
					<div class="student" v-for="(item,index) in studentList" @click="clickStu(item,index)" :class="{'isShow':item.isShow}">
						<div class="list">学生姓名： {{item.Name}}</div>
						<div class="list">学生编号： {{item.ID}}</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="stuSure()">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<!-- 选择老师 -->
		<div class="item">4.其他设置</div>
		<div class="other">
			<!-- 阅卷老师 -->
			<el-form ref="infoForm" :model="infoForm" :rules="rules" :inline="true">
				<el-form-item label="请选择阅卷老师:" prop="ChartMap">
					<el-cascader ref="selExTeacher" :show-all-levels="false" :props="defaultParams" :options="options" v-model="ChartMap"
					 placeholder="请选择老师"></el-cascader>
				</el-form-item>
				<el-form-item>
					<div>已分配的阅卷教师 :
						<el-button class="sel">{{Exteacher}}/{{infoForm.Examiner}}</el-button>
					</div>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" stripe>
				<el-table-column prop="Name" label="姓名"></el-table-column>
				<el-table-column prop="operate" label="操作" width="200">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click='examinerHandle(scope.$index, scope.row)' plain>添加到阅卷</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-form ref="infoForm" :model="infoForm" :rules="rules" :inline="true">
				<el-form-item label="请选择监考老师:" prop="InvigilatorMap">
					<el-cascader ref="selInTeacher" :show-all-levels="false" :props="defaultParams" :options="options" v-model="InvigilatorMap"
					 placeholder="请选择老师"></el-cascader>
				</el-form-item>
				<el-form-item>
					<div>已分配的监考教师 :
						<el-button class="sel">{{Inteacher}}/{{infoForm.Invigilator}}</el-button>
					</div>
				</el-form-item>
			</el-form>
			<el-table :data="IntableData" stripe>
				<el-table-column prop="Name" label="姓名"></el-table-column>
				<el-table-column prop="operate" label="操作" width="200">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click='invigilatorHandle(scope.$index, scope.row)' plain>添加到监考</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 底部 -->
		<div class="footer">
			<el-button @click="save()">保存考试</el-button>
			<el-button @click="cancel()">取消新建</el-button>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				Exteacher: '', //阅卷老师所在班级
				Inteacher: '', //监考老师所在班级
				tableData: [], //阅卷老师的列表
				IntableData: [], //监考老师的列表
				ChartMap: "", //阅卷老师架构
				InvigilatorMap: "", //监考老师架构
				currentPage: 1, //当前页数
				pagesize: 8, //一页几条
				search: '', // 搜索	
				defaultParams: {
					label: 'Name',
					value: 'ID',
					children: 'children'
				}, //自己构建树状
				options: [], //所属架构
				paperList: [], //搜索出的试卷
				optionsFirst: [], //级联框1
				optionsSecond: [], //级联框2
				Type: "", //类别
				Course: "", //课程
				active: null, //点击要选择的试卷时的class
				stuMap: [], //学生所属架构
				selStudent: [], //选择的学生
				arr: [], //下拉框是否选择过
				classList: [], //班级列表
				studentList: [], //学生列表
				stuListDialog: false, //学生列表的模态框
				allNum: 0, //所有参考人数
				Classes: [], //提交用
				StudentID: [], //提交用
				className: [], //选择的班级名称
				selectPaper: '暂无', //已选择的试卷
				infoForm: {
					ID: "",
					PaperID: "",
					Name: "",
					Category: "模拟考试",
					StartTime: "",
					Length: 120,
					Coures: this.Course,
					Counts: "",
					Invigilator: "暂无", //监考老师
					Examiner: "暂无", //阅卷老师
					Status: "inactive",
					CreatorID: "",
					Creator: "",
					CreateDate: "",
					UpdateDate: "",
				},
				rules: {
					StartTime: { required: true, message: '不能为空', trigger: 'blur' },
					Name: { required: true, message: '不能为空', trigger: 'blur' },
					Length: { required: true, message: '不能为空', trigger: 'blur' },
					Category: { required: true, message: '不能为空', trigger: 'blur' },
				}
			}
		},
		created() {
			this.loadList()
			this.loadType()
		},
		watch: {
			// 当类别变化的时候，获取课程
			'Type': function(newValue, oldValue) {
				this.getCourse(newValue);
			},
			// 当架构变化时，获取阅卷教师列表
			"ChartMap": function(newValue, oldValue) {
				this.getTeacher(newValue)
			},
			// 当架构变化时，获取监考教师列表
			"InvigilatorMap": function(newValue, oldValue) {
				this.getInTeacher(newValue)
			},
		},
		methods: {
			// 点击学生信息的 确定
			stuSure() {
				this.stuListDialog = false
				if (this.className.indexOf(this.studentList[0].ChartMap) == -1) {
					this.className.push(this.studentList[0].ChartMap)
					this.selStudent.push(this.studentList) //选择的学生列表 
				}
			},
			// 点击学生选择或取消
			clickStu(item, index) {
				if (item.isShow == true) {
					item.isShow = false
					this.allNum = this.allNum - 1
				} else {
					item.isShow = true
					this.allNum = this.allNum + 1
				}
			},
			// 点击选择学生√
			async selStu(item, index) {
				if (this.className.indexOf(item.ID) > -1) {
					this.studentList = this.selStudent[index]
				} else {
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
							jsonObj.forEach(item => {
								this.$set(item, 'isShow', true)
							})
							this.studentList = jsonObj //学生列表
							this.allNum = this.allNum + jsonObj.length
						}
					})
				}
				this.stuListDialog = true
			},
			// 当选择班级的架构变化时√
			async handleChange(value) {
				var data = {
					"FuncCode": "GetCls",
					"Data": {
						"Params": [
							value[value.length - 1]
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						if (this.arr.indexOf(value[value.length - 1]) > -1) {
							alert('已选择该班级')
						} else {
							this.classList.push(jsonObj) //班级列表
							// var counts = parseInt(jsonObj.Counts) //本班人数
							this.arr.push(value[value.length - 1])
						}
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 取消新建
			cancel() {
				this.$router.push('/test/mine')
			},
			// 添加到阅卷
			examinerHandle(index, row) {
				this.infoForm.Examiner = row.Name
			},
			// 添加到监考
			invigilatorHandle(index, row) {
				this.infoForm.Invigilator = row.Name
			},
			// 点击保存考试
			async save() {
				for (var i = 0; i < this.selStudent.length; i++) {
					for (var j = 0; j < this.selStudent[i].length; j++) {
						if (this.selStudent[i][j].isShow == true) {
							this.StudentID.push(this.selStudent[i][j].ID)
							this.Classes.push(this.selStudent[i][j].ChartMap)
						}
					}
				}
				this.infoForm.ID = new Date().getTime().toString()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.infoForm.CreateDate = time
				this.infoForm.UpdateDate = time
				this.infoForm.Invigilator = this.Inteacher + " " + this.infoForm.Invigilator
				this.infoForm.Examiner = this.Exteacher + " " + this.infoForm.Examiner
				this.infoForm.Counts = this.allNum
				var ExamItems = new Array();
				for (var i = 0; i < this.allNum; i++) {
					var info = {
						"ExamID": this.infoForm.ID,
						"Classes": this.Classes[i],
						"StudentID": this.StudentID[i],
					};
					ExamItems.push(info);
				}
				var data = {
					"FuncCode": "AddEx",
					"Data": [
						[{ ...this.infoForm }],
						ExamItems,
					],
				}
				this.$refs.infoForm.validate(async (valid) => {
					if (valid) {
						await Joggle.post(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加考试成功');
								this.$router.push('/test/mine')
							} else {
								this.$message.warning(response);
							}
						}).catch((response) => {
							this.$message.error(error);
						})
					}
				})
			},
			// 点击要选择的试卷
			selPaper(item, index) {
				this.selectPaper = item.Name
				this.active = index
				this.infoForm.PaperID = item.ID
				this.infoForm.Coures = item.Course
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 搜索试卷
			async searchPaper() {
				if (this.Course == "") {
					this.Course = null
				}
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							sessionStorage.id, //要删的！！！！！！！！！！！！！！！
							this.Course,
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.paperList = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 载入
			async loadList() {
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
				// 获取架构列表√
				var data = {
					"FuncCode": "GetChList",
					"Data": {
						"Params": [
							"UniChart"
						]
					}
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						let res = JSON.parse(response)
						// 第一次是将全部的permissionId作为对象的key重组成一个对象
						let formatObj = res.reduce((pre, cur) => {
							return { ...pre, [cur['ID']]: cur }
						}, {});

						let formatArray = res.reduce((arr, cur) => {
							let PID = cur.PID ? cur.PID : 0;
							let parent = formatObj[PID];
							if (parent) {
								parent.children ? parent.children.push(cur) : parent.children = [cur];
							} else {
								arr.push(cur)
							}
							return arr;
						}, []);
						this.options = formatArray
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 获取分类（载入时）
			async loadType() {
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							null
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.optionsFirst = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 获取课程
			async getCourse() {
				this.Course = ""
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							this.Type
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.optionsSecond = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 获取阅卷教师
			async getTeacher(newValue) {
				this.infoForm.Examiner = ""
				this.Exteacher = this.$refs.selExTeacher.getCheckedNodes()[0].pathLabels[newValue.length - 1]
				var data = {
					"FuncCode": "GetTList",
					"Data": {
						"Params": [
							newValue[newValue.length - 1]
						]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							this.tableData = jsonObj
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
			},
			// 获取监考老师
			async getInTeacher(newValue) {
				this.infoForm.Invigilator = ""
				this.Inteacher = this.$refs.selInTeacher.getCheckedNodes()[0].pathLabels[newValue.length - 1]
				var data = {
					"FuncCode": "GetTList",
					"Data": {
						"Params": [
							newValue[newValue.length - 1]
						]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							this.IntableData = jsonObj
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
			}
		}
	}
</script>

<style lang="scss">
	.testNew {
		font-size: 14px;

		.flex {
			display: flex;
			flex-wrap: wrap;
		}

		// 每一条√
		.item {
			padding: 10px 5px;
			border: 1px solid rgb(217, 217, 217);
			font-weight: 600;
		}

		.el-breadcrumb {
			margin-bottom: 20px;
		}

		.el-form-item {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.block {
			padding-bottom: 10px;
		}

		// 分割线
		.el-divider {
			margin: 0;
		}

		//底下那一条
		.footer {
		margin-top: 30px;
			text-align: center;
		}


		//选择试卷
		.paper {
			background-color: white;
			padding: 5px;

			// 已选择的试卷
			.sel {
				padding: 3px 5px;
				border: 1px solid #CCCCCC;
			}

			// 符合条件的试卷
			.all {
				display: flex;
				flex-wrap: wrap;

				.active {
					background-color: rgb(236, 245, 255);
				}

				.list {
					margin-right: 20px;
					border: 2px solid rgb(227, 227, 227);
					width: 350px;
					margin-bottom: 10px;
					padding: 0 8px;

					.see {
						margin: 10px 0;
					}
				}

				.list:hover {
					border: 2px solid rgb(67, 73, 121);
					background-color: rgb(236, 245, 255);
				}
			}
		}

		// 信息
		.info {
			background-color: white;
			padding: 5px;
		}

		// 添加班级
		.add {
			background-color: white;
			padding: 5px;

			// 班级列表√
			.class {
				height: 100px;
				width: 300px;
				border: 2px solid rgb(67, 73, 121);
				background-color: rgb(236, 245, 255);
				padding: 5px;
				margin: 0 10px 10px 0;

				.flex {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between
				}

				.list {
					line-height: 32px;
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
				border: 2px solid rgb(67, 73, 121);
				background-color: rgb(236, 245, 255);
			}
		}

		.other {
			background-color: white;
			padding: 5px 5px 15px 5px;

			.sel {
				margin-right: 5px;
				padding: 3px 5px;
				border: 1px solid #CCCCCC;
			}
		}
	}
</style>
