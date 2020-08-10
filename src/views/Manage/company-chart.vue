<template>
	<el-card class="comChart">
		<div slot="header" class="clearfix">
			<span>公司架构</span>
		</div>
		<el-tree node-key="ID" :props="defaultProps" lazy ref="tree" :load="loadNode" :default-expanded-keys="[1]">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span> {{ node.label }}</span>
				<span>
					<el-button style="margin-right: 10px;" :disabled="node.level == 1" type="text" size="mini" @click.stop="() => openEditModal(node,data)"
					 icon="el-icon-edit">
						编辑
					</el-button>
					<el-button style="margin-right: 10px;" type="text" size="mini" @click.stop="() => openAddModal(node,data)" icon="el-icon-plus">
						添加下级
					</el-button>
					<el-button :disabled="node.level == 1" type="text" size="mini" @click.stop="() => remove(node, data)" icon="el-icon-delete">
						删除
					</el-button>
				</span>
			</span>
		</el-tree>
		<!-- 添加节点 -->
		<el-dialog title="添加下级" :visible.sync="addModal" :show-close='false' :closeOnClickModal='false'>
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="addForm.Name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeAddModal">取 消</el-button>
				<el-button type="primary" @click="addFormCom">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑节点 -->
		<el-dialog title="编辑" :visible.sync="EditModal" :show-close='false' :closeOnClickModal='false'>
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="editForm.Name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="editFormCom">修 改</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';

	export default {
		data() {
			return {
				// 添加节点
				addModal: false,
				addForm: {
					ID: null,
					Name: "",
					PID: "",
					Levels: ""
				},
				// 编辑节点
				EditModal: false,
				editForm: {
					ID: null,
					Name: "",
					PID: "",
					Levels: ""
				},
				// 删除节点
				delForm: {
					ID: "",
					Name: "",
					PID: "",
					Levels: ""
				},
				// 
				defaultProps: {
					label: 'Name'
				},
				// 节点数据
				nodeData: "",
				rules: {
					Name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
					]
				}
			}
		},
		methods: {
			// 加载
			async loadNode(node, resolve) {
				if (node.level == 0) {
					return resolve([{ ID: 0, Name: "全部分类", PID: null, Levels: 0 }])
				}
				if (node.level > 0) {
					let ID = node.data.ID
					var data = {
						"FuncCode": "GetChart",
						"Data": {
							"Params": [
								"OrgChart",
								ID
							]
						},
					}
					let response = Joggle.get(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								resolve(JSON.parse(response))
							} else {
								this.$message.warning(response)
							}
						})
				}
			},
			// 添加节点
			openAddModal(node, data) {
				this.nodeData = data // 转存节点数据
				this.addForm.PID = data.ID
				this.addForm.Levels = data.Levels + 1
				this.addModal = true
			},
			closeAddModal() {
				this.addModal = false
				this.addForm.Name = ''
			},
			addFormCom() {
				var data = {
					"FuncCode": "AddChart",
					"Data": [
						[{ "Name": "OrgChart" }],
						[{ ...this.addForm }]
					]
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						Joggle.post(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('添加成功')
									this.addForm.ID = parseInt(response)
									if (!this.nodeData.children) {
										this.$set(this.nodeData, 'children', [])
									}
									this.nodeData.children.push({ ...this.addForm })
									this.addModal = false
									this.addForm.Name = ''
								} else {
									this.$message.warning(response)
								}
							})
					}
				})
			},
			// 编辑节点
			openEditModal(node, data) {
				this.node = node;
				this.editForm = { ...data };
				this.EditModal = true
			},
			closeEditModal() {
				this.EditModal = false
				this.editForm.Name = ''
			},
			editFormCom() {
				var data = {
					"FuncCode": "ChgChart",
					"Data": [
						[{ "Name": "OrgChart" }],
						[{ ...this.editForm }]
					]
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.node.data = this.editForm
									this.$message.success('修改成功')
									this.EditModal = false
								} else {
									this.$message.warning(response)
								}
							})
					}
				})
			},
			// 删除节点
			remove(node, data) {
				let num = (node.childNodes.length)
				this.delForm = { ...data };
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var data = {
						"FuncCode": "DelChart",
						"Data": [
							[{ "Name": "OrgChart" }],
							[{ ...this.delForm }]
						]
					}
					if (num > 0) {
						this.$message.error('删除失败，请先清空子分类');
					} else {
						Joggle.del({ Content: JSON.stringify(data) })
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									node.remove();
									this.$message.success('删除成功')
								} else {
									this.$message.warning(response)
								}
							})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			}
		},
	}
</script>

<style lang="scss">
	.comChart {
		font-size: 16px;

		.custom-tree-node {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
		}
	}
</style>
