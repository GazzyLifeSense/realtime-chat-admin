<template>
	<div ref="echartsRef" class="echarts"></div>
</template>
<script setup lang="ts" name="pie">
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";

const echartsRef = ref<HTMLElement>();
const initChart = (data: any) => {
	const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
	const option: echarts.EChartsOption = {
		title: {
			text: "归属地",
			left: "49.5%",
			top: "47%",
			textAlign: "center",
			textStyle: {
				fontSize: 18,
				color: "#767676"
			}
		},
		tooltip: {
			trigger: "item"
		},
		// legend: {
		// 	top: '2%',
		// 	orient: "horizontal",
		// 	icon: "circle", //图例形状
		// 	align: "left",
		// 	itemGap: 20,
		// 	textStyle: {
		// 		fontSize: 13,
		// 		color: "#a1a1a1",
		// 		fontWeight: 500
		// 	},
		// 	formatter: function (name: string) {
		// 		let dataCopy = "";
		// 		for (let i = 0; i < data.length; i++) {
		// 			if (data[i].name == name && data[i].value >= 10000) {
		// 				dataCopy = (data[i].value / 10000).toFixed(2);
		// 				return name + "      " + dataCopy + "w";
		// 			} else if (data[i].name == name) {
		// 				dataCopy = data[i].value;
		// 				return name + "      " + dataCopy;
		// 			}
		// 		}
		// 		return "";
		// 	}
		// },
		series: [
			{
				type: "pie",
				radius: ["70%", "30%"],
				clockwise: true,
				data: data,
				labelLine: {
					length: 80,
					length2: 30,
					lineStyle: {
						width: 1
					}
				},
				label: {
					position: "outside",
					show: true,
					formatter: "{d}% - {b}",
					fontWeight: 400,
					fontSize: 19,
					color: "#a1a1a1"
				}
			}
		]
	};
	useEcharts(myChart, option);
};
defineExpose({
	initChart
});
</script>

<style lang="scss" scoped>
.echarts {
	width: 100%;
	height: 100%;
}
</style>
