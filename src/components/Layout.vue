<template>
	<el-container>
		<el-aside width="auto" style="overflow: hidden;">
			<SideBar></SideBar>
		</el-aside>
		<el-container>
			<el-header>
				<NavBar></NavBar>
			</el-header>
			<el-main>
				<router-view></router-view>
			</el-main>
			<el-footer style="height: auto;">
				<FooterBar></FooterBar>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script>
	import NavBar from "@/components/NavBar.vue";
	import SideBar from "@/components/SideBar.vue";
	import FooterBar from "@/components/FooterBar.vue";
	export default {
		components: {
			NavBar,
			SideBar,
			FooterBar
		}
	}
</script>

<style>
	a:-webkit-any-link {
		text-decoration: none;
	}

	.el-container {
		min-height: calc(100vh);
	}

	.el-aside {
		background-color: #434979;
		line-height: 320px;
	}

	.el-header {
		background-color: white;
		color: black;
		line-height: 60px;
	}

	.el-footer {
		font-size: 14px;
		text-align: center;
		line-height: 45px;
	}

	.el-main {
		background-color: rgb(241, 242, 247);
		color: #333;
	}
</style>
