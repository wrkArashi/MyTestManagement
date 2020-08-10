<template>
	<div class="paperMine">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>试卷管理</el-breadcrumb-item>
			<el-breadcrumb-item>我的试卷</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 查询 -->
		<div class="group">
			<span style="font-size: 15px;">我的试卷</span>
		</div>
		<div class="enquire">
			<el-form :inline="true" class="demo-form-inline">
				<!-- 级联选择器（课程） -->
				<el-form-item label="课程:">
					<el-select v-model="Type" placeholder="请选择类别">
						<el-option v-for="item in optionsFirst" :label="item.Category" :value="item.Category" :key="item.Category"></el-option>
					</el-select>
					<el-select v-model="Course" placeholder="请选择课程">
						<el-option v-for="item in optionsSecond" :key="item.ID" :label="item.Name" :value="item.Name"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div class="btn">
				<el-button type="primary" @click="sift()" plain>搜索</el-button>
				<el-button type="warning" @click="again()" plain>重置</el-button>
				<el-button @click="add()" plain>＋添加试卷</el-button>
			</div>
		</div>
		<!-- 渲染我的试卷 -->
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase())) "
		 :row-class-name="tableRowClassName">
			<el-table-column prop="Name" label="卷名" sortable width="430px" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="Course" label="课程" sortable width="">
			</el-table-column>
			<el-table-column prop="Scores" label="总分" sortable width="">
			</el-table-column>
			<el-table-column prop="Browses" label="浏览数" sortable width="">
			</el-table-column>
			<el-table-column prop="Collects" label="收藏数" sortable width="">
			</el-table-column>
			<el-table-column prop="CreateDate" label="创建时间" sortable width="" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column align="right" width="300px">
				<!-- 搜索 -->
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入题干中的关键字搜索" />
				</template>
				<!-- 操作 -->
				<template slot-scope="scope">
					<router-link :to="{ name : 'PaperDetailPaper' , params : { id : scope.row.ID } }" style="margin-right: 10px;">
						<el-button size="mini" type="primary" plain>详情</el-button>
					</router-link>
					<el-button size="mini" type="warning" @click='handleStatus(scope.$index, scope.row)' plain v-model="tableData.Status" style="margin-right: 10px;">
						<span v-if=" scope.row.Status== 'inactive'">未发布</span>
						<span v-if=" scope.row.Status== 'active'">已发布</span>
					</el-button>
					<router-link :to="{ name : 'PaperOnePaper' , params : { id : scope.row.ID } }" style="margin-right: 10px;">
						<el-button size="mini" type="primary" plain>编辑</el-button>
					</router-link>
					<el-button type="danger" size="mini" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				null1: "",
				Type: "",
				Course: "",
				// 级联选择器
				optionsFirst: [],
				optionsSecond: [],
				tableData: [], //所有列表数据
				search: '', // 搜索框	
				currentPage: 1, //当前页数
				pagesize: 10, //一页几条
			}
		},
		watch: {
			'Type': function(newValue, oldValue) {
				this.getCourse(newValue);
			}
		},
		created() {
			this.loadList()
		},
		methods: {
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return '';
			},
			// 添加
			add() {
				this.$router.push('/paper/newPaper')
			},
			// 获取分类
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
			// 点击重置
			async again() {
				this.Type = ''
				this.Course = ''
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null,
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 点击筛选
			async sift() {
				if (this.Course == "") {
					this.null1 = null
				} else {
					this.null1 = this.Course
				}
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							sessionStorage.id,
							this.null1,
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 点击删除
			async handleDelete(index, row) {
				console.log(row)
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "SetSta",
					"Data": [
						[{
							"Table": "PaperHeader",
							"ID": row.ID,
							"Value": "drop",
							"Name": row.Name,
							"UserID": sessionStorage.id,
							"Date": time
						}]
					],
				}
				await Joggle.put(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							if (response == "Success") {
								this.$message.success('已删除');
							} else {
								this.$message.warning('删除失败：该试卷已被引用');
							}
							this.loadMyList();
						} else {
							this.$message.warning(response);
						}
					})
			},
			// 点击状态
			async handleStatus(index, row) {
				console.log(row)
				if (row.Status == "active") {
					var status = "inactive"
				}
				if (row.Status == "inactive") {
					var status = "active"
				}
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "SetSta",
					"Data": [
						[{
							"Table": "PaperHeader",
							"ID": row.ID,
							"Value": status,
							"Name": null,
							"UserID": sessionStorage.id,
							"Date": time
						}]
					],
				}
				await Joggle.put(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							if (response == "Success") {
								this.$message.success('修改状态成功');
							} else {
								this.$message.warning('修改失败：该试卷已被引用');
							}
							this.loadMyList();
						} else {
							this.$message.warning(response);
						}
					})
			},
			async loadMyList() {
				// 获取列表
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null,
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			async loadList() {
				this.loadType()
				this.loadMyList()
			}
		}
	}
</script>

<style lang="scss">
	.paperMine {
		.el-table .blue-row {
			background: aliceblue;
		}

		.block {
			margin-top: 20px;
		}

		.group {
			line-height: 40px;
			border-bottom: 2px solid #19bbeb;
			margin: 20px 10px 20px 0px;
			font-weight: bold;
		}

		.enquire {
			margin-top: 20px;
			display: flex;

			.btn {
				height: 62px;
			}

			input {
				-webkit-appearance: none;
				background-color: #FFF;
				background-image: none;
				border-radius: 4px;
				border: 1px solid #DCDFE6;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				color: #606266;
				display: inline-block;
				font-size: inherit;
				height: 40px;
				line-height: 40px;
				outline: 0;
				padding: 0 15px;
				-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
				transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
				width: 150px;
			}
		}

		// 添加试卷
		.link a {
			color: #2C3E50
		}
	}
</style>
