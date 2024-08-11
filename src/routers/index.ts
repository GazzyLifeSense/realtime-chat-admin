import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "@/config/nprogress";
import { AuthStore } from "@/stores/modules/auth";

/**
 * @description 动态路由参数配置简介 📚
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 是否外链
 * @param meta.isHide ==> 是否隐藏
 * @param meta.isFull ==> 是否全屏(示例：数据大屏页面)
 * @param meta.isAffix ==> 是否固定在 tabs nav
 * @param meta.isKeepAlive ==> 是否缓存
 * */

import { RouteRecordRaw } from "vue-router";
import { addDynamicRouter } from "./dynamicRouter";
import { HOME_URL, LOGIN_URL } from "@/config/config";
import { GlobalStore } from "@/stores";
 /**
  * staticRouter(静态路由)
  */
const staticRouter: RouteRecordRaw[] = [
	 {
		 path: "/",
		 redirect: LOGIN_URL,
	 },
	 {
		 path: "/login",
		 name: "login",
		 component: () => import("@/views/login/index.vue"),
		 meta: {
			 title: "登录"
		 }
	 },
	 {
		 path: "/layout",
		 name: "layout",
		 component: () => import("@/layouts/index.vue"),
		 meta: {
			title: "主页"
		},
		redirect: HOME_URL,
		children: []
	 }
 ];
 
 /**
  * errorRouter(错误页面路由)
  */
const errorRouter: RouteRecordRaw[] = [
	{
		path: '/404', // 页面不存在的情况下会跳到404页面
		name: '404',
		component: () => import("@/components/Error/404.vue")
	}
 ];
 

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter],
	strict: false,
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
	const globalStore = GlobalStore();
	// 1.NProgress 开始
	NProgress.start();
	
	// 2.判断是否访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
	if (to.path.toLocaleLowerCase() === LOGIN_URL) {
		if (globalStore.token) return next();
		resetRouter();
		return next();
	}

	// 3.判断是否有 Token，没有重定向到 login
	if (!globalStore.token) return next({ path: LOGIN_URL, replace: true });

	// 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
	// 初始访问 或 刷新页面后
	const authStore = AuthStore();
	if (!authStore.authMenuListGet.length) {
		// 加载动态路由
		await addDynamicRouter();
		// 对初始的路由请求放行
		return next({ ...to, replace: true });
	}

	// 5.正常访问页面
	next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
	const authStore = AuthStore();
	authStore.flatMenuListGet.forEach(route => {
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
	});
};

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done();
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

export default router;
