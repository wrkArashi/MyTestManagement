import Vue from 'vue'
import Vuex from 'vuex'
//import进来接口请求(用户资料)api
import { Joggle } from '@/api/index.js';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 折叠侧边栏
		isCollapse: false,
		// 存储管理员信息
		userInfo: {}

	},
	mutations: {
		collapseMenu(state) {
			state.isCollapse = !state.isCollapse
		},
		//因为action不能直接操作state,所以需要借助他来存储
		savaUserInfo(state, payload) {
			state.userInfo = payload;
		}
	},
	actions: {
		// 暂时留着
		// commit是从content解构的
		// async loadInfo({ commit }) {
		// 	let { id } = sessionStorage;
		// 	let { status, data } = await Admin.info({ id });
		// 	if (status) {
		// 		// data是ajax请求回来的数据
		// 		commit('saveUserInfo', data)
		// 	}
		// }
		async loadInfo({ commit }) {
			// 载入个人信息
			var data = {
				"FuncCode": "GetUser",
				"Data": {
					"Params": [sessionStorage.id]
				},
			}
			await Joggle.get(data).then((response) => {
				if (response.indexOf("Fail:") == -1) {
					var jsonObj = JSON.parse(response);
					commit('savaUserInfo', jsonObj[0])
				}
			})
		}
	},
	modules: {}
})
