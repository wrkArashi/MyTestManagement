<template>
	<div class="newPaper">
		<!-- 弹窗（试卷头） -->
		<el-dialog title="试卷基本信息" :visible.sync="dialogHeaderForm" :close-on-click-modal="false" :destroy-on-close="true"
		 :show-close="false" :close-on-press-escape="false">
			<el-form :model="headerForm" :rules="rules" ref="headerForm">
				<el-form-item label="课程:" prop="Course">
					<el-select v-model="Type" placeholder="请选择类别">
						<el-option v-for="item in optionsFirst" :label="item.Category" :value="item.Category" :key="item.Category"></el-option>
					</el-select>
					<el-select v-model="headerForm.Course" placeholder="请选择课程">
						<el-option v-for="item in optionsSecond" :key="item.ID" :label="item.Name" :value="item.Name"></el-option>
					</el-select>
					<span> 公开策略: </span>
					<el-select v-model="headerForm.IsPublic" placeholder="请选择">
						<el-option v-for="item in public" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称:" prop="Name">
					<el-input v-model="headerForm.Name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="总分:">
					<el-input v-model="headerForm.Scores" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="时长(分钟):">
					<el-input v-model="headerForm.Length" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="试卷结构:">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>由【理论题】和【上机题】两个部分组成，满分100分。</div>
						<div>【理论题】包括：选择（30分）、填空（10分）、简答（10分）</div>
						<div>【上机题】50分</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.Chart"></el-input>
				</el-form-item>
				<el-form-item label="适用范围:">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>【Java SE程序设计】教学大纲必讲内容</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.AppScope"></el-input>
				</el-form-item>
				<el-form-item label="考察范围">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>描述试卷使用的年级、学期、专业等等</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.InvScope"></el-input>
				</el-form-item>
				<el-form-item label="前置知识">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>1.在Windows环境下工作</div>
						<div> 2.有一定的英文基础，能够阅读简单英文技术文章</div>
						<div> 3.能够进行网络资源的下载和安装</div>
						<div> 4.能够阅读、创建程序流程图，了解程序是一些特定语句的集合</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.Knowledge"></el-input>
				</el-form-item>
				<el-form-item label="基本要求">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>1.使用Eclipse编写、运行Java程序</div>
						<div>2.掌握Java面向对象的分析、设计思想</div>
						<div>3.掌握Java中的类、对象、抽象类、接口</div>
						<div>4.掌握Java中的集合、泛型</div>
						<div>5.掌握Java异常处理体制</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.Request"></el-input>
				</el-form-item>
				<el-form-item label="试卷说明">
					<el-popover placement="top-start" width="400" trigger="click">
						<div>示例：</div>
						<div>用于补充说明该试卷的其他信息</div>
						<el-button slot="reference" size="mini">提示</el-button>
					</el-popover>
					<el-input type="textarea" v-model="headerForm.Explain"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取消</el-button>
				<el-button type="primary" @click="headerFormSure()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 页面 -->
		<div class="content">
			<div class="title_bg" slot="reference"></div>
			<!-- 试卷头 -->
			<div class="header">
				<div class="allRight">
					<div class="right">
						<div>适用课程： <span></span></div>
						<div>试卷总分： <span></span></div>
						<div>考试时间(建议)： <span>分钟</span></div>
						<div>创建者： <span></span></div>
						<el-button>
							<i class="el-icon-caret-bottom"></i>
						</el-button>
					</div>
				</div>
				<div class="left">
					<a href="javascript:void(0)">收起试卷信息</a>
				</div>
			</div>
			<!-- 注意 -->
			<div class="notice">
				注意：
				<br>1、添加试题时，选择题中不要出现某一选项包含其他选项的情况，否则会出现误判的情况。例如：
				<br>下列哪些是植物？
				<br>顺序一：A.草 B.花 C.狗 D.A和B
				<br>顺序二：A.草 B.狗 C.花 D.A和
				<br>正确答案是草和花。顺序一中的D是正确的；而顺序二则无正确答案，无论哪个选项都是错误的。
				<br>2、学生考试时，不同学生看到的选择题各个选项A、B、C、D对应的内容是不一样的。
				<br>3、系统对选择题判卷时，以内容为准，而不是以A、B、C、D为准。
			</div>
		</div>
	</div>

</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				options: [{
					label: "单选"
				}, {
					label: "多选"
				}, {
					label: "填空"
				}, {
					label: "判断"
				}, {
					label: "问答"
				}, {
					label: "编程"
				}, {
					label: "上机"
				}],
				public: [{
					value: true,
					label: '公开'
				}, {
					value: false,
					label: '私有'
				}], //公开策略
				Type: "", //类别
				optionsFirst: [], // 试卷头选择课程（类别）
				optionsSecond: [], // 试卷头选择课程（课程）
				dialogHeaderForm: true, //试卷头弹框
				// 添加试卷头
				headerForm: {
					ID: '',
					Name: '',
					Course: '',
					Scores: 100,
					Length: 120,
					Chart: '',
					AppScope: '',
					InvScope: '',
					Knowledge: '',
					Request: '',
					Explain: '',
					IsPublic: true,
					Browses: 0,
					Collects: 0,
					Status: "inactive",
					CreatorID: "",
					Creator: "",
					CreateDate: "",
					UpdateDate: ""
				},
				rules: {
					Name: { required: true, message: '名称不能为空', trigger: 'blur' },
					Course: { required: true, message: '课程不能为空', trigger: 'blur' }
				}
			};
		},
		watch: {
			'Type': function(newValue, old) {
				this.loadCourse(newValue)
			}
		},
		methods: {
			cancel() {
				this.$router.push('/paper/mine')
			},
			// 表头确定按钮
			async headerFormSure() {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.headerForm.ID = new Date().getTime()
				this.headerForm.CreateDate = time
				this.headerForm.UpdateDate = time
				var data = {
					"FuncCode": "AddPaH",
					"Data": [
						[this.headerForm],
					]
				}
				this.$refs.headerForm.validate(async (valid) => {
					if (valid) {
						await Joggle.post(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加成功');
								this.$router.push({ name: 'PaperOnePaper', params: { id: this.headerForm.ID } })
							} else {
								this.$message.warning(response);
							}
						})
					}
				})
			},
			// 获取类别
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
			async loadCourse() {
				this.headerForm.Course = ""
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
			async loadList() {
				// 获取类别
				this.loadType()
				// 获取用户信息
				var data = {
					"FuncCode": "GetUser",
					"Data": {
						"Params": [sessionStorage.id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						// 赋值用户名
						this.headerForm.Creator = jsonObj[0].Name
						this.headerForm.CreatorID = sessionStorage.id
					} else {
						this.$message.warning(response);
					}
				})
			}
		},
		created() {
			this.loadList();
		},
	};
</script>

<style lang="scss">
	.newPaper {

		// 页面内容
		.content {
			.title_bg {
				background: #0e75a4;
				height: 35px;
				line-height: 35px;
				font-size: 25px;
				font-weight: bold;
				color: white;
				text-align: center;
				padding: 5px;
			}

			.header {
				display: flex;
				justify-content: space-around;

				.allRight {
					width: 100%;
					background-color: #d9edf7;
					padding: 8px 35px 8px 14px;
					border: 1px solid #bce8f1;
					border-radius: 4px;

					span {
						color: #3a87ad;
					}

					.right {
						display: flex;
						justify-content: space-between;
					}
				}

				.left {
					width: 20%;
					text-align: center;
					padding: 8px 0;

					a {
						color: #3a87ad;
					}
				}
			}

			.notice {
				color: #ff0000;
				line-height: 24px;
				padding: 10px 0;
			}

			.dialog-footer {
				a {
					color: #2C3E50;
				}
			}
		}
	}
</style>
