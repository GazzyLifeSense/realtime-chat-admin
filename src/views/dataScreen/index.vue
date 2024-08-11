<template>
	<div class="dataScreen-container">
		<div class="dataScreen" ref="dataScreenRef">
			<div class="dataScreen-header">
				<div class="header-lf">
					<span class="header-screening" @click="router.push(HOME_URL)">首页</span>
				</div>
				<div class="header-ct">
					<div class="header-ct-title">
						<span>实时聊天系统可视化数据展示平台</span>

					</div>
				</div>
				<div class="header-rg">
					<span class="header-time">当前时间：{{ time }}</span>
				</div>
			</div>
			<div class="dataScreen-main">
				<div class="dataScreen-lf">
					<div class="dataScreen-top">
						<div class="dataScreen-main-title">
							<span>实时用户统计</span>
							<img src="./images/dataScreen-title.png" alt="" />
						</div>
						<!-- chart区域 -->
						<div class="dataScreen-main-chart">
							<RealTimeAccessChart ref="RealTimeAccessRef" />
						</div>
					</div>
				</div>
				<div class="dataScreen-ct">
					<div class="dataScreen-map">
						<div class="dataScreen-map-title">用户归属地</div>
						<mapChart ref="MapchartRef" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, onBeforeUnmount } from "vue";
import { HOME_URL } from "@/config/config";
import { useRouter } from "vue-router";
import { useTime } from "@/hooks/useTime";
import { ECharts } from "echarts";
import mapChart from "./components/chinaMapChart.vue";
import RealTimeAccessChart from "./components/RealTimeAccessChart.vue";
import axios from 'axios'

const router = useRouter();
const dataScreenRef = ref<HTMLElement | null>(null);

onMounted(() => {
	// 初始化时为外层盒子加上缩放属性，防止刷新界面时就已经缩放
	if (dataScreenRef.value) {
		dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
		dataScreenRef.value.style.width = `1920px`;
		dataScreenRef.value.style.height = `1080px`;
	}
	// 初始化echarts
	initCharts();
	// 为浏览器绑定事件
	window.addEventListener("resize", resize);
});

// 声明echarts实例
interface ChartProps {
	[key: string]: ECharts | null;
}
const dataScreen: ChartProps = {
	chart1: null,
	chart2: null,
	chart3: null,
	chart4: null,
	chart5: null,
	chart6: null,
	chart7: null,
	mapChart: null
};

// 获取子组件的ref
interface ChartExpose {
	initChart: (params: any) => ECharts;
}
const RealTimeAccessRef = ref<ChartExpose>();
const MapchartRef = ref<ChartExpose>();

let mapData = [
	{
		fromName: "北京",
		toName: "上海",
		coords: [
			[116.4551, 40.2539],
			[121.4648, 31.2891]
		]
	},
	{
		fromName: "上海",
		toName: "北京",
		coords: [
			[121.4648, 31.2891],
			[116.4551, 40.2539]
		]
	},
	{
		fromName: "北京",
		toName: "广州",
		coords: [
			[116.4551, 40.2539],
			[113.5107, 23.2196]
		]
	},
	{
		fromName: "广州",
		toName: "北京",
		coords: [
			[113.5107, 23.2196],
			[116.4551, 40.2539]
		]
	},
	{
		fromName: "北京",
		toName: "成都",
		coords: [
			[116.4551, 40.2539],
			[103.9526, 30.7617]
		]
	},
	{
		fromName: "成都",
		toName: "北京",
		coords: [
			[103.9526, 30.7617],
			[116.4551, 40.2539]
		]
	},
	{
		fromName: "成都",
		toName: "新疆维吾尔自治区",
		coords: [
			[103.9526, 30.7617],
			[85.294711, 41.371801]
		]
	},
	{
		fromName: " 新疆维吾尔自治区",
		toName: "成都",
		coords: [
			[85.294711, 41.371801],
			[103.9526, 30.7617]
		]
	}
];

// 初始化 echarts
const initCharts = (): void => {
	dataScreen.mapChart = MapchartRef.value?.initChart(mapData) as ECharts;
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
	let ww = window.innerWidth / width;
	let wh = window.innerHeight / height;
	return ww < wh ? ww : wh;
};

// 监听浏览器 resize 事件
const resize = () => {
	if (dataScreenRef.value) {
		dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
	}
	// 使用了 scale 的echarts其实不需要需要重新计算缩放比例
	Object.values(dataScreen).forEach(chart => {
		chart && chart.resize();
	});
};

// 获取当前时间
const { nowTime } = useTime();
let timer: NodeJS.Timer | null = null;
let time: Ref<string> = ref(nowTime.value);
timer = setInterval(() => {
	time.value = useTime().nowTime.value;
}, 1000);

// 销毁时触发
onBeforeUnmount(() => {
	window.removeEventListener("resize", resize);
	clearInterval(timer!);
	Object.values(dataScreen).forEach(val => val?.dispose());
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
