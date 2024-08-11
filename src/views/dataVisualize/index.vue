<template>
	<div class="dataVisualize-box">
		<div class="card top-box">
			<div class="top-title flx-align-center">数据可视化<el-icon><Refresh :class="{'spin':isRefreshing==true}" @click="refresh" /></el-icon></div>
			<el-tabs v-model="tabActive" class="demo-tabs">
				<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="top-content">
				<el-row :gutter="40">
					
						<div class="item-right">
							<div class="echarts-title">用户归属地占比</div>
							<div class="book-echarts">
								<Pie ref="pieRef" />
							</div>
						</div>
					
				</el-row>
			</div>
		</div>
		<div class="card bottom-box">
			<div class="bottom-title">最活跃群组</div>
			<div class="bottom-tabs">
				<el-tabs v-model="tabActive" class="demo-tabs">
					<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="curve-echarts">
				<Curve ref="curveRef" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref, onBeforeMount } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";
import axios from "@/config/axios"
const tabActive = ref(1);
const pieRef = ref();
const curveRef = ref();
var userCount = ref(0)
var groupCount = ref(0)
var onlineCount = ref(0)
var messageCount = ref(0)
var isRefreshing = ref(false)
const pieData = ref([]);
const curveData = ref([]);

async function getUserCount(){
	axios.get('/api/getUserCount').then((resp)=>{
		userCount.value = resp.data
	})
}
async function getGroupCount(){
	axios.get('/api/getGroupCount').then((resp)=>{
		groupCount.value = resp.data
	})
}
async function getOnlineCount(){
	axios.get('/api/getOnlineCount').then((resp)=>{
		onlineCount.value = resp.data
	})
}
async function getMessageCount(){
	axios.get('/api/getMessageCount').then((resp)=>{
		messageCount.value = resp.data
	})
}
async function getTopActiveGroup(){
	axios.get('/api/getTopActiveGroup').then((resp)=>{
		curveData.value = resp.data
		curveRef.value.initChart(curveData.value);
	})
}
async function getUserLocationPercent(){
	axios.get('/api/getUserLocationPercent').then((resp)=>{
		resp.data.sort((a, b)=>b.value - a.value)
		pieData.value = resp.data
		pieRef.value.initChart(pieData.value);
	})
}
async function refresh(){
	isRefreshing.value = true
	getData()
	setTimeout(()=>{
		isRefreshing.value = false
	},500)
}

onBeforeMount(() => {
	getData()
})

function getData(){
	getUserCount()
	getGroupCount()
	getOnlineCount()
	getMessageCount()
	getTopActiveGroup()
	getUserLocationPercent()
}

const tab = [
	{ label: "最新", name: 1 },
];
</script>

<style scoped lang="scss">
.dataVisualize-box {
	.top-box {
		box-sizing: border-box;
		padding: 25px 40px 0;
		margin-bottom: 10px;
		.top-title {
			margin-bottom: 10px;
			font-family: DIN;
			font-size: 18px;
			font-weight: bold;
		}
		:deep(.top-content) {
			margin-top: 10px;
			
			.item-right {
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				width: 100%;
				height: 430px;
				border: 1px solid #e5e7eb;
				border-radius: 25px;
				.echarts-title {
					padding: 15px 20px;
					font-family: DIN;
					font-size: 18px;
					font-weight: bold;
					border-bottom: 1px solid #e5e7eb;
				}
				.book-echarts {
					flex: 1;
					width: 100%;
				}
			}
		}
	}
	.bottom-box {
		position: relative;
		padding: 20px 0 0;
		.bottom-title {
			position: absolute;
			top: 75px;
			left: 50px;
			font-family: DIN;
			font-size: 18px;
			font-weight: bold;
		}
		.bottom-tabs {
			padding: 0 50px;
		}
		.curve-echarts {
			box-sizing: border-box;
			height: 400px;
			padding: 0 50px;
		}
	}
}

.el-icon{
	width: 30px;
	cursor: pointer;
}
.spin{
	transition: transform 0.2s;
	transform-origin: center;
	transform: rotate(360deg);
}

</style>
