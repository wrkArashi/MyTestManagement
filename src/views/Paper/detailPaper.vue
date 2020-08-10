<template>
	<div class="detailPaper">
		<el-button size="mini" v-text="btnText" @click="see()" style="margin-bottom: 5px;margin-right: 5px;"></el-button>
		<el-button size="mini" @click="getPdf()" style="margin-bottom: 5px;margin-right: 5px;">保存为PDF</el-button>
		<el-link v-text="activeText" :underline="false" @click="active()"></el-link>
		<!-- 页面 -->
		<div class="content" :model="showContent" id="cpbg">
			<div class="left">
				<!-- 名称 -->
				<div class="title_bg">{{showContent.Name}}</div>
				<div>
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
						<el-collapse v-model="activeNames" @change="handleChange" slot="reference">
							<el-collapse-item class="section" v-for="(item,index) in PnumList" :key='index' :title="item.Pnum+' . '+item.Pname+'题（'+item.Scores+'）分'"
							 :name="item.Pnum">
								<ul v-if="item.Pname=='单选'" class="item">
									<li v-for="(item,index) in CnumDanxuan" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="opation">A ：{{item.OptionA}}</li>
											<li class="opation">B ：{{item.OptionB}}</li>
											<li class="opation">C ：{{item.OptionC}}</li>
											<li class="opation">D ：{{item.OptionD}}</li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='判断'" class="item">
									<li v-for="(item,index) in CnumPanduan" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='多选'" class="item">
									<li v-for="(item,index) in CnumDuoxuan" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="opation">A : {{item.OptionA}}</li>
											<li class="opation">B : {{item.OptionB}}</li>
											<li class="opation">C : {{item.OptionC}}</li>
											<li class="opation">D : {{item.OptionD}}</li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='上机'" class="item">
									<li v-for="(item,index) in CnumShangji" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='填空'" class="item">
									<li v-for="(item,index) in CnumTiankong" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='简答'" class="item">
									<li v-for="(item,index) in CnumJianda" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
								<ul v-if="item.Pname=='编程'" class="item">
									<li v-for="(item,index) in CnumBiancheng" class="list">
										<ul>
											<li class="stem"><span>{{index+1}} ：</span><span>{{item.Stem}}【{{item.Score}}分】</span></li>
											<li class="anwser" v-if="isShow">参考答案 ：{{item.Anwser}}</li>
										</ul>
									</li>
								</ul>
							</el-collapse-item>
						</el-collapse>
					</div>
				</div>
			</div>
			<div class="empty"></div>
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
				isShow: true,
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
				poin: false,
				Lform: {
					PaperID: "",
					Pnum: "",
					Pname: "",
					Scores: "",
					Cnum: 0,
					QuestionID: null
				}, // 添加大题表单
				Sform: {
					PaperID: "",
					Pnum: null,
					Pname: null,
					Scores: "",
					Cnum: "",
					QuestionID: null
				}, // 添加小题表单
				Type: "", //类别
				optionsFirst: [], // 试卷头选择课程（类别）
				optionsSecond: [], // 试卷头选择课程（课程）
				showContent: [], //页面展示的信息
			};
		},
		methods: {
			active() {
				if (this.activeText == "一键展开") {
					this.activeNames = ["1", '2', '3', "4", "5", "6", "7"]
					this.activeText = "一键折叠"
				} else {
					this.activeNames = []
					this.activeText = "一键展开"
				}
			},
			// 打印
			see() {
				this.isShow = !this.isShow
				if (this.isShow) {
					this.btnText = "点击切换为无答案版本"
				} else {
					this.btnText = "点击切换为有答案版本"
				}
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
				let id = this.id;
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
		},
		created() {
			this.loadInfo() //载入列表
		},
	};
</script>

<style lang="scss">
	.detailPaper {

		// 算分表格
		.score {
			width: 100%;
			margin-bottom: 20px;
			margin-top: 20px;
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

		.current {
			color: #fff;
			background: red;
		}

		// 页面内容
		.block {
			padding-top: 20px;
		}

		.content {
			background-color: white;
			width: 100%;
			display: flex;

			.left {
				width: 99.9%;
			}

			.empty {
				width: 0.1%;
			}


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
				padding: 5px 0;
			}

			.header {
				display: flex;
				justify-content: space-around;

				.allRight {
					width: 100%;
					background-color: #d9edf7;
					padding: 8px 35px 8px 14px;
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

			// 折叠
			.topic {
				width: 100%;

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
