<template>
	<div class="courseDetail">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom:10px">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>课程公示</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/course/hall' }">全部课程</el-breadcrumb-item>
			<el-breadcrumb-item>{{data.Name}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs type="border-card" @tab-click="handleClick">
			<el-tab-pane label="课程介绍">
				<div class="content">
					<div class="photo">
						<img :src="data.Photo" alt="">
					</div>
					<div class="text">
						<div class="title"><i class="el-icon-caret-right"></i> 课程信息</div>
						<div class="list">
							<div class="name">课程名称：</div>
							<div>{{data.Name}}</div>
						</div>
						<div class="list">
							<div class="name1">总学分：</div>
							<div>{{data.Scores}}</div>
						</div>
						<div class="list">
							<div class="name1">周课时：</div>
							<div>{{data.WeekPeriod}}</div>
						</div>
						<div class="list">
							<div class="name1">总课时：</div>
							<div>{{data.TotalPeriod}}</div>
						</div>
						<div class="list">
							<div class="name">课程类别：</div>
							<div>{{data.ChartMap}}</div>
						</div>
						<div class="list">
							<div class="name">推荐教材：</div>
							<div>{{data.Book}}</div>
						</div>
					</div>
				</div>
				<div class="title"><i class="el-icon-caret-right"></i> 教学目标</div>
				<div class="aim">
					{{data.Target}}
				</div>
			</el-tab-pane>
			<el-tab-pane label="课程文件">
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
						<div v-for="(item, index) in file" class="item" :value="item.CourseID" @click="fileHandle(item,index)">
							<el-link :underline="false">{{index+1}}.{{item.Filename}}</el-link>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="课件资源">
				<div class="content">
					<div class="video">
						<video-player class="vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
					</div>
					<div class="category">
						<div class="title"><i class="el-icon-caret-right"></i> 目录</div>
						<div v-for="(item, index) in video" class="item" :value="item.CourseID" @click="videoHandle(item,index)">
							<el-link :underline="false">{{index+1}}.{{item.Filename}}</el-link>
						</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import pdf from 'vue-pdf'
	import { Joggle } from '@/api/index.js';
	export default {
		props: ['id'],
		components: {
			pdf
		},
		data() {
			return {
				filetext: '请选择要查看的文件',
				file: [],
				video: [],
				data: [],
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
					}
				}
			}
		},
		created() {
			this.loadList()
		},
		methods: {
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
						this.data = jsonObj.Table[0]
						this.file = jsonObj.Table1
						this.video = jsonObj.Table2
					}
				})
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
			margin: 0 auto;
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

				.photo {
					text-align: center;
					width: 220px;
					height: 300px;
					line-height: 300px;
					margin-right: 20px;
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
