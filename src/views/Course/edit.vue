<template>
	<div class="courseDetail">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom:10px">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>课程公示</el-breadcrumb-item>
			<el-breadcrumb-item>我的课程</el-breadcrumb-item>
			<el-breadcrumb-item>{{headerForm.Name}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs type="border-card" @tab-click="handleClick">
			<el-tab-pane label="课程介绍">
				<div class="content">
					<div class="left">
						<div class="photo">
							<img :src="headerForm.Photo" class="img" ref="img" />
						</div>
						<el-form :model="headerForm" :rules="rules" ref="headerForm" class="demo-ruleForm">
							<el-form-item prop="Photo">
								<input @change='Photo' type="file" style="width: 180px;margin-top: 30px;">
							</el-form-item>
						</el-form>
					</div>
					<div class="text">
						<div class="title"><i class="el-icon-caret-right"></i> 课程信息</div>
						<el-form :model="headerForm" :rules="rules" ref="headerForm" label-width="85px" class="demo-ruleForm">
							<el-form-item label="所属架构:" prop="ChartMap">
								<el-cascader :show-all-levels="false" :props="defaultParams" :options="options" v-model="headerForm.ChartMap"
								 @change="ChangeMap" placeholder="请选择专业名称"></el-cascader>
							</el-form-item>
							<el-form-item label="课程名称:" prop="Name">
								<el-input v-model="headerForm.Name"></el-input>
							</el-form-item>
							<el-form-item label="所属教材:" prop="Book">
								<el-input v-model="headerForm.Book"></el-input>
							</el-form-item>
							<el-form-item label="学分:" prop="Scores">
								<el-input v-model.number="headerForm.Scores" placeholder="例:2"></el-input>
							</el-form-item>
							<el-form-item label="周课时:" prop="WeekPeriod">
								<el-input v-model.number="headerForm.WeekPeriod" placeholder="例:5"></el-input>
							</el-form-item>
							<el-form-item label="总课时:" prop="TotalPeriod">
								<el-input v-model.number="headerForm.TotalPeriod" placeholder="例:5"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="title"><i class="el-icon-caret-right"></i> 教学目标</div>
				<div class="aim">
					<el-form :model="headerForm" :rules="rules" ref="headerForm" class="demo-ruleForm">
						<el-form-item prop="Target">
							<el-input type="textarea" v-model="headerForm.Target"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="scop">
					<el-button @click="editHandle()">保存修改</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="课程文件">
				<el-upload class="upload-demo" action="http://27.223.90.126:7777/Core/UploadFile" :on-success="handleSuccessFile"
				 :on-error="handleError" multiple :file-list="fileList" accept=".pdf" :headers="importHeaders">
					<el-button size="small" plain="">点击选择课程文件</el-button>
					<span>*只能上传pdf文件</span>
				</el-upload>
				<div class="content">
					<div class="file">
						{{this.filetext}}
						<pdf :src="pdfurl" :page="currentPage" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler"
						 style="width: 100%;"></pdf>
						<div class="scop">
							<span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
							{{currentPage}} / {{pageCount}}
							<span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</span>
						</div>
					</div>
					<div class="category">
						<div class="title"><i class="el-icon-caret-right"></i> 目录</div>
						<div v-for="(item, index) in file" class="item" @click="fileHandle(item,index)">
							<el-link :underline="false">{{index+1}}.{{item.Filename}}</el-link>
							<el-link size="mini" type="danger" style="margin-left: 10px;" @click='deleteHandle(item,index)'>删除</el-link>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="课件资源">
				<el-upload class="upload-demo1" action="http://27.223.90.126:7777/Core/UploadFile" :on-success="handleSuccessVideo"
				 :on-error="handleError" :before-upload="beforeUploadVideo" multiple :file-list="videoList" accept=".mp4" :headers="importHeaders">
					<el-button size="small" plain="">点击选择课程资源</el-button>
					<span>*只能上传mp4文件且不大于2000M</span>
				</el-upload>
				<div class="content">
					<div class="video">
						<video-player class="vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
					</div>
					<div class="category">
						<div class="title"><i class="el-icon-caret-right"></i> 目录</div>
						<div v-for="(item, index) in video" class="item" @click="videoHandle(item,index)">
							<el-link :underline="false">{{index+1}}.{{item.Filename}}</el-link>
							<el-link size="mini" type="danger" style="margin-left: 10px;" @click='deleteVideoHandle(item,index)'>删除</el-link>
						</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	var mytoken = sessionStorage.token
	import pdf from 'vue-pdf'
	import { Joggle } from '@/api/index.js';
	export default {
		props: ['id'],
		components: {
			pdf
		},
		data() {
			return {
				videoList: [],
				fileList: [],
				filename: '',
				videoname: '',
				importHeaders: { token: mytoken },
				options: [], //所属架构
				defaultParams: {
					checkStrictly: true,
					label: 'Name',
					value: 'ID',
					children: 'children'
				}, //所属架构
				headerForm: {},
				filetext: '请选择右侧要查看的文件',
				file: [],
				video: [],
				pdfurl: '',
				currentPage: 0, // pdf文件页码当前展示的
				pageCount: 0, // pdf文件总页数
				playerOptions: {
					playbackRates: [0.5, 1.0, 1.5, 2.0], //播放速度
					autoplay: false, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: 'zh-CN', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					aspectRatio: '16:9', // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					fluid: true,
					sources: [{
						type: "video/mp4", //类型
						src: '', //url地址
					}],
					poster: '', //你的封面地址
					notSupportedMessage: '请选择要播放的视频', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						fullscreenToggle: true //全屏按钮
					},
				},
				rules: {
					Name: { required: true, message: '课程名称不能为空', trigger: 'blur' },
					Scores: { required: true, type: 'number', message: '学分必须为数字值且不能为空', trigger: 'blur' },
					WeekPeriod: { required: true, type: 'number', message: '周课时必须为数字值且不能为空', trigger: 'blur' },
					TotalPeriod: { required: true, type: 'number', message: '总课时必须为数字值且不能为空', trigger: 'blur' },
					Target: { required: true, message: '教学目标不能为空', trigger: 'blur' },
					Book: { required: true, message: '所属教材不能为空', trigger: 'blur' },
					ChartMap: { required: true, message: '所属架构不能为空', trigger: 'blur' },
				}
			}
		},
		created() {
			this.loadList()
			this.loadMap()
		},
		methods: {
			//失败
			handleError(err, file, fileList) {
				this.$notify.error({
					title: '错误',
					message: `文件上传失败`
				});
			},
			// 上传pdf文件之前
			beforeUploadFile(file) {
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
				if (extension !== 'pdf') {
					this.$message.warning('只能上传pdf文件')
					return false
				}
			},
			// 上传video之前
			beforeUploadVideo(file) {
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
				let size = file.size / 1024 / 1024
				if (extension !== 'mp4') {
					this.$message.warning('只能上传mp4文件')
					return false
				}
				if (size > 2000) {
					this.$message.warning('文件大小不得超过2000M')
					return false
				}
			},
			// pdf成功
			handleSuccessFile(res, file, fileList) {
				if (res.indexOf("Fail:") == -1) {
					this.filename = res
					var data = {
						"FuncCode": "AddCozF",
						"Data": [
							[{
								"CouresID": this.headerForm.ID,
								"Filename": this.filename
							}]
						]
					}
					Joggle.post(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加课程文件成功');
								this.loadList()
							} else {
								this.$message.warning(response);
							}
						})
				} else {
					this.$message.warning(res);
				}
			},
			// video成功
			handleSuccessVideo(res, file, videoList) {
				if (res.indexOf("Fail:") == -1) {
					this.videoname = res
					var data = {
						"FuncCode": "AddCozM",
						"Data": [
							[{
								"CouresID": this.headerForm.ID,
								"Filename": this.videoname
							}]
						]
					}
					Joggle.post(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('添加课程资源成功');
								this.loadList()
							} else {
								this.$message.warning(response);
							}
						})
				} else {
					this.$message.warning(res);
				}
			},
			// 删除video
			deleteVideoHandle(item, index) {
				var data = {
					"Filename": item.Filename
				}
				Joggle.delFile(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var data = {
							"FuncCode": "DelCozM",
							"Data": [
								[{ ...item }]
							]
						}
						Joggle.del({ Content: JSON.stringify(data) })
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('删除成功')
									this.video.splice(index, 1)
								} else {
									this.$message.warning(response)
								}
							})
					}
				})
			},
			// 删除pdf
			deleteHandle(item, index) {
				var data = {
					"Filename": item.Filename
				}
				Joggle.delFile(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var data = {
							"FuncCode": "DelCozF",
							"Data": [
								[{ ...item }]
							]
						}
						Joggle.del({ Content: JSON.stringify(data) })
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('删除成功')
									this.file.splice(index, 1)
								} else {
									this.$message.warning(response)
								}
							})
					} else {
						this.$message.warning(response)
					}
				})
			},
			// 修改头
			editHandle() {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.headerForm.CreatorID = sessionStorage.id
				this.headerForm.UpdateDate = time
				var data = {
					"FuncCode": "ChgCozH",
					"Data": [
						[{ ...this.headerForm }]
					]
				}
				this.$refs.headerForm.validate(
					async (valid) => {
						if (valid) {
							await Joggle.put(data)
								.then((response) => {
									if (response.indexOf("Fail:") == -1) {
										this.$message.success('修改成功');
										this.Fileshow = true
									} else {
										this.$message.warning(response);
									}
								})
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
			// 载入
			async loadList() {
				let id = this.id;
				var data = {
					"FuncCode": "GetCozW",
					"Data": {
						"Params": [id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.headerForm = jsonObj.Table[0]
						this.file = jsonObj.Table1
						this.video = jsonObj.Table2
					}
				})
			},
			loadMap() {
				// 获取架构列表
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
			// 所属架构
			ChangeMap(value) {
				this.headerForm.ChartMap = value[value.length - 1]
			},
			// 教材图片
			Photo(event) {
				var reader = new FileReader(); //创建读取文件的方法
				var img = event.target.files[0];
				reader.readAsDataURL(img); //将文件已url的形式读入页面
				var that = this;
				reader.onload = function(e) {
					that.headerForm.Photo = reader.result;
				}
			},
			// 选择视频
			videoHandle(item, index) {
				this.playerOptions['sources'][0]['src'] = "http://27.223.90.126:7777/Core/Multimedia?Token=" + encodeURIComponent(
					sessionStorage.token) + '&Filename=' + item.Filename
			},
			// 选择文件
			fileHandle(item, index) {
				var headers = {
					'Token': sessionStorage.token,
				};
				this.pdfurl = pdf.createLoadingTask({
					url: 'http://27.223.90.126:7777/Core/DownloadFile?Filename=' + item.Filename,
					httpHeaders: headers
				});
				this.filetext = ""
			},

			// 切换标签
			handleClick(tab, event) {
				if (tab.label == "课程介绍") {

				}
				if (tab.label == "课程文件") {

				}
				if (tab.label == "课件资源") {

				}
			},
			// pdf改变页码
			changePdfPage(val) {
				if (val === 0 && this.currentPage > 1) {
					this.currentPage--
				}
				if (val === 1 && this.currentPage < this.pageCount) {
					this.currentPage++
				}
			},
			// pdf加载时
			loadPdfHandler(e) {
				this.currentPage = 1 // 加载的时候先加载第一页
			},
		}
	}
</script>

<style lang="scss">
	.courseDetail {
		font-size: 14px;

		ul,
		li {
			list-style: none;
		}

		.grey {
			color: gray;
		}

		.scop {
			margin-top: 20px;
			text-align: center;
		}

		.el-tabs {
			// margin: 0 auto;
			margin-top: 20px;

			.content {
				display: flex;

				.title {
					width: 100%;
					margin: 0 0 10px 0;
					font-weight: bold;
					line-height: 36px;
					border-bottom: 2px solid #0095DD;
				}

				// pdf
				.file {
					width: 100%;
				}

				.category {
					min-width: 300px;
					width: auto;

					.item {
						margin: 10px 0;
						margin-left: 25px;
					}
				}

				//视频播放器
				.video {
					width: 100%;
					margin-right: 20px;
					margin-top: 10px;
				}

				.left {
					width: 220px;
					height: 300px;
					line-height: 300px;
					margin-right: 20px;
				}

				.photo {
					text-align: center;
					border: 1px solid #DDDDDD;

					img {
						width: auto;
						height: auto;
						max-width: 100%;
						max-height: 100%;
					}
				}

				.text {
					width: 100%;

					.list {
						display: flex;
						line-height: 34px;
						border-bottom: 1px solid #DDDDDD;

						.name {
							margin-right: 30px;
						}

						.name1 {
							margin-right: 45px;
						}
					}
				}
			}

			.title {
				font-weight: bold;
				line-height: 36px;
				border-bottom: 2px solid #0095DD;
				margin-bottom: 10px;
			}

			.aim {
				background-color: #f4f4f4;
				border: 1px dashed #b3b3b3;
				border-radius: 4px;
				font-size: 14px;
				line-height: 26px;
				padding: 10px 5px;
			}
		}
	}
</style>
