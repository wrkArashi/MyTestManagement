<template>
	<el-card class="box-card" id="course-list">
		<div slot="header">
			<span>课程管理</span>
			<el-button style="float: right; padding: 3px 0" type="text" @click="addHandle">添加课程</el-button>
		</div>
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
		 :row-class-name="tableRowClassName">
			<el-table-column prop="ID" label="编号" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="Category" label="类别" width=""></el-table-column>
			<el-table-column prop="Name" label="名称" width=""></el-table-column>
			<el-table-column prop="UserID" label="创建人编号" width=""></el-table-column>
			<el-table-column prop="Date" label="创建时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column align="right" width="200">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入名称搜索" />
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain><i class="el-icon-edit"></i>
						编辑</el-button>
					<el-button size="mini" type="danger" @click='delHandle(scope.$index, scope.row)' plain><i class="el-icon-delete"></i>
						删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
		<!-- 添加课程 -->
		<el-dialog title="添加课程" :visible.sync="dialogFormVisible" width="600px">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="类别" prop="Category" :label-width="formLabelWidth">
					<el-input v-model="form.Category"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="Name" :label-width="formLabelWidth">
					<el-input v-model="form.Name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="sure">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑课程 -->
		<el-dialog title="编辑课程" :visible.sync="editModalShow" :show-close='false' width="600px">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<!-- 				<el-form-item label="编号" prop="ID" :label-width="formLabelWidth">
					<el-input v-model="editForm.ID"></el-input>
				</el-form-item> -->
				<el-form-item label="类别" prop="Category" :label-width="formLabelWidth">
					<el-input v-model="editForm.Category"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="Name" :label-width="formLabelWidth">
					<el-input v-model="editForm.Name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="edit">完 成</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				// 搜索
				search: '',
				// 分页
				currentPage: 1,
				pagesize: 10,
				//载入课程 
				tableData: [],
				// 添加、编辑框
				dialogFormVisible: false,
				editModalShow: false,
				// 添加、编辑表单
				form: {
					ID: "",
					Category: "",
					Name: "",
					UserID: "",
					Date: ""
				},
				editForm: {
					ID: "",
					Category: "",
					Name: "",
					UserID: "",
					Date: ""
				},
				// 规则
				rules: {
					ID: { required: true, message: '请输入ID', trigger: 'blur' },
					Category: { required: true, message: '请输入类别', trigger: 'blur' },
					Name: { required: true, message: '请输入名称', trigger: 'blur' },
				},
				formLabelWidth: '60px',
			}
		},
		created() {
			this.loadList();
		},
		computed: {
			AfterChangeData() {
				let start = (this.pageNo - 1) * this.pageSize;
				let end = this.pageNo * this.pageSize;
				return this.data.slice(start, end)
			}
		},
		methods: {
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return '';
			},
			// 表头过滤
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			// 筛选
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 删除
			delHandle(index, row) {
				this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var data = {
						"FuncCode": "DelCoz",
						"Data": [
							[{ ...row }]
						]
					}
					Joggle.del({ Content: JSON.stringify(data) })
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('删除成功')
								this.loadList();
							} else {
								this.$message.warning(response)
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})

			},
			// 编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
			},
			// 点击编辑模态框的取消
			closeEditModal(editForm) {
				this.editModalShow = false;
			},
			// 点击编辑模态框的完成
			edit() {
				if (this.editForm.Category != "All") {
					var data = {
						"FuncCode": "ChgCoz",
						"Data": [
							[this.editForm]
						],
					}
					this.$refs.editForm.validate(async (valid) => {
						if (valid) {
							await Joggle.put(data).then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改成功');
									this.editModalShow = false;
									this.loadList();
								} else {
									this.$message.warning(response);
								}
							}).catch((resposne) => {
								this.$message.error(error);
							})
						}
					})
				}
			},
			// 添加课程
			addHandle() {
				this.dialogFormVisible = true
			},
			close() {
				this.form = {};
				this.dialogFormVisible = false
			},
			async sure() {
				let formData = { ...this.form }
				formData.ID = new Date().getTime()
				if (formData.Category == "All") {
					alert("请换个类别名称")
				} else {
					var data = {
						"FuncCode": "AddCoz",
						"Data": [
							[{ ...formData }]
						]
					}
					this.$refs.form.validate(async (valid) => {
						if (valid) {
							await Joggle.post(data).then((response) => {
									if (response.indexOf("Fail:") == -1) {
										this.$message.success('添加成功');
										this.$refs['form'].resetFields()
										this.dialogFormVisible = false
										this.loadList();
									} else {
										this.$message.warning(response);
									}
								})
								.catch((response) => {
									this.$message.error(error);
								})
						}
					})
				}
			},
			// 载入
			async loadList() {
				// 载入所有
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.form.Date = time
				this.editForm.Date = time
				this.form.UserID = sessionStorage.id
				this.editForm.UserID = sessionStorage.id
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							"All"
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
		},
	}
</script>

<style lang="scss">
	#course-list {
		font-size: 16px;

		.block {
			margin-top: 20px;
		}

		.el-table .blue-row {
			background: aliceblue;
		}
	}
</style>
