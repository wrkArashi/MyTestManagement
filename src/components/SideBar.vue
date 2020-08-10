<template>
	<div class="side-bar">
		<el-menu :collapse="isCollapse" class="el-menu-vertical-demo" :default-openeds="['1']">
			<el-menu-item index="10">
				<div v-show="show" @click="fold()"><i class="el-icon-s-fold"></i></div>
				<div v-show="cover" @click="unfold()"><i class="el-icon-s-unfold"></i></div>
			</el-menu-item>
			<el-submenu index="1">
				<template slot="title">
					<i class="el-icon-s-home"></i>
					<span>首页</span>
				</template>
				<router-link to="/index/list">
					<el-menu-item index="1-1">网站首页</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-folder-opened"></i>
					<span>题库管理</span>
				</template>
				<router-link to="/bank/hall">
					<el-menu-item index="2-1">试题大厅</el-menu-item>
				</router-link>
				<router-link to="/bank/mine">
					<el-menu-item index="2-2">我的题库</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<i class="el-icon-tickets"></i>
					<span>试卷管理</span>
				</template>
				<router-link to="/paper/hall">
					<el-menu-item index="3-1">试卷大厅</el-menu-item>
				</router-link>
				<router-link to="/paper/mine">
					<el-menu-item index="3-2">我的试卷</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="4">
				<template slot="title">
					<i class="el-icon-aim"></i>
					<span>考试&监控</span>
				</template>
				<router-link to="/test/list">
					<el-menu-item index="4-1">考试大厅</el-menu-item>
				</router-link>
				<router-link to="/test/mine">
					<el-menu-item index="4-5">我的考试</el-menu-item>
				</router-link>
				<router-link to="/test/new">
					<el-menu-item index="4-3">新建考试</el-menu-item>
				</router-link>
				<router-link to="/test/monitor">
					<el-menu-item index="4-2">考试监控</el-menu-item>
				</router-link>
				<router-link to="/test/statistics">
					<el-menu-item index="4-4">统计考试</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="5">
				<template slot="title">
					<i class="el-icon-medal"></i>
					<span>成绩管理</span>
				</template>
				<router-link to="/scores/online">
					<el-menu-item index="5-1">在线阅卷</el-menu-item>
				</router-link>
				<router-link to="/scores/enquire">
					<el-menu-item index="5-2">成绩查询</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="6">
				<template slot="title">
					<i class="el-icon-postcard"></i>
					<span>课程公示</span>
				</template>
				<router-link to="/course/hall">
					<el-menu-item index="6-1">课程大厅</el-menu-item>
				</router-link>
				<router-link to="/course/mine">
					<el-menu-item index="6-2">我的课程</el-menu-item>
				</router-link>
			</el-submenu>
			<el-submenu index="7">
				<template slot="title">
					<i class="el-icon-setting"></i>
					<span>维护管理</span>
				</template>
				<router-link to="/manage/company-chart">
					<el-menu-item index="7-1">公司架构</el-menu-item>
				</router-link>
				<router-link to="/manage/college-chart">
					<el-menu-item index="7-2">学院架构</el-menu-item>
				</router-link>
				<router-link to="/manage/courses-list">
					<el-menu-item index="7-3">课程管理</el-menu-item>
				</router-link>
				<router-link to="/manage/user-list">
					<el-menu-item index="7-4">用户管理</el-menu-item>
				</router-link>
				<router-link to="/manage/student-list">
					<el-menu-item index="7-5">学生管理</el-menu-item>
				</router-link>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	// import { mapState } from 'vuex';
	export default {
		data() {
			return {
				show: true,
				cover: false,
				isCollapse: false,
			}
		},
		computed: {
			// ...mapState(['isCollapse'])
		},
		methods: {
			fold() {
				this.isCollapse = true
				this.show = false
				this.cover = true
			},
			unfold() {
				this.isCollapse = false
				this.show = true
				this.cover = false
			}
		}
	}
</script>

<style lang="scss">
	.side-bar {
		.el-menu-item i {
			color: white
		}

		.side-bar .el-menu-item.is-active {
			color: white;
		}

		.el-menu-item.is-active {
			color: rgb(255, 99, 103);
		}

		.el-menu-item:focus,
		.el-menu-item:hover {
			outline: 0;
			background-color: rgb(87, 96, 161);
		}

		.el-menu-item {
			font-size: 0.18667rem;
			color: white;
			text-align: center;
		}

		a {
			text-decoration: none;
			color: white;
		}

		.el-submenu__title {
			color: white;
		}

		.el-submenu__title i {
			color: white;
		}

		.el-menu {
			border: 0;
			background-color: #434979;

			span {
				margin-right: 75px;
			}
		}

		.el-submenu__title:hover {
			background-color: rgb(87, 96, 161);
		}
	}
</style>
