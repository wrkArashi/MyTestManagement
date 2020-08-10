<template>
	<div class="onePaper">
		<!-- 选题 -->
		<el-dialog title="选题" :visible.sync="dialogSelect">
			<el-form :inline="true" :model="selectForm" class="demo-form-inline">
				<!-- 下拉框（题型） -->
				<el-form-item label="题型:">
					<el-select v-model="selectForm.Category" placeholder="请选择">
						<el-option v-for="item in options" :label="item.label" :value="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="sift()" plain>搜索</el-button>
				<el-button type="warning" @click="again()" plain>重置</el-button>
			</el-form>
			<el-table :data="tableData" stripe>
				<el-table-column prop="Stem" label="题目" sortable width="400px" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="Category" label="题型" sortable width=""></el-table-column>
				<el-table-column prop="Course" label="课程" sortable width=""></el-table-column>
				<el-table-column prop="Score" label="分值" sortable width=""></el-table-column>
				<el-table-column prop="operate" label="操作" width="">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click='enterHandle(scope.$index, scope.row)' plain>导入</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination @current-change="handleCurrentChange" :page-size="20" layout="total,prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogSelect=false">关 闭</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗（添加题型） -->
		<el-dialog title="添加题型" :visible.sync="dialogL">
			<el-form :model="Lform" :inline="true" :rules="rules" ref='Lform' :close-on-click-modal="false">
				<el-form-item label="题号" label-width="65px" prop="Pnum">
					<el-input v-model="Lform.Pnum" placeholder="请输入 1 / 2 / 3 … "></el-input>
				</el-form-item>
				<el-form-item label="题型" label-width="65px" prop="Pname">
					<el-select v-model="Lform.Pname" placeholder="请选择">
						<el-option v-for="item in options" :label="item.label" :value="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分值(本题总值)" label-width="130px" prop="Scores">
					<el-input v-model.number="Lform.Scores" placeholder="例:2"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">关 闭</el-button>
				<el-button type="primary" @click="dialogLSure()">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗（修改试卷头） -->
		<el-dialog title="试卷基本信息" :visible.sync="dialogHeaderForm" :close-on-click-modal="false" :destroy-on-close="true">
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
				<el-button @click="dialogHeaderForm = false">取 消</el-button>
				<el-button type="primary" @click="headerFormSure()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 页面 -->
		<div class="content" :model="showContent">
			<!-- 名称 -->
			<el-popover placement="top" width="200" trigger="hover">
				<el-button size="mini" @click="dialogL = true">添加题型</el-button>
				<el-button size="mini" @click="dialogHeaderForm = true">修改基本信息</el-button>
				<div class="title_bg" slot="reference">{{showContent.Name}}</div>
			</el-popover>
			<div style="display: flex;">
				<div class="container">
					<!-- 试卷头 -->
					<div class="header">
						<div class="allRight">
							<div class="right">
								<div>适用课程： <span>{{showContent.Course}}</span></div>
								<div>试卷总分： <span>{{showContent.Scores}}</span></div>
								<div>考试时间(建议)： <span>{{showContent.Length}}分钟</span></div>
								<!-- <div>创建者： <span>{{showContent.Creator}}</span></div> -->
								<el-button @click="poin=!poin" type="mini">
									<i v-if="poin==true" class="el-icon-caret-top"></i>
									<i v-if="poin==false" class="el-icon-caret-bottom"></i>
								</el-button>
							</div>
							<div class="hide" v-show="poin==true">
								<div class="one">适用范围： <span>{{showContent.AppScope}}</span>
								</div>
								<div class="two">考察范围： <span>{{showContent.InvScope}}</span>
								</div>
							</div>
							<div class="hide" v-show="poin==true">
								<div class="one">前置知识： <span>{{showContent.Knowledge}}</span>
								</div>
								<div class="two">试卷说明： <span>{{showContent.Explain}}</span>
								</div>
							</div>
							<div class="hide" v-show="poin==true">
								<div class="one">试卷结构： <span>{{showContent.Chart}}</span>
								</div>
								<div class="two">基本要求： <span>{{showContent.Request}}</span>
								</div>
							</div>
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
					<!-- 算分表格 -->
					<table class="score" style="display: table;">
						<thead>
							<tr>
								<th>#</th>
								<th v-if="PnumList.length>0">第1大题</th>
								<th v-if="PnumList.length>1">第2大题</th>
								<th v-if="PnumList.length>2">第3大题</th>
								<th v-if="PnumList.length>3">第4大题</th>
								<th v-if="PnumList.length>4">第5大题</th>
								<th v-if="PnumList.length>5">第6大题</th>
								<th v-if="PnumList.length>6">第7大题</th>
								<th v-if="PnumList.length>7">第8大题</th>
								<th class="r_th">总分</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>得分</td>
								<td v-if="PnumList.length>0"></td>
								<td v-if="PnumList.length>1"></td>
								<td v-if="PnumList.length>2"></td>
								<td v-if="PnumList.length>3"></td>
								<td v-if="PnumList.length>4"></td>
								<td v-if="PnumList.length>5"></td>
								<td v-if="PnumList.length>6"></td>
								<td v-if="PnumList.length>7"></td>
								<td class="black14 r_td" style="border-bottom: 0px"></td>
							</tr>
							<tr class="tr1">
								<td>阅卷人</td>
								<td v-if="PnumList.length==1" colspan="1"></td>
								<td v-if="PnumList.length==2" colspan="2"></td>
								<td v-if="PnumList.length==3" colspan="3"></td>
								<td v-if="PnumList.length==4" colspan="4"></td>
								<td v-if="PnumList.length==5" colspan="5"></td>
								<td v-if="PnumList.length==6" colspan="6"></td>
								<td v-if="PnumList.length==7" colspan="7"></td>
								<td v-if="PnumList.length==8" colspan="8"></td>
								<td class="r_td"></td>
							</tr>
						</tbody>
					</table>
					<!-- 题目 -->
					<div class="topic">
						<el-popover placement="top" width="200" trigger="hover">
							<el-button size="mini" @click="selectHandel()">选题</el-button>
							<el-collapse v-model="activeNames" @change="handleChange" slot="reference">
								<el-collapse-item class="section" v-for="(item,index) in PnumList" :key='index' :title="item.Pnum+' . '+item.Pname+'题（'+item.Scores+'）分'"
								 :name="item.Pnum">
									<ul v-if="item.Pname=='单选'" class="item">
										<li v-for="(item,index) in CnumDanxuan" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="opation">A : {{item.OpationA}}</li>
												<li class="opation">B : {{item.OpationB}}</li>
												<li class="opation">C : {{item.OpationC}}</li>
												<li class="opation">D : {{item.OpationD}}</li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='判断'" class="item">
										<li v-for="(item,index) in CnumPanduan" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='多选'" class="item">
										<li v-for="(item,index) in CnumDuoxuan" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="opation">A : {{item.OpationA}}</li>
												<li class="opation">B : {{item.OpationB}}</li>
												<li class="opation">C : {{item.OpationC}}</li>
												<li class="opation">D : {{item.OpationD}}</li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='上机'" class="item">
										<li v-for="(item,index) in CnumShangji" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='填空'" class="item">
										<li v-for="(item,index) in CnumTiankong" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='简答'" class="item">
										<li v-for="(item,index) in CnumJianda" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
									<ul v-if="item.Pname=='编程'" class="item">
										<li v-for="(item,index) in CnumBiancheng" class="list">
											<ul>
												<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span><i class="el-icon-delete"
													 @click="deletePerson(item,index)"></i></li>
												<li class="anwser">参考答案 ：{{item.Anwser}}</li>
											</ul>
										</li>
									</ul>
								</el-collapse-item>
							</el-collapse>
						</el-popover>
					</div>
				</div>
				<div class="set">
					<nav style="position:fixed;right:30px;top:300px;">
						<a class="nav1" v-for="(item, index) in PnumList" :key="index" @click="jump(index)" :class="index==0?'current':''">{{item.Pnum+' . '+item.Pname}}</a>
						<div class="set" style="margin-bottom: 5px;">
							<el-button @click="dialogL = true">添加题型</el-button>
						</div>
						<div class="set" style="margin-bottom: 5px;">
							<el-button @click="selectHandel()">添加题目</el-button>
						</div>
						<div class="set" style="margin-bottom: 5px;">
							<el-button @click="dialogHeaderForm = true">修改信息</el-button>
						</div>
						<div class="set">
							<el-button>
								<el-link v-text="activeText" :underline="false" @click="active()"></el-link>
							</el-button>
						</div>
					</nav>
				</div>
			</div>
		</div>
	</div>
	</div>

</template>

<script>
	import { Joggle } from '@/api/index.js';
	import $ from 'jquery';
	export default {
		props: ['id'],
		data() {
			return {
				activeText: "一键展开",
				btnText: "点击切换为无答案版本",
				// 锚点
				scroll: '',
				// 
				null: "",
				null1: "",
				// 筛选
				selectForm: {
					Course: "",
					Category: "",
				},
				// 分页
				total: 0, // 分页总条数
				pageIndex: "1", //第几页	
				// 选题
				CnumDanxuan: [],
				CnumPanduan: [],
				CnumDuoxuan: [],
				CnumShangji: [],
				CnumTiankong: [],
				CnumJianda: [],
				CnumBiancheng: [],
				dialogSelect: false,
				tableData: [],
				PnumList: [], //大题
				activeNames: ['1'], //折叠
				// 添加大题
				options: [{
					label: "单选"
				}, {
					label: "多选"
				}, {
					label: "填空"
				}, {
					label: "判断"
				}, {
					label: "简答"
				}, {
					label: "编程"
				}, {
					label: "上机"
				}],
				dialogL: false, //大题弹框
				poin: false,
				Lform: {
					PaperID: "",
					Pnum: "",
					Pname: "",
					Scores: "",
					// Cnum: 0,
					QuestionID: null
				}, // 添加大题表单
				Sform: {
					PaperID: "",
					Pnum: null,
					Pname: null,
					Scores: "",
					// Cnum: "",
					QuestionID: null
				}, // 添加小题表单
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
				dialogHeaderForm: false, //试卷头弹框
				// 修改试卷头
				headerForm: {
					ID: '',
					Name: '',
					Course: '',
					Scores: "",
					Length: "",
					Chart: '',
					AppScope: '',
					InvScope: '',
					Knowledge: '',
					Request: '',
					Explain: '',
					IsPublic: "",
					Browses: "",
					Collects: "",
					Status: "inactive",
					CreatorID: "",
					Creator: "",
					CreateDate: "",
					UpdateDate: ""
				},
				showContent: [], //页面展示的信息
				rules: {
					Name: { required: true, message: '名称不能为空', trigger: 'blur' },
					Course: { required: true, message: '课程不能为空', trigger: 'blur' },
					Pnum: { required: true, message: '题号不能为空', trigger: 'blur' },
					Pname: { required: true, message: '不能题型为空', trigger: 'blur' },
					Scores: { required: true, message: '分值不能为空', trigger: 'blur', type: "number" },
				}
			};
		},
		watch: {
			'Type': function(newValue, old) {
				this.loadCourse(newValue)
			},
			scroll: function() {
				this.loadSroll()
			}

		},
		mounted() {
			window.addEventListener('scroll', this.dataScroll);
		},

		methods: {
			// 关闭添加大题
			cancel() {
				this.dialogL = false
				this.$refs.Lform.resetFields()
			},
			// 
			active() {
				if (this.activeText == "一键展开") {
					this.activeNames = ["1", '2', '3', "4", "5", "6", "7"]
					this.activeText = "一键折叠"
				} else {
					this.activeNames = []
					this.activeText = "一键展开"
				}
			},
			// 删除小题(多选)
			deletePerson(item, index) {
				this.$confirm('确定删除该小题吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var data = {
						"FuncCode": "DelPaI",
						"Data": [
							[{
								"PaperID": this.id,
								"QuestionID": item.ID
							}]
						],
					}
					Joggle.del({ Content: JSON.stringify(data) }).then((response) => {
						if (response.indexOf("Fail:") == -1) {
							this.$message.success('成功删除该小题');
							this.loadInfo()
						} else {
							this.$message.warning(response);
						}
					}).catch((response) => {
						this.$message.error(error);
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			// 锚点二号
			dataScroll: function() {
				this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
			},
			jump(index) {
				let jump = document.getElementsByClassName('section');
				// 获取需要滚动的距离
				let total = jump[index].offsetTop;
				// Chrome
				document.body.scrollTop = total;
				// Firefox
				document.documentElement.scrollTop = total;
				// Safari
				window.pageYOffset = total;
				$('html, body').animate({
					'scrollTop': total
				}, 400);
			},
			loadSroll: function() {
				var self = this;
				var $navs = $(".nav1");
				var sections = document.getElementsByClassName('section');
				for (var i = sections.length - 1; i >= 0; i--) {
					if (self.scroll >= sections[i].offsetTop - 100) {
						$navs.eq(i).addClass("current").siblings().removeClass("current")
						break;
					}
				}
			},
			// 点击重置
			async again() {
				this.selectForm.Category = ""
				this.selectForm.Course = ''
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							null,
							this.headerForm.Course,
							"1"
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
						this.dialogSelect = true
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 点击筛选
			async sift() {
				if (this.selectForm.Category == "") {
					this.null = null
				} else {
					this.null = this.selectForm.Category
				}
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							this.null,
							this.headerForm.Course,
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
			// 导入小题
			async enterHandle(index, row) {
				this.Sform.Scores = row.Score
				this.Sform.QuestionID = row.ID
				var data = {
					"FuncCode": "AddPaI",
					"Data": [
						[this.Sform],
					]
				}
				await Joggle.post(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						this.$message.success('添加成功');
						this.dialogSelect = true
						this.loadInfo()
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 添加大题保存
			async dialogLSure() {
				this.Lform.Scores = parseInt(this.Lform.Scores)
				this.Lform.QuestionID = this.Lform.Pnum
				var data = {
					"FuncCode": "AddPaI",
					"Data": [
						[this.Lform],
					]
				}
				this.$refs.Lform.validate(async (valid) => {
					if (valid) {
						await Joggle.post(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加成功');
								this.dialogL = false
								this.loadInfo()
								this.Lform = {}
							} else {
								this.$message.warning(response);
							}
						})
					}
				})
			},
			// 修改表头保存
			async headerFormSure() {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.headerForm.UpdateDate = time
				var data = {
					"FuncCode": "ChgPaH",
					"Data": [
						[this.headerForm],
					]
				}
				this.$refs.headerForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('修改成功');
								this.dialogHeaderForm = false
								this.showContent = this.headerForm
							} else {
								this.$message.warning(response);
							}
						})
					}
				})
			},
			// 折叠
			handleChange(val) {
				if (val.length > 1) {
					this.Sform.Pname = val[1].split(" . ")[1]
					this.Sform.Pnum = val[1].split(" . ")[0]
				}
			},
			// 载入本试卷信息
			async loadInfo() {
				let id = this.id.toString();
				var data = {
					"FuncCode": "GetPa",
					"Data": {
						"Params": [id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.showContent = jsonObj.Table[0]
						this.headerForm = jsonObj.Table[0]
						this.Lform.PaperID = jsonObj.Table[0].ID
						this.Sform.PaperID = jsonObj.Table[0].ID
						this.PnumList = jsonObj.Table1.filter((e => { return e.QuestionID === e.Pnum }))

						function sortId(a, b) {
							return a.Pnum - b.Pnum
						}
						this.PnumList.sort(sortId)
						this.CnumDanxuan = jsonObj.Table2.filter((e => { return e.Category == '单选' }))
						this.CnumDuoxuan = jsonObj.Table2.filter((e => { return e.Category == '多选' }))
						this.CnumTiankong = jsonObj.Table2.filter((e => { return e.Category == '填空' }))
						this.CnumPanduan = jsonObj.Table2.filter((e => { return e.Category == '判断' }))
						this.CnumJianda = jsonObj.Table2.filter((e => { return e.Category == '简答' }))
						this.CnumShangji = jsonObj.Table2.filter((e => { return e.Category == '上机' }))
						this.CnumBiancheng = jsonObj.Table2.filter((e => { return e.Category == '编程' }))
					} else {
						this.$message.warning(response);
					}
				})
			},
			async loadList() {
				// 2.获取用户信息
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
					}
				})
				// 获取类别
				this.loadType()
			},
			// 选题列表
			async selectHandel() {
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							null,
							null,
							this.headerForm.Course,
							"1"
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
						this.dialogSelect = true
					} else {
						this.$message.warning(response);
					}
				})
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
					}
				})
			},

		},
		created() {
			this.loadList();
			this.loadInfo() //载入列表
		},
	};
</script>

<style lang="scss">
	.onePaper {
		background-color: white;

		// 算分表格
		.score {
			width: 100%;
			margin-bottom: 20px;
			border-spacing: 0;
			font-size: 16px;

			th {
				border-top: 1px solid #AEB6BA;
				border-left: 1px solid #AEB6BA;
				background: #f2f2f2;
			}

			td {
				border-left: 1px solid #AEB6BA;
				text-align: center;
			}

			th,
			td {
				padding: 2px 5px 2px 10px;
				line-height: 30px;
				border-bottom: 1px solid #aeb6ba
			}

			.r_th,
			.r_td {
				border-right: 1px solid #AEB6BA;
			}
		}

		// 锚点
		.nav1 {
			font-size: 14px;
			display: block;
			width: 100px;
			height: 40px;
			text-align: center;
			line-height: 40px;
			background: #eee;
			margin: 10px 0;
		}

		.current {
			color: #fff;
			background: red;
		}

		// 页面内容
		.block {
			padding-top: 20px;
		}

		.content {

			// 题目格式
			.stem {
				padding: 3px 0;
				margin-bottom: 5px;
			}

			.opation {
				padding: 3px 0;
				margin-left: 30px;
			}

			.anwser {
				padding-top: 3px;
				color: #008000;
			}

			.el-icon-delete {
				color: red;
			}

			a {
				color: #2C3E50;
			}

			.item {
				padding: 1px 0;
			}

			.list {
				padding: 5px 0;
				font-size: 16px;
			}

			.container {
				width: 90%;
			}

			.left {
				.set {
					margin: 10px 5px;
				}
			}

			ul,
			li {
				list-style: none;
			}

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
					font-size: 16px;

					span {
						color: #3a87ad;
					}

					.right {
						display: flex;
						justify-content: space-between;
						line-height: 28px;
					}

					.hide {
						margin-top: 10px;
						clear: both;

						span {
							color: #3a87ad;
						}

						.one {
							float: right;
							width: 48%;
							margin-top: 10px;
						}

						.two {
							float: left;
							width: 50%;
							margin-top: 10px;
						}
					}
				}
			}

			.notice {
				color: #ff0000;
				line-height: 24px;
				padding: 10px;
			}

			// 折叠
			.topic {
				width: 100%;

				.item {
					.list {
						margin-bottom: 5px;
						border: 1px solid transparent;

						.el-button {
							margin: 10px 0;
						}
					}

					.list:hover {
						border: 1px solid #CCCCCC;
					}
				}

				.el-collapse {
					border: 0;
				}

				.el-collapse-item__header {
					background: #f4f4f4;
					border: 1px solid #E1E1E1;
					height: auto;
					padding: 5px;
					font-weight: bold;
					line-height: 30px;
					font-size: 16px;
					margin-bottom: 10px
				}

				.el-collapse-item__content {
					padding-bottom: 15px;
				}
			}
		}
	}
</style>
