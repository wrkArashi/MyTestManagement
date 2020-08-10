<template>
	<div class="courseAll">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>课程公示</el-breadcrumb-item>
			<el-breadcrumb-item>我的课程</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button @click="handleNew" plain style="margin:20px 0">＋新建课程</el-button>
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
		 :row-class-name="tableRowClassName">
			<el-table-column prop="Name" label="课程名称" width=""></el-table-column>
			<el-table-column prop="Scores" label="学分" width=""></el-table-column>
			<el-table-column prop="WeekPeriod" label="周课时" width=""></el-table-column>
			<el-table-column prop="TotalPeriod" label="总课时" width=""></el-table-column>
			<el-table-column prop="Book" label="教材" width=""></el-table-column>
			<el-table-column prop="Target" label="教学目标" width=""></el-table-column>
			<el-table-column prop="ChartMap" label="所属架构" width=""></el-table-column>
			<el-table-column prop="UpdateDate" label="更新时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column align="right" width="250px">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入课程名称搜索" />
				</template>
				<template slot-scope="scope">
					<router-link :to="{ name : 'CourseDetail' , params : { id : scope.row.ID } }" style="margin-right: 10px;">
						<el-button size="mini" type="primary" plain>详情</el-button>
					</router-link>
					<router-link :to="{ name : 'CourseEdit' , params : { id : scope.row.ID } }" style="margin-right: 10px;">
						<el-button size="mini" type="primary" plain>编辑</el-button>
					</router-link>
					<el-button size="mini" type="danger" @click='delHandle(scope.$index, scope.row)' plain>
						删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
		<el-dialog title="添加课程" :visible.sync="dialogNew" :close-on-click-modal="false" :destroy-on-close="true" :showClose="false">
			<el-form :model="headerForm" :rules="rules" ref="headerForm" label-width="85px" class="demo-ruleForm">
				<el-form-item label="所属架构:" prop="ChartMap">
					<el-cascader :show-all-levels="false" :props="defaultParams" :options="options" v-model="headerForm.ChartMap"
					 @change="ChangeMap" placeholder="请选择专业名称"></el-cascader>
				</el-form-item>
				<el-form-item label="课程名称:" prop="Name">
					<el-input v-model="headerForm.Name"></el-input>
				</el-form-item>
				<el-form-item label="所属教材:" prop="Book">
					<el-input v-model="headerForm.Book"></el-input>
				</el-form-item>
				<el-form-item label="教材图片:" prop="Photo">
					<input @change='Photo' type="file">
					<img :src="headerForm.Photo" class="img" ref="img" style="max-height: 300px;" />
				</el-form-item>
				<el-form-item label="学分:" prop="Scores">
					<el-input v-model.number="headerForm.Scores" placeholder="例:2"></el-input>
				</el-form-item>
				<el-form-item label="周课时:" prop="WeekPeriod">
					<el-input v-model.number="headerForm.WeekPeriod" placeholder="例:5"></el-input>
				</el-form-item>
				<el-form-item label="总课时:" prop="TotalPeriod">
					<el-input v-model.number="headerForm.TotalPeriod" placeholder="例:5"></el-input>
				</el-form-item>
				<el-form-item label="教学目标:" prop="Target">
					<el-input type="textarea" v-model="headerForm.Target"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-footer1">
				<el-button @click="dialogNew = false">取 消</el-button>
				<el-button type="primary" @click="sureSubmit()">确 定</el-button>
			</div>
			<el-upload class="upload-demo" action="http://27.223.90.126:7777/Core/UploadFile" :on-success="handleSuccessFile"
			 :on-error="handleError" :before-upload="beforeUploadFile" multiple :file-list="fileList" accept=".pdf" :headers="importHeaders"
			 v-if="Fileshow">
				<el-button size="small" plain="">点击选择课程文件</el-button>
				<span>*只能上传pdf文件</span>
			</el-upload>
			<el-upload class="upload-demo1" action="http://27.223.90.126:7777/Core/UploadFile" :on-success="handleSuccessVideo"
			 :on-error="handleError" :before-upload="beforeUploadVideo" multiple :file-list="videoList" accept=".mp4" :headers="importHeaders"
			 v-if="Fileshow">
				<el-button size="small" plain="">点击选择课程资源</el-button>
				<span>*只能上传mp4文件且不大于2000M</span>
			</el-upload>
			<div slot="footer" class="dialog-footer" v-if="Fileshow">
				<el-button type="primary" @click="sure()">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	var mytoken = sessionStorage.token
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				videoname: '',
				filename: '',
				Fileshow: false,
				importHeaders: { token: mytoken },
				fileList: [],
				videoList: [],
				search: '', // 搜索
				currentPage: 1, // 分页
				pagesize: 10,
				tableData: [],
				dialogNew: false, //新建弹框
				options: [], //所属架构
				defaultParams: {
					checkStrictly: true,
					label: 'Name',
					value: 'ID',
					children: 'children'
				}, //所属架构
				headerForm: {
					"ID": "",
					"Name": "",
					"Photo": '',
					"Scores": '',
					"WeekPeriod": '',
					"TotalPeriod": '',
					"Book": '',
					"Target": '',
					"ChartMap": '',
					"CreatorID": '',
					"CreateDate": '',
					"UpdateDate": '',
				},
				rules: {
					Name: { required: true, message: '课程名称不能为空', trigger: 'blur' },
					Scores: { required: true, type: 'number', message: '学分必须为数字值且不能为空', trigger: 'blur' },
					WeekPeriod: { required: true, type: 'number', message: '周课时必须为数字值且不能为空', trigger: 'blur' },
					TotalPeriod: { required: true, type: 'number', message: '总课时必须为数字值且不能为空', trigger: 'blur' },
					Target: { required: true, message: '教学目标不能为空', trigger: 'blur' },
					Book: { required: true, message: '所属教材不能为空', trigger: 'blur' },
					ChartMap: { required: true, message: '所属架构不能为空', trigger: 'blur' },
				},
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			// 删除课程信息
			async delHandle(index, row) {
				row.Photo = null
				var data = {
					"FuncCode": "DelCozH",
					"Data": [
						[{ ...row }]
					]
				}
				Joggle.del({ Content: JSON.stringify(data) })
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							this.$message.success('删除成功')
							this.loadList()
						} else {
							this.$message.warning(response)
						}
					})
			},
			// 关闭框
			sure() {
				this.$refs['headerForm'].resetFields()
				this.dialogNew = false
				this.loadList()
			},
			// 上传pdf文件之前
			beforeUploadFile(file) {
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
				if (extension !== 'pdf') {
					this.$message.warning('只能上传pdf文件')
					return false
				}
			},
			// 上传video之前
			beforeUploadVideo(file) {
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
				let size = file.size / 1024 / 1024
				if (extension !== 'mp4') {
					this.$message.warning('只能上传mp4文件')
					return false
				}
				if (size > 2000) {
					this.$message.warning('文件大小不得超过2000M')
					return false
				}
			},
			// pdf成功
			handleSuccessFile(res, file, fileList) {
				if (res.indexOf("Fail:") == -1) {
					this.filename = res
					var data = {
						"FuncCode": "AddCozF",
						"Data": [
							[{
								"CouresID": this.headerForm.ID,
								"Filename": this.filename
							}]
						]
					}
					Joggle.post(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加课程文件成功');
								this.loadList()
							} else {
								this.$message.warning(response);
							}
						})
				} else {
					this.$message.warning(res);
				}
			},
			// video成功
			handleSuccessVideo(res, file, videoList) {
				if (res.indexOf("Fail:") == -1) {
					this.videoname = res
					var data = {
						"FuncCode": "AddCozM",
						"Data": [
							[{
								"CouresID": this.headerForm.ID,
								"Filename": this.videoname
							}]
						]
					}
					Joggle.post(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加课程资源成功');
								this.loadList()
							} else {
								this.$message.warning(response);
							}
						})
				} else {
					this.$message.warning(res);
				}
			},
			//失败
			handleError(err, file, fileList) {
				this.$notify.error({
					title: '错误',
					message: `文件上传失败`
				});
			},
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return;
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 载入列表
			loadList() {
				var data = {
					"FuncCode": "GetCozHList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null
						]
					}
				}
				Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 完成新建
			sureSubmit() {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.headerForm.ID = timestamp.toString()
				this.headerForm.CreatorID = sessionStorage.id
				this.headerForm.CreateDate = time
				this.headerForm.UpdateDate = time
				var data = {
					"FuncCode": "AddCozH",
					"Data": [
						[{ ...this.headerForm }]
					]
				}
				this.$refs.headerForm.validate(
					async (valid) => {
						if (valid) {
							await Joggle.post(data)
								.then((response) => {
									if (response.indexOf("Fail:") == -1) {
										this.$message.success('添加课程成功');
										this.Fileshow = true
									} else {
										this.$message.warning(response);
									}
								})
						}
					})

			},
			// count: 当前层级，data: 当前层级的数据，maxNum: 最多不能超过几级
			setDisable(count, data, maxNum) {
				if (count > maxNum) { //最多几级就写几
					data.forEach(v => {
						v.disabled = true // 超过设定的最大级数,给这一集的数据添加disabled属性
					})
				} else {
					data.forEach(v => {
						v.count = count // 设置最外层数据的初始count
						if (v.children && v.children.length) {
							v.count++
							this.setDisable(v.count, v.children, maxNum) // 子级循环时把这一层数据的count传入
						}
					})
				}
			},
			// 点击新建
			handleNew() {
				this.dialogNew = true
				// 获取架构列表
				var data = {
					"FuncCode": "GetChList",
					"Data": {
						"Params": [
							"UniChart"
						]
					}
				}
				Joggle.get(data).then((response) => {
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
						// 限制只能添加4级分类
						this.setDisable(1, formatArray, 3)
						this.options = formatArray
					} else {
						this.$message.warning(response)
					}
				})
			},
			// 所属架构
			ChangeMap(value) {
				this.headerForm.ChartMap = value[value.length - 1]
			},
			// 教材图片
			Photo(event) {
				var reader = new FileReader(); //创建读取文件的方法
				var img = event.target.files[0];
				reader.readAsDataURL(img); //将文件已url的形式读入页面
				var that = this;
				reader.onload = function(e) {
					that.headerForm.Photo = reader.result;
				}
			},
		}
	}
</script>

<style lang="scss">
	.courseAll {
		.upload-demo {
			margin-bottom: 20px;
		}

		.dialog-footer1 {
			margin-bottom: 20px;
			text-align: right
		}

		.block {
			margin-top: 20px;
		}

		.el-table .blue-row {
			background: aliceblue;
		}
	}
</style>
