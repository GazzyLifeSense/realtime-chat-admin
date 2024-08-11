<template>
	<el-main>
		<router-view v-slot="{ Component, route }">	
			<component :is="Component" :key="route.path" />
		</router-view>
	</el-main>
	<el-footer>
		<Footer />
	</el-footer>
</template>

<script setup lang="ts">
import Footer from "@/layouts/Footer/index.vue"
import { ref, computed, onBeforeUnmount, provide, watch } from "vue";
import { GlobalStore } from "@/stores";
import { KeepAliveStore } from "@/stores/modules/keepAlive";
const globalStore = GlobalStore();
const keepAliveStore = KeepAliveStore();

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);

</script>

<style scoped lang="scss">
.el-main {
	box-sizing: border-box;
	padding: 10px 12px;
	overflow-x: hidden;
	background-color: #f0f2f5;
	&::-webkit-scrollbar {
		background-color: #f0f2f5;
	}
}
.el-footer {
	height: auto;
	padding: 0;
}
</style>