import { createApp } from 'vue'
import './style.css'
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
import App from './App.vue'
// vue Router
import router from "@/routers/index";
// element css
import "element-plus/dist/index.css";
// element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// element dark(内置暗黑模式)
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark(自定义暗黑模式)
import "@/styles/theme/element-dark.scss";
// pinia store
import pinia from "@/stores/index";
// errorHandler
import errorHandler from "@/utils/errorHandler";
// axios
import axios from "@/config/axios"
// ant-design
import antDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.dark.css'
const app = createApp(App);
// 注册element Icons组件
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key as keyof typeof Icons]);
});
app.config.errorHandler = errorHandler;
app.config.globalProperties.$axios = axios;
app.use(router).use(pinia).use(antDesignVue).use(ElementPlus).mount("#app");