<template>
	<div class="editTest">
		<!-- 选择试卷 -->
		<div class="item">1.选择试卷</div>
		<div class="paper">
			<div style="height: 40px;line-height: 40px;">已选择的试卷：<span class="sel">{{selectPaper}}</span>
				<router-link tag="a" target="_blank" :to="{ name : 'PaperDetailPaper' , params : { id : paperID } }">
					试卷预览
				</router-link>
			</div>
			<el-form :inline="true" :model="infoForm">
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
				<div class="flex" style="width: 100%;">
					<div class="student" v-for="(item,index) in studentList" @click="clickStu(item,index)" :class="{'isShow':item.isShow}">
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
				<el-table-column prop="operate" label="操作" width="250">
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
				<el-table-column prop="operate" label="操作" width="250">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click='invigilatorHandle(scope.$index, scope.row)' plain>添加到监考</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 底部 -->
		<div class="footer1">
			<el-button @click="save()">保存修改</el-button>
			<el-button @click="cancel()">取消修改</el-button>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	import { mapMutations, mapState, mapActions } from 'vuex'
	export default {
		props: ['id'],
		data() {
			return {
				Exteacher: '', //阅卷老师所在班级
				Inteacher: '', //监考老师所在班级
				tableData: [], //阅卷老师的
				IntableData: [], //监考老师的
				ChartMap: "", //阅卷老师架构
				InvigilatorMap: "", //监考老师架构
				currentPage: 1, //当前页数
				pagesize: 8, //一页几条
				search: '', // 搜索框	
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
				// selStudent: [], //选择的学生
				arr: [], //下拉框是否选择过
				classList: [], //班级列表
				studentList: [], //学生列表
				stuListDialog: false, //学生列表的模态框
				allNum: "", //所有参考人数
				loadStu: [], //载入的已选择的学生id
				selectPaper: '暂无', //已选择的试卷
				paperID: "",
				infoForm: {
					ID: "",
					PaperID: "",
					Name: "",
					Category: "",
					StartTime: "",
					Length: 120,
					Course: this.Course,
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
			this.loadInfo()
			this.loadList()
			this.loadType()
			this.loadStuList()
		},
		computed: {
			...mapState(['userInfo'])
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
			...mapActions(['loadInfo']),
			// 点击学生选择或取消
			clickStu(item, index) {
				if (item.isShow == true) {
					this.allNum = this.allNum - 1
					// 删除学生
					var data = {
						"FuncCode": "DelExI",
						"Data": [
							[{ "num": this.allNum }],
							[{
								"ExamID": this.infoForm.ID,
								"Classes": item.ChartMap,
								"StudentID": item.ID
							}],
						],
					}
					Joggle.del({ Content: JSON.stringify(data) }).then((response) => {
						if (response.indexOf("Fail:") == -1) {
							item.isShow = false
							this.$message.success('成功删除该考生');
							this.loadStu.pop(item.ID) //选中的学生ID
						} else {
							this.$message.warning(response);
						}
					}).catch((response) => {
						this.$message.error(error);
					})
				} else {
					// 添加学生
					this.allNum = this.allNum + 1
					var data = {
						"FuncCode": "AddExI",
						"Data": [
							[{ "num": this.allNum }],
							[{
								"ExamID": this.infoForm.ID,
								"Classes": item.ChartMap,
								"StudentID": item.ID
							}],
						],
					}
					Joggle.post(data).then((response) => {
						if (response.indexOf("Fail:") == -1) {
							item.isShow = true
							this.$message.success('成功添加该考生');
							this.loadStu.push(item.ID) //选中的学生ID
						} else {
							this.$message.warning(response);
						}
					}).catch((response) => {
						this.$message.error(error);
					})
				}
			},
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
			// 选择班级的架构改变
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
			// 点击确认修改
			async save() {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.infoForm.UpdateDate = time
				this.infoForm.Invigilator = this.Inteacher + " " + this.infoForm.Invigilator
				this.infoForm.Examiner = this.Exteacher + " " + this.infoForm.Examiner
				// 修改考试头
				var data = {
					"FuncCode": "ChgExH",
					"Data": [
						[{ ...this.infoForm }],
					],
				}
				this.$refs.infoForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('修改考试成功');
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
				this.paperID = item.ID
				this.infoForm.Course = item.Course
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
							null,
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
			// 载入信息
			async loadStuList() {
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
									this.arr.push(jsonObj.ID)
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
			},
			// 载入
			async loadList() {
				this.infoForm.Creator = this.userInfo.Name
				this.infoForm.CreatorID = sessionStorage.id
				// 获取架构列表
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
	.editTest {
		font-size: 14px;

		a {
			color: #2C3E50;
			size: 14px;
		}

		.flex {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		.el-breadcrumb {
			margin-bottom: 20px;
		}

		.el-form-item {
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.block {
			margin-bottom: 10px;
		}

		// 分割线
		.el-divider {
			margin: 0;
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

		//底下那一条
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

			// 符合条件的试卷
			.all {
				display: flex;
				flex-wrap: wrap;

				.active {
					background-color: rgb(226, 243, 253);
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
					border: 2px solid rgb(22, 89, 129);
					background-color: rgb(226, 243, 253);
				}
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
