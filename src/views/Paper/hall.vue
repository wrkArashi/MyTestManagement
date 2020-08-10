<template>
	<div class="paperHall">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom:10px">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>试卷管理</el-breadcrumb-item>
			<el-breadcrumb-item>试卷大厅</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="box">
			<div class="box-top">
				<el-collapse v-model="activeNames">
					<el-collapse-item title="筛选：折叠/展开" name="1">
						<div class="item">
							<div class="name">类别：</div>
							<div style="width: 95%;">
								<el-tabs v-model="editableTabsValue" type="card" @tab-click="handleClick" style="padding:10px;">
									<el-tab-pane v-for="(item, index) in editableTabs" :label="item.Category">
										<el-tag style="margin-right: 5px;" effect="plain" size="medium" v-for="(item, index) in items" @click='handle(item,index)'
										 :class="{'active':item.active}" :disable-transitions="true">{{item.Name}}</el-tag>
									</el-tab-pane>
								</el-tabs>
							</div>
						</div>
						<div class="item1">
							<div class="item">
								<div class="name">条件：</div>
								<div>
									<el-tag style="margin-right: 5px;" v-for="(item, index) in factor" closable type=" " @close="del(item,index)"
									 :disable-transitions="true" effect="plain" size="medium">
										{{item.Name}}
									</el-tag>
								</div>
							</div>
							<el-button size="mini" class="click" @click="sift" type="primary" plain>点击搜索</el-button>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
		<!-- 筛选表格 -->
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase())) "
		 :row-class-name="tableRowClassName">
			<el-table-column prop="Name" label="卷名" sortable width="430px" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="Course" label="课程" sortable width="">
			</el-table-column>
			<el-table-column prop="Scores" label="总分" sortable width="">
			</el-table-column>
			<el-table-column prop="Creator" label="创建人" sortable width="">
			</el-table-column>
			<el-table-column prop="Browses" label="浏览数" sortable width="">
			</el-table-column>
			<el-table-column prop="Collects" label="收藏数" sortable width="">
			</el-table-column>
			<el-table-column prop="CreateDate" label="创建时间" sortable width="" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column align="right" width="200">
				<!-- 搜索 -->
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入卷名中的关键字搜索" />
				</template>
				<!-- 操作 -->
				<template slot-scope="scope">
					<router-link :to="{ name : 'PaperDetailPaper' , params : { id : scope.row.ID } }" style="margin-right: 10px;">
						<el-button type="mini" @click="handleDetails(scope.$index, scope.row)"><i class="el-icon-view"></i> 详情</el-button>
					</router-link>
					<el-button type="mini" @click="handleCollect(scope.$index, scope.row)">
						<i class="el-icon-folder-add"> 收藏</i>
					</el-button>
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
				editableTabsValue: '0', //默认第一个选项卡
				editableTabs: [], //类别数据
				items: [], //课程数据
				CategoryName: "", //默认载入课程
				factor: [], //课程筛选条件
				courseID: [], //选出来的课程ID 
				detaileForm: [], // 详情表单
				activeNames: ['1'], //折叠面板
				tableData: [], // 筛选表格
				search: '', // 搜索框	
				currentPage: 1, //当前页数
				pagesize: 10, //一夜几条
			};
		},
		created() {
			this.loadList();
		},
		methods: {
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return '';
			},
			// 点击详情
			async handleDetails(index, row) {
				var data = {
					"FuncCode": "AddBrow",
					"Data": [
						[{
							"Table": "PaperHeader",
							"ID": row.ID,
							"Value": row.Browses + 1

						}]
					],
				}
				await Joggle.put(data)
			},
			async loadList() {
				// 获取所有列表
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							null,
							null,
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
				// 获取所有类别
				var data = {
					"FuncCode": "GetCoz",
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
							this.editableTabs = jsonObj
							this.CategoryName = jsonObj[0].Category
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
				// 获取默认课程
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							this.CategoryName
						]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							jsonObj.forEach(item => {
								this.$set(item, 'active', false)
							})
							this.items = jsonObj
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
			},
			// 点击筛选按钮
			async sift() {
				var str = "";
				if (this.courseID.length != 0) {
					var courseID = this.courseID;
					for (let i = 0; i < courseID.length; i++) {
						str += courseID[i];
						if (i < courseID.length - 1) {
							str += ";"
						}
					}
				} else {
					str = null
				}
				var data = {
					"FuncCode": "GetPaList",
					"Data": {
						"Params": [
							null,
							str,
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
			// 点击课程
			handle(item, index) {
				if (this.factor.length < 5) {
					if (item.active == false) {
						this.factor.push(item)
						item.active = true
						this.courseID.push(item.Name)
					}
				} else {
					this.$message.warning("最多同时选择五个");
				}
			},
			//点击条件进行删除
			del(item, index) {
				item.active = false
				this.factor.splice(index, 1);
				this.courseID.splice(index, 1)
			},
			// 点击标签卡// 获取分类下课程
			async handleClick(tab, event) {
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							tab.label
						]
					},
				}
				await Joggle.get(data).then((response) => {
					var jsonObj = JSON.parse(response);
					jsonObj.forEach(item => {
						this.$set(item, 'active', false)
					})
					this.items = jsonObj
				})
				this.factor = []
				this.courseID = []
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 点击收藏
			async handleCollect(index, row) {
				row.Collects = row.Collects + 1;
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "AddFa",
					"Data": [
						[{
							"Table": "PaperHeader",
							"ID": row.ID,
							"Value": row.Collects.toString(),
							"Name": row.Name,
							"UserID": sessionStorage.id,
							"Date": time
						}]
					]
				}
				await Joggle.post(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							this.$message.success('收藏成功');
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					})
			},
		}
	};
</script>

<style lang="scss">
	.paperHall {

		// 筛选
		.box {
			display: flex;

			.box-top {
				background-color: white;
				padding: 20px;
				border: 1px solid #d4d4d4;
				border-radius: 5px;
				width: 100%;
				margin-bottom: 10px;

				.active {
					background-color: rgb(64, 158, 255);
					color: white;
				}

				.item {
					display: flex;
					justify-content: flex-start;
					padding: 5px 0;

					.name {
						margin-right: 5px;
					}
				}

				.item1 {
					display: flex;
					justify-content: space-between;
				}

				.click {
					margin-top: 10px;
				}
			}
		}

		.el-table .blue-row {
			background: aliceblue;
		}

		.el-collapse {
			border: 0;
			width: 100%;
		}

		.el-collapse-item__wrap {
			border: 0;
		}

		.el-collapse-item__header {
			border: 0;
		}

		.el-collapse-item__content {
			padding-bottom: 0;
		}

		.block {
			padding-top: 20px;
		}
	}
</style>
