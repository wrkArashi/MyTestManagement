<template>
	<div class="nav-bar">
		<div class="logo">
			<img src="../assets/logo-t.png" alt="">
			<!-- <i @click="collapseMenu" class="el-icon-s-unfold"></i> -->
		</div>
		<div class="logo">
			<div>
				<router-link to="/operate/collect"><i class="el-icon-star-off operate"></i></router-link>
				<router-link to="/operate/recycle"><i class="el-icon-delete operate1"></i></router-link>
			</div>
			<el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="white" text-color="black"
			 active-text-color="rgb(255,99,103)">
				<el-submenu index="1">
					<!-- userInfo是从仓库取出来的 -->
					<template slot="title">{{userInfo.Name}}</template>
					<el-menu-item index="1-1">消息</el-menu-item>
					<router-link to="/manage/user" style="color: #000000;">
						<el-menu-item index="1-2">
							个人信息
						</el-menu-item>
					</router-link>
					<router-link to="/manage/revisePwd" style="color: #000000;">
						<el-menu-item index="1-3">
							修改密码
						</el-menu-item>
					</router-link>
					<router-link to="/manage/reviseEmail" style="color: #000000;">
						<el-menu-item index="1-4">
							修改邮箱
						</el-menu-item>
					</router-link>
					<router-link to="/login" style="color: #000000;">
						<el-menu-item index="1-3">
							退出登录
						</el-menu-item>
					</router-link>
				</el-submenu>
			</el-menu>
		</div>

	</div>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				activeIndex2: '1',
			};
		},

		// 暂时留着
		created() {
			this.loadInfo()
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['collapseMenu']),
			// 获取用户的数据显示到右上角			
			...mapActions(['loadInfo'])
		}
	}
</script>

<style lang="scss">
	.nav-bar {
		font-size: 16px;
		display: flex;
		justify-content: space-between;

		.logo {
			display: flex;
			justify-content: space-between;
			align-items: center;

			img {
				height: 40px;
				padding-right: 3px;
			}
		}

		.logo :hover {
			color: rgb(255, 99, 103);
		}

		.operate {
			margin-right: 20px;
		}

		.operate1 {
			margin-right: 10px;
		}
	}
</style>
