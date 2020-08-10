<template>
	<div class="collect">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>收藏/回收站</el-breadcrumb-item>
			<el-breadcrumb-item>收藏夹</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="structure">
			<div class="right">
				<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize).filter(data => !search || data.SourceName.toLowerCase().includes(search.toLowerCase()))"
				 style="width: 100%" :default-sort="{prop: 'SourceName', order: 'descending'}" :row-class-name="tableRowClassName">
					<el-table-column prop="Category" label="类别" width="" :filters="[{text: '试题', value: '试题'}, {text: '试卷', value: '试卷'}]"
					 :filter-method="filterHandler">
					</el-table-column>
					<el-table-column prop="SourceName" label="名称" width=""></el-table-column>
					<el-table-column prop="Date" label="日期" sortable width="">
					</el-table-column>
					<el-table-column align="right" width="">
						<!-- 搜索 -->
						<template slot="header" slot-scope="scope">
							<el-input v-model="search" size="mini" placeholder="输入名称中的关键字搜索" />
						</template>
						<!-- 操作 -->
						<template slot-scope="scope">
							<!-- <router-link :to="{ name : 'PaperDetailPaper' , params : { id : scope.row.SourceID } }" style="margin-right: 10px;"> -->
							<el-button type="mini" @click="handleDetails(scope.$index, scope.row)"><i class="el-icon-view"></i> 详情</el-button>
							<!-- </router-link> -->
							<el-button type="mini" @click="handleCollect(scope.$index, scope.row)">
								<i class="el-icon-folder-add"> 取消收藏</i>
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
		</div>
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
				detaileForm: [], // 详情表单
				detaileDialogVisible: false,
				currentPage: 1,
				pagesize: 10,
				tableData: [],
				search: '',
			}
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
			async handleDetails(index, row) {
				if (row.Category == "试题") {
					this.detaileDialogVisible = true
					var data = {
						"FuncCode": "GetQu",
						"Data": {
							"Params": [
								row.SourceID
							]
						},
					}
					await Joggle.get(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								var jsonObj = JSON.parse(response);
								this.detaileForm = jsonObj[0]
							} else {
								this.$message.warning(response);
							}
						})
				}
				if (row.Category == "试卷") {
					this.$router.push({
						name: 'PaperDetailPaper', // 路由的名称
						params: {
							id: row.SourceID
						}
					})
				}
			},
			// 取消收藏
			handleCollect(index, row) {
				var data = {
					"FuncCode": "DelFa",
					"Data": [
						[{ ...row }]
					]
				}
				Joggle.del({ Content: JSON.stringify(data) })
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							this.$message.success('已取消收藏')
							this.loadList();
						} else {
							this.$message.warning(response)
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
			// 筛选
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			// 载入列表
			async loadList() {
				var data = {
					"FuncCode": "GetFaList",
					"Data": {
						"Params": [
							sessionStorage.id
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
			}
		}
	}
</script>

<style lang="scss">
	.collect {
		.details {
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

			.detailBG {
				border: 1px dashed #7cccfb;
				background: #daf1ff;
				padding: 10px;
				margin: 10px 0;
			}
		}

		.block {
			margin-top: 20px;
		}

		.el-table .blue-row {
			background: aliceblue;
		}

		.structure {
			display: flex;
			padding-top: 20px;

			.right {
				width: 100%;
				margin: 0 15px;
			}
		}
	}
</style>
