<template>
	<div class="testMonitor">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>考试&监控</el-breadcrumb-item>
			<el-breadcrumb-item>考试监控</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 提示 -->
		<!-- <div class="title">【温馨提示】</div>
		<div class="tip">
			<div class="tip_one">在考试过程中，如果您发现考生的考试页面出现以下异常情况，请提醒考生尽快退出考试系统，然后重新进入考试！否则，将有可能出现无法保存考试答案的严重后果。</div>
			<div class="tip_two">1、页面内容显示混乱； 2、试题作答时，答案或作答状态显示异常； 3、答题卡显示异常； 4、点击试卷中的操作按钮时，显示错误信息或出现异常情况。</div>
		</div> -->
		<!-- 考试列表-->
		<!-- <div class="testList">
			<h4>英谷测试考试-客户端</h4>
			<div>类型：期末考试 Java程序设计</div>
			<div>时长：120分钟：2019-03-09：09：11~ 2020-04-04 09：59</div>
			<div>已延迟 0 分钟</div>
			<div>延迟</div>
			<div>
				<el-button size="mini">全部9</el-button>
				<el-button size="mini">已进入7</el-button>
				<el-button size="mini">未进入2</el-button>
				<el-button size="mini">已交卷</el-button>
				<el-button size="mini">未交卷</el-button>
			</div>
		</div> -->
		<!--  -->
		<!-- <div>查询</div> -->
		<!--  -->
		<!-- <div class="list">
			<li class="item">
				<div>很多学生</div>
			</li>
		</div> -->
	</div>
</template>

<script>
</script>

<style lang="scss">
	.testMonitor {

		// //温馨提示
		// .title {
		// 	color: #2c84b8;
		// 	font-size: 16px;
		// 	font-weight: bold;
		// 	padding: 0 15px;
		// 	height: 35px;
		// 	line-height: 35px;
		// 	margin: 10px auto 5px auto;
		// 	list-style: none;
		// 	background-color: #f5f5f5;
		// 	-webkit-border-radius: 5px;
		// 	-moz-border-radius: 5px;
		// 	border-radius: 5px
		// }

		// //提示内容
		// .tip {
		// 	font-size: 14px;
		// 	background-color: #fbfbd5;
		// 	padding: 3px;
		// 	margin-bottom: 15px;

		// 	.tip_one {
		// 		margin-bottom: 8px;
		// 		margin-left: 20px
		// 	}

		// 	.tip_two {
		// 		color: red;
		// 		margin-bottom: 8px;
		// 		margin-left: 20px
		// 	}
		// }

		// // 考试列表
		// .testList {
		// 	width: 32%;
		// 	border: 2px solid #e3e3e3;
		// 	height: 180px;
		// 	margin-right: 14px;
		// 	margin-bottom: 20px;

		// 	.item {
		// 		line-height: 20px;
		// 	}
		// }

	}
</style>
