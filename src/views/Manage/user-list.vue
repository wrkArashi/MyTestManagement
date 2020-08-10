<template>
	<el-card class="box-card user-list">
		<div slot="header">
			<span>用户列表</span>
			<el-button style="float: right; padding: 3px 0" type="text" @click="addtHandle">添加用户</el-button>
		</div>
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
		 :row-class-name="tableRowClassName">
			<el-table-column prop="ID" label="账号" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="Name" label="姓名" width=""></el-table-column>
			<el-table-column prop="Sex" label="性别" width="50"></el-table-column>
			<el-table-column prop="Mobile" label="电话" width=""></el-table-column>
			<el-table-column prop="Birthday" label="出生日期" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="Address" label="通讯地址" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="Category" label="类别" width="" :filters="[{text: '公司内部', value: '公司内部'}, {text: '公司外部', value: '公司外部'}]"
			 :filter-method="filterHandler"></el-table-column>
			<el-table-column prop="ChartLevel" label="架构层级" width="100"></el-table-column>
			<el-table-column prop="ChartMap" label="所属架构" width="100"></el-table-column>
			<el-table-column prop="Depict" label="描述" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column align="right" width="200">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain><i class="el-icon-edit"></i>
						编辑</el-button>
					<el-button size="mini" type="warning" @click='deleteHandle(scope.$index, scope.row)' plain style="margin-left: 10px;">
						<span v-if=" scope.row.IsVoid== '0'">未禁用</span>
						<span v-if=" scope.row.IsVoid== '1'">已禁用</span>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑用户" :visible.sync="editModalShow" :show-close='false' width="600px">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item label="账号" prop="ID" :label-width="formLabelWidth">
					<el-input v-model="editForm.ID" autocomplete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name" :label-width="formLabelWidth">
					<el-input v-model="editForm.Name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="Sex" :label-width="formLabelWidth">
					<el-radio-group v-model="editForm.Sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="Mobile" :label-width="formLabelWidth">
					<el-input v-model="editForm.Mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="Birthday" :label-width="formLabelWidth">
					<el-date-picker v-model="editForm.Birthday" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="通讯地址" prop="Address" :label-width="formLabelWidth">
					<el-input v-model="editForm.Address" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="类别" prop="Category" :label-width="formLabelWidth">
					<el-select v-model="editForm.Category" placeholder="请选择">
						<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属架构" prop="ChartMap" :label-width="formLabelWidth">
					<el-cascader :key="isResShow" :show-all-levels="false" :props="defaultParams" :options="options" v-model="editForm.ChartMap"
					 @change="handleChange"></el-cascader>
				</el-form-item>
				<el-form-item label="描述" prop="Depict" :label-width="formLabelWidth">
					<el-input v-model="editForm.Depict" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="edit">完 成</el-button>
			</div>
		</el-dialog>
		<!-- 点击添加用户 -->
		<el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="600px">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="账号" prop="ID" :label-width="formLabelWidth">
					<el-input v-model="form.ID" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="Password" :label-width="formLabelWidth">
					<el-input v-model="form.Password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="Email" :label-width="formLabelWidth">
					<el-input v-model="form.Email" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name" :label-width="formLabelWidth">
					<el-input v-model="form.Name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="Sex" :label-width="formLabelWidth">
					<el-radio-group v-model="form.Sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="Mobile" :label-width="formLabelWidth">
					<el-input v-model="form.Mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="Birthday" :label-width="formLabelWidth">
					<el-date-picker v-model="form.Birthday" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="通讯地址" prop="Address" :label-width="formLabelWidth">
					<el-input v-model="form.Address" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="类别" prop="Category" :label-width="formLabelWidth">
					<el-select v-model="form.Category" placeholder="请选择">
						<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属架构" prop="ChartMap" :label-width="formLabelWidth">
					<el-cascader :show-all-levels="false" :props="defaultParams" :options="options" v-model="form.ChartMap" @change="handleChange"
					 :key="isResShow"></el-cascader>
				</el-form-item>
				<el-form-item label="描述" prop="Depict" :label-width="formLabelWidth">
					<el-input v-model="form.Depict" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="sure">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	import crypto from 'crypto';
	export default {
		name: 'Pager',
		data() {
			var checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			}
			return {
				isResShow: 1,
				// 搜索
				search: '',
				// 分页
				currentPage: 1,
				pagesize: 10,
				// 内部外部
				options1: [{
					value: '公司内部',
					label: '公司内部'
				}, {
					value: '公司外部',
					label: '公司外部'
				}],
				// 级联选择器Map
				options: [],
				defaultParams: {
					checkStrictly: true,
					label: 'Name',
					value: 'ID',
					children: 'children'
				},
				// 载入表格
				tableData: [],
				// 编辑框
				editModalShow: false,
				// 编辑表单
				editForm: {
					ID: '',
					Name: '',
					Sex: '',
					Birthday: '',
					Mobile: '',
					Address: '',
					Category: '',
					ChartMap: "",
					ChartLevel: '',
				},
				// 添加框
				dialogFormVisible: false,
				// 添加表单
				form: {
					Password: '',
					Email: '',
					ID: '',
					Name: '',
					Sex: '',
					Birthday: '',
					Mobile: '',
					Address: '',
					Category: '',
					ChartMap: '',
					ChartLevel: '',
					Depict: '',
				},
				formLabelWidth: '90px',
				rules: {
					ID: { required: true, message: '不能为空', trigger: 'blur' },
					Name: { required: true, message: '不能为空', trigger: 'blur' },
					Sex: { required: true, message: '不能为空', trigger: 'blur' },
					Birthday: { required: true, message: '不能为空', trigger: 'blur' },
					// Address: { required: true, message: '不能为空', trigger: 'blur' },
					Category: { required: true, message: '不能为空', trigger: 'blur' },
					ChartMap: { required: true, message: '不能为空', trigger: 'blur' },
					// Depict: { required: true, message: '不能为空', trigger: 'blur' },
					Password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
					Email: [
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
					],
					Mobile: { required: true, validator: checkPhone, trigger: 'blur' }
				}
			}
		},
		created() {
			this.loadList();
		},
		watch: {
			'editForm.Category': function(newValue, oldValue) {
				this.loadCategory(newValue);
			},
			'form.Category': function(newValue, oldValue) {
				this.loadCategory(newValue);
			}
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
			// 载入
			async loadList() {
				var data = {
					"FuncCode": "GetTList",
					"Data": {
						"Params": [
							null
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
			// 二级联动
			loadCategory(value) {
				this.editForm.ChartMap = ""
				if (value == '公司内部') {
					var data = {
						"FuncCode": "GetChList",
						"Data": {
							"Params": [
								"OrgChart"
							]
						},
					}
				}
				if (value == "公司外部") {
					var data = {
						"FuncCode": "GetChList",
						"Data": {
							"Params": [
								"UniChart"
							]
						},
					}
				}
				let response = Joggle.get(data)
					.then((response) => {
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
							++this.isResShow
							this.options = formatArray
						} else {
							this.$message.warning(response)
						}
					})
			},
			handleChange(value) {
				this.editForm.ChartMap = value[value.length - 1]
				this.form.ChartMap = value[value.length - 1]
				this.editForm.ChartLevel = value.length
				this.form.ChartLevel = value.length
			},
			// 点击编辑
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
				var data = {
					"FuncCode": "ChgUser",
					"Data": [
						[this.editForm]
					],
				}
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改成功');
									this.editModalShow = false;
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
			},
			// 点击添加
			addtHandle() {
				this.dialogFormVisible = true
			},
			//点击添加模态框的取消
			close() {
				let formData = { ...this.form }
				formData = {};
				this.dialogFormVisible = false
			},
			// 点击添加弹框的确定
			sure() {
				let formData = { ...this.form }
				const md5 = crypto.createHash('md5');
				md5.update(formData.Password);
				let pwd = md5.digest('hex');
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "AddUser",
					"Data": [
						[{
							"ID": formData.ID,
							"Password": pwd,
							"Email": formData.Email,
							"Category": 'IMP',
							"Token": null,
							"CheckCode": null,
							"Depict": formData.Depict,
							"Date": time,
							"IsVoid": 0,
						}],
						[{
							"ID": formData.ID,
							"Name": formData.Name,
							"Sex": formData.Sex,
							"Birthday": formData.Birthday,
							"Mobile": formData.Mobile,
							"Address": formData.Address,
							"Category": formData.Category,
							"ChartMap": formData.ChartMap,
							"ChartLevel": formData.ChartLevel,
							"Depict": formData.Depict,
							"Date": time,
							"IsVoid": 0
						}]
					]
				}
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						await Joggle.post(data)
							.then((response) => {
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
			},
			// 点击禁用
			deleteHandle(index, row) {
				var ID = row.ID
				this.$confirm('此操作将禁用该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					var data = {
						"FuncCode": "VoidUser",
						"Data": [
							[
								{ ID }
							]
						]
					}
					await Joggle.put(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('禁用成功');
								this.loadList();
							} else {
								this.$message.warning(response);
							}
						})
						.catch((response) => {
							this.$message.error(error);
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消禁用'
					});
				})

			},
		},
	}
</script>
<style lang="scss">
	.user-list {
		font-size: 16px;

		.block {
			margin-top: 20px;
		}

		.el-table .blue-row {
			background: aliceblue;
		}
	}
</style>
