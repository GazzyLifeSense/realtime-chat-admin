import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getFlatArr } from "@/utils/util";
import { getShowMenuList } from "@/utils/util";

// AuthStore
export const AuthStore = defineStore({
	id: "AuthState",
	state: (): AuthState => ({
		// 菜单权限列表
		authMenuList: []
	}),
	getters: {
		// 后端返回的菜单列表 ==> 这里没有经过任何处理
		authMenuListGet: state => state.authMenuList,
		// 后端返回的菜单列表 ==> 左侧菜单栏渲染，需要去除 isHide == true
		showMenuListGet: state => getShowMenuList(state.authMenuList),
		// 扁平化之后的一维数组路由，主要用来添加动态路由
		flatMenuListGet: state => getFlatArr(state.authMenuList),
	},
	actions: {
		// getAuthMenuList
		getAuthMenuList() {
			this.authMenuList = [
				{
					"component": "/home/index", 
					"meta": {
						"icon": "HomeFilled", 
						"title": "首页", 
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true},
					"name": 'home', 
					"path": '/home/index'
				},
				{
					"path": "/dataScreen",
					"name": "dataScreen",
					"component": "/dataScreen/index",
					"meta": {
						"icon": "Histogram",
						"title": "数据大屏",
						"isLink": "",
						"isHide": false,
						"isFull": true,
						"isAffix": false,
						"isKeepAlive": true
					}
				},
				{
					"path": "/manage",
					"name": "manage",
					"meta": {
						"icon": "MessageBox",
						"title": "数据管理",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					},
					"children": [
						{
							"path": "/manage/user",
							"name": "userManage",
							"component": "/manage/user",
							"meta": {
								"icon": "Menu",
								"title": "用户管理",
								"isLink": "",
								"isHide": false,
								"isFull": false,
								"isAffix": false,
								"isKeepAlive": true
							}
						},
						{
							"path": "/manage/group",
							"name": "groupManage",
							"component": "/manage/group",
							"meta": {
								"icon": "Menu",
								"title": "群组管理",
								"isLink": "",
								"isHide": false,
								"isFull": false,
								"isAffix": false,
								"isKeepAlive": true
							}
						}
					]
				},
				{
					"path": "/dataStatistics",
					"name": "dataStatistics",
					"component": "/dataStatistics/index",
					"meta": {
						"icon": "TrendCharts",
						"title": "数据统计",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					}
				},
				{
					"path": "/dataVisualize",
					"name": "dataVisualize",
					"component": "/dataVisualize/index",
					"meta": {
						"icon": "TrendCharts",
						"title": "数据可视化",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					}
				},
				{
					"path": "/apidoc",
					"name": "apidoc",
					"component": "/apidoc/index",
					"meta": {
						"icon": "Tools",
						"title": "API列表",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					}
				}
			];
		},
	}
});
