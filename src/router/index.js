import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/Layout.vue'
import {
	Message
} from 'element-ui'

Vue.use(Router)
let router = new Router({
	routes: [{
		path: '/login',
		alias: '/',
		name: 'login',
		component: () => import('../views/Login.vue')
	}, {
		path: '/ForgetPassword',
		name: 'ForgetPassword',
		component: () => import('../views/ForgetPassword.vue')
	}, {
		path: '/index/',
		name: 'LayoutIndex',
		component: Layout,
		children: [{
			path: 'list',
			name: 'IndexList',
			component: () => import('../views/Index/index.vue'),
		}]
	}, {
		path: '/bank/',
		name: 'LayoutBank',
		component: Layout,
		children: [{
			path: 'hall',
			name: 'BankHall',
			component: () => import('../views/Bank/hall.vue'),
		}, {
			path: 'mine',
			name: 'BankMine',
			component: () => import('../views/Bank/mine.vue'),
		}]
	}, {
		path: '/operate/',
		name: 'LayoutOperate',
		component: Layout,
		children: [{
			path: 'collect',
			name: 'OperateCollect',
			component: () => import('../views/Operate/collect.vue'),
		}, {
			path: 'recycle',
			name: 'Operaterecycle',
			component: () => import('../views/Operate/recycle.vue'),
		}]
	}, {
		path: '/paper/',
		name: 'LayoutPaper',
		component: Layout,
		children: [{
			path: 'hall',
			name: 'PaperHall',
			component: () => import('../views/Paper/hall.vue'),
		}, {
			path: 'mine',
			name: 'PaperMine',
			component: () => import('../views/Paper/mine.vue'),
		}, {
			path: 'onePaper/:id',
			name: 'PaperOnePaper',
			props: true,
			component: () => import('../views/Paper/onePaper.vue'),
		}, {
			path: 'newPaper',
			name: 'PaperNewPaper',
			component: () => import('../views/Paper/newPaper.vue'),
		}, {
			path: 'detailPaper/:id',
			name: 'PaperDetailPaper',
			props: true,
			component: () => import('../views/Paper/detailPaper.vue'),
		}]
	}, {
		path: '/test/',
		name: 'LayoutTest',
		component: Layout,
		children: [{
			path: 'list',
			name: 'TestList',
			component: () => import('../views/Test/list.vue'),
		}, {
			path: 'mine',
			name: 'TestMine',
			component: () => import('../views/Test/mine.vue'),
		}, {
			path: 'monitor',
			name: 'TestMonitor',
			component: () => import('../views/Test/monitor.vue'),
		}, {
			path: 'new',
			name: 'TestNew',
			component: () => import('../views/Test/new.vue'),
		}, {
			path: 'editTest/:id',
			name: 'TestEditTest',
			props: true,
			component: () => import('../views/Test/editTest.vue'),
		}, {
			path: 'detailTest/:id',
			name: 'TestDetailTest',
			props: true,
			component: () => import('../views/Test/detailTest.vue'),
		}, {
			path: 'statistics',
			name: 'TestStatistics',
			component: () => import('../views/Test/statistics.vue'),
		}]
	}, {
		path: '/scores/',
		name: 'LayoutScores',
		component: Layout,
		children: [{
			path: 'online',
			name: 'ScoresOnline',
			component: () => import('../views/Scores/online.vue'),
		}, {
			path: 'enquire',
			name: 'ScoresEnquire',
			component: () => import('../views/Scores/enquire.vue'),
		}]
	}, {
		path: '/course/',
		name: 'LayoutCourse',
		component: Layout,
		children: [{
			path: 'hall',
			name: 'CourseHall',
			component: () => import('../views/Course/hall.vue'),
		}, {
			path: 'mine',
			name: 'CourseMine',
			component: () => import('../views/Course/mine.vue'),
		}, {
			path: 'detail/:id',
			name: 'CourseDetail',
			props: true,
			component: () => import('../views/Course/detail.vue'),
		}, {
			path: 'edit/:id',
			name: 'CourseEdit',
			props: true,
			component: () => import('../views/Course/edit.vue'),
		}]
	}, {
		path: '/manage/',
		name: 'LayouManage',
		component: Layout,
		meta: { role: ['0'] }, //页面需要的权限
		children: [{
			path: 'company-chart',
			name: 'ManageCompany-chart',
			component: () => import('../views/Manage/company-chart.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'user',
			name: 'ManageUser',
			component: () => import('../views/Manage/user.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'user-list',
			name: 'ManageUser-list',
			component: () => import('../views/Manage/user-list.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'student-list',
			name: 'ManageStudent-list',
			component: () => import('../views/Manage/student-list.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'revisePwd',
			name: 'ManageRevisePwd',
			component: () => import('../views/Manage/revisePwd.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'reviseEmail',
			name: 'ManageReviseEmail',
			component: () => import('../views/Manage/reviseEmail.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'college-chart',
			name: 'ManageReviseCollege-chart',
			component: () => import('../views/Manage/college-chart.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}, {
			path: 'courses-list',
			name: 'ManageReviseCourses',
			component: () => import('../views/Manage/courses-list.vue'),
			meta: { role: ['0'] }, //页面需要的权限
		}]
	}, ]
})
// let asyncrouter = new Router({
// 	routes: []
// })
// router.beforeEach((to, from, next) => {
// 	if (sessionStorage.token) { //有token
// 		if (to.path === '/login') {
// 			next({ path: '/' });
// 		} else {
// 			// if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
// 			// 	store.dispatch('GetInfo').then(res => { // 拉取info
// 			// 		const roles = res.data.role;
// 			const roles = sessionStorage.role
// 			store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
// 				router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
// 				next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
// 			})
// 			// 	}).catch(err => {
// 			// 		console.log(err);
// 			// 	});
// 			// } else {
// 			// 	next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
// 			// }
// 		}
// 	} else {
// 		next({
// 			path: '/login',
// 			query: {
// 				redirect: to.fullPath
// 			}
// 		});
// 		return;
// 	}
// });
// // 全局路由守卫
// router.beforeEach((to, from, next) => {
// 	// 判断匹配的路由是否需要权限,只要有一个匹配路由需要权限，则需要登录
// 	let isAuth = to.matched.some((item) => item.meta.auth)
// 	// isAuth:true,无token=》跳转登录页
// 	// isAuth:true,有token=》放行
// 	// isAuth:false,有/无token=》放行
// 	if (!isAuth) {
// 		next();
// 		return;
// 	}
// 	if (sessionStorage.token) {
// 		next();
// 		return
// 	}
// 	// 
// 	Message.error({
// 		message: 'token失效，请重新登录系统',
// 		onClose: () => {
// 			// 跳转登录
// 			next({
// 				path: '/login',
// 				query: {
// 					redirect: to.fullPath
// 				}
// 			})
// 			loading.close()
// 		}
// 	})
// })
export default router;
