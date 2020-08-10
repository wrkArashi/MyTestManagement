<template>
	<div class="coruseHall">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>课程公示</el-breadcrumb-item>
			<el-breadcrumb-item>课程大厅</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="enquire">
			<el-form class="demo-form">
				<el-form-item label="所属架构:" prop="ChartMap" label-width="80px">
					<el-cascader :show-all-levels="false" :props="defaultParams" :options="options" v-model="ChartMap" @change="ChangeMap"
					 placeholder="请选择专业"></el-cascader>
				</el-form-item>
			</el-form>
			<div class="btn">
				<el-button type="primary" @click="sift()" plain>搜索</el-button>
				<el-button type="warning" @click="again()" plain>重置</el-button>
			</div>
		</div>
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
			<el-table-column align="right">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="输入课程名称搜索" />
				</template>
				<template slot-scope="scope">
					<router-link :to="{ name : 'CourseDetail' , params : { id : scope.row.ID } }" style="margin-left: 50px;">
						<el-button size="mini" plain><i class="el-icon-view"> 详情</i></el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
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
				ChartMap: '',
				search: '', // 搜索
				currentPage: 1, // 分页
				pagesize: 10,
				tableData: [],
				options: [], //所属架构
				defaultParams: {
					checkStrictly: true,
					label: 'Name',
					value: 'ID',
					children: 'children'
				}, //所属架构
			}
		},
		created() {
			this.loadList();
			this.loadMap()
		},
		methods: {
			async again() {
				this.ChartMap = ''
				this.loadList()
			},
			async sift() {
				var data = {
					"FuncCode": "GetCozHList",
					"Data": {
						"Params": [
							null,
							this.ChartMap
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
			ChangeMap(value) {
				this.ChartMap = value[value.length - 1]
			},
			loadMap() {
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
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return '';
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
							null,
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
		}
	}
</script>

<style lang="scss">
	.coruseHall {
		.block {
			margin-top: 20px;
		}

		.btn {
			height: 62px;
			margin-left: 10px;
		}

		.enquire {
			display: flex;
			align-items: center;
			margin-top: 20px;

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
	}
</style>
