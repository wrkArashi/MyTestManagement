<template>
	<div class="bankHall">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom:10px">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>题库管理</el-breadcrumb-item>
			<el-breadcrumb-item>题库大厅</el-breadcrumb-item>
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
						<div class="item">
							<div class="name">题型：</div>
							<div>
								<el-checkbox-group v-model="checkList" @change="type">
									<el-checkbox label="单选"></el-checkbox>
									<el-checkbox label="复选"></el-checkbox>
									<el-checkbox label="填空"></el-checkbox>
									<el-checkbox label="判断"></el-checkbox>
									<el-checkbox label="问答"></el-checkbox>
									<el-checkbox label="读解"></el-checkbox>
									<el-checkbox label="上机"></el-checkbox>
								</el-checkbox-group>
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
		<el-table :data="tableData.filter(data => !search || data.Stem.toLowerCase().includes(search.toLowerCase()))" style="width: 100%"
		 :row-class-name="tableRowClassName">
			<el-table-column prop="Stem" label="题目" sortable width="430px" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="CreateDate" label="发布时间" :show-overflow-tooltip="true" sortable>
			</el-table-column>
			<el-table-column prop="Browses" label="浏览数" sortable>
			</el-table-column>
			<el-table-column prop="Creator" label="创建人" sortable width="">
			</el-table-column>
			<el-table-column prop="Category" label="题型" sortable width="">
			</el-table-column>
			<el-table-column prop="Score" label="分值" sortable width="">
			</el-table-column>
			<el-table-column prop="Collects" label="收藏数" sortable width="">
			</el-table-column>
			<el-table-column align="right" width="200">
				<!-- 搜索 -->
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入题干中的关键字搜索" />
				</template>
				<!-- 操作 -->
				<template slot-scope="scope">
					<el-button size="mini" @click="handleDetails(scope.$index, scope.row),detaileDialogVisible = true">
						<i class="el-icon-view"> 详情</i>
					</el-button>
					<el-button type="mini" @click="handleCollect(scope.$index, scope.row)">
						<i class="el-icon-folder-add"> 收藏</i>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="block">
			<el-pagination @current-change="handleCurrentChange" :page-size="20" layout="total,prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 详情弹框 -->
		<el-dialog class="details" title="试题详情" :visible.sync="detaileDialogVisible" width="30%" center>
			<el-dialog title="原图" :visible.sync="innerVisible" append-to-body width="60%">
				<img :src="detaileForm.Attached" alt="">
			</el-dialog>
			<img :src="detaileForm.Attached" class="image" @click="innerVisible = true" v-if="detaileForm.Attached!=null">
			<div class="title">{{detaileForm.Stem}}</div>
			<div class="item1" v-if="Ashow">A: {{detaileForm.OptionA}}</div>
			<div class="item1" v-if="Bshow">B: {{detaileForm.OptionB}}</div>
			<div class="item1" v-if="Cshow">C: {{detaileForm.OptionC}}</div>
			<div class="item1" v-if="Dshow">D: {{detaileForm.OptionD}}</div>
			<div class="detailBG">
				<div class="item"><span class="name green">参考答案： </span> {{detaileForm.Anwser}}</div>
				<div class="item"><span class="name">分值： </span> {{detaileForm.Score}}</div>
				<div class="item"><span class="name">课程： </span> {{detaileForm.Course}}</div>
				<div class="item"><span class="name">章节： </span> {{detaileForm.Chaptor}}</div>
				<div class="item"><span class="name">教材： </span> {{detaileForm.Book}}</div>
				<div class="item"><span class="name">知识点： </span> {{detaileForm.Knowledge}}</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="detaileDialogVisible = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				innerVisible: false,
				Ashow: true,
				Bshow: true,
				Cshow: true,
				Dshow: true,
				editableTabsValue: '0', //默认第一个选项卡
				editableTabs: [], //类别数据
				items: [], //课程数据
				CategoryName: "", //默认载入课程
				factor: [], //课程筛选条件
				courseID: [], //选出来的课程ID 
				detaileForm: [], // 详情表单
				checkList: [], //复选框
				activeNames: ['1'], //折叠面板
				tableData: [], // 筛选表格
				search: '', // 搜索框	
				total: 0, // 分页总条数
				pageIndex: "1", //第几页				
				detaileDialogVisible: false, // 详情弹框
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
			async loadList() {
				// 获取所有列表
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							null,
							null,
							"1"
						]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							this.tableData = jsonObj.Data
							this.total = jsonObj.Counts
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
				var str2 = "";
				if (this.checkList != 0) {
					var checkList = this.checkList;
					for (let i = 0; i < checkList.length; i++) {
						str2 += checkList[i];
						if (i < checkList.length - 1) {
							str2 += ";"
						}
					}
				} else {
					str2 = null
				}
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							str2,
							str,
							this.pageIndex
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
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
			// 点击详情
			async handleDetails(index, row) {
				this.detaileForm = row
				if (this.detaileForm.OptionA == "") {
					this.Ashow = false
				}
				if (this.detaileForm.OptionB == "") {
					this.Bshow = false
				}
				if (this.detaileForm.OptionC == "") {
					this.Cshow = false
				}
				if (this.detaileForm.OptionD == "") {
					this.Dshow = false
				}
				row.Browses = row.Browses + 1
				var data = {
					"FuncCode": "AddBrow",
					"Data": [
						[{
							"Table": "Questions",
							"ID": row.ID,
							"Value": row.Browses

						}]
					],
				}
				await Joggle.put(data)
			},
			// 点击题型
			type(value) {
				this.checkList = value
			},
			// 分页
			async handleCurrentChange(val) {
				this.pageIndex = val.toString()
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							null,
							null,
							this.pageIndex
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
					} else {
						this.$message.warning(response);
					}
				})
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
							"Table": "Questions",
							"ID": row.ID,
							"Value": row.Collects.toString(),
							"Name": row.Stem,
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
	.bankHall {

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

		// 详情对话框
		.details {
			.detailBG {
				border: 1px dashed #7cccfb;
				background: rgb(236, 245, 255);
				padding: 10px;
				margin: 10px 0;
			}

			.title {
				padding: 10px;
			}

			.image {
				max-width: 100%;
			}

			.item1 {
				padding: 5PX 10PX;
			}

			.item {
				padding: 5px 0;

				.green {
					color: #008000;
				}

				.name {
					font-weight: bold;
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
