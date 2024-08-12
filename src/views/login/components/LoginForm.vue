<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="预览用户名：test">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="密码：test" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button round @click="resetForm(loginFormRef)" size="large">重置</el-button>
		<el-button round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
			登录
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import type { ElForm } from "element-plus";
import { Login } from "@/api/interface";
import { getTimeState } from "@/utils/util";
import { GlobalStore } from "@/stores";
import { addDynamicRouter } from "@/routers/dynamicRouter";
const router = useRouter();
const globalStore = GlobalStore();
// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({ username: "", password: "" });
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			if(loginForm.username == 'jormun' && loginForm.password == 'jormun'){
			
				// 1.添加动态路由
				await addDynamicRouter();

				globalStore.setToken('admin');

				// 2.跳转到首页
				router.push('/layout');
				ElNotification({
					title: getTimeState(),
					message: "欢迎登录 RealtimeChat-Admin",
					type: "success",
					duration: 3000
				});
			}else if(loginForm.username == 'test' && loginForm.password == 'test'){
			
				// 1.添加动态路由
				await addDynamicRouter();

				globalStore.setToken('test');

				// 2.跳转到首页
				router.push('/layout');
				ElNotification({
					title: getTimeState(),
					message: "欢迎登录 RealtimeChat-Admin",
					type: "success",
					duration: 3000
				});
			}else{
				ElNotification({
					title: getTimeState(),
					message: "密码错误",
					type: "error",
					duration: 3000
				});
			}
			
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
	globalStore.setToken('')
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
