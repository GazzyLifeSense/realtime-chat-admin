import router from "@/routers/index";
import { isType } from "@/utils/util";
import { LOGIN_URL } from "@/config/config";
import { ElNotification } from "element-plus";
import { GlobalStore } from "@/stores";
import { AuthStore } from "@/stores/modules/auth";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const addDynamicRouter = async () => {
	const authStore = AuthStore();
	const globalStore = GlobalStore();
	try {
		// 1.获取菜单列表
		await authStore.getAuthMenuList();

		// 2.判断当前用户有没有菜单权限
		if (!authStore.authMenuListGet.length) {
			ElNotification({
				title: "无权限访问",
				message: "当前账号无任何菜单权限，请联系系统管理员！",
				type: "warning",
				duration: 3000
			});
			globalStore.setToken("");
			router.replace(LOGIN_URL);
			return Promise.reject("No permission");
		}

		// 3.添加动态路由
		authStore.flatMenuListGet.forEach((item: any) => {
			item.children && delete item.children;
			if (item.component && isType(item.component) == "string") {
				item.component = modules["/src/views" + item.component + ".vue"];
			}
			if (item.meta.isFull) {
				router.addRoute(item);
			} else {
				router.addRoute("layout", item);
			}

			router.addRoute({
				path: "/:pathMatch(.*)*", // 页面不存在的情况下会跳到404页面
				redirect: '/404'
			})
		});
	} catch (error) {
		// 💢 当按钮 || 菜单请求出错时，重定向到登陆页
		globalStore.setToken("");
		router.replace(LOGIN_URL);
		return Promise.reject(error);
	}
};
