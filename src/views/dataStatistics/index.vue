<template>
	<div class="dataVisualize-box">
		<div class="card top-box">
			<div class="top-title flx-align-center">数据统计<el-icon><Refresh :class="{'spin':isRefreshing==true}" @click="refresh" /></el-icon></div>
			<el-tabs v-model="tabActive" class="demo-tabs">
				<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="top-content">
				<el-row :gutter="40">
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
						<div class="item-left sle">
							<span class="left-title">1小时内在线用户</span>
							<div class="img-box">
								<img src="./images/book-sum.png" alt="" />
							</div>
							<span class="left-number">{{onlineUserCount}}</span>
						</div>
					</el-col>
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
						<div class="item-center">
							<div class="gitee-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/add_person.png" alt="" />
								</div>
								<span class="item-value">{{ userCount }}</span>
								<span class="traffic-name sle">用户数量</span>
							</div>
							<div class="gitHub-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/add_team.png" alt="" />
								</div>
								<span class="item-value">{{ groupCount }}</span>
								<span class="traffic-name sle">群组数量</span>
							</div>
							<div class="today-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/today.png" alt="" />
								</div>
								<span class="item-value">{{ onlineCount }}</span>
								<span class="traffic-name sle">在线终端</span>
							</div>
							<div class="yesterday-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/book_sum.png" alt="" />
								</div>
								<span class="item-value">{{ messageCount }}</span>
								<span class="traffic-name sle">历史信息量</span>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref, onMounted, onBeforeMount, reactive } from "vue";
import axios from "@/config/axios"
import { Console } from "console";
const tabActive = ref(1);
const pieRef = ref();
const curveRef = ref();
var onlineUserCount = ref(0)
var userCount = ref(0)
var groupCount = ref(0)
var onlineCount = ref(0)
var messageCount = ref(0)
var isRefreshing = ref(false)
async function getOnlineUserCount(){
	axios.get('/api/getOnlineUserCount').then((resp)=>{
		onlineUserCount.value = resp.data
	})
}
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
	getOnlineUserCount()
	getUserCount()
	getGroupCount()
	getOnlineCount()
	getMessageCount()
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
		.top-content {
			margin-top: 10px;
			.item-left {
				box-sizing: border-box;
				height: 100%;
				padding: 40px 0 30px 30px;
				overflow: hidden;
				color: #ffffff;
				background: url("./images/book-bg.png");
				background-position: 50%;
				background-size: cover;
				border-radius: 20px;
				.left-title {
					font-family: DIN;
					font-size: 20px;
				}
				.img-box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 90px;
					height: 90px;
					margin: 40px 0 20px;
					background: #ffffff;
					background-color: #ffffff;
					border-radius: 20px;
					box-shadow: 0 10px 20px rgb(0 0 0 / 14%);
					img {
						width: 60px;
						height: 65px;
					}
				}
				.left-number {
					overflow: hidden;
					font-family: DIN;
					font-size: 62px;
				}
			}
			.item-center {
				display: flex;
				flex-wrap: wrap;
				align-content: space-between;
				justify-content: space-between;
				height: 100%;
				.traffic-box {
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					width: 47%;
					height: 48%;
					padding: 25px;
					border-radius: 30px;
					.traffic-img {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 70px;
						height: 70px;
						margin-bottom: 10px;
						background-color: #ffffff;
						border-radius: 19px;
					}
				}
				img {
					width: 33px;
					height: 33px;
				}
				.item-value {
					margin-bottom: 4px;
					font-family: DIN;
					font-size: 28px;
					font-weight: bold;
					color: #1a1a37;
				}
				.traffic-name {
					overflow: hidden;
					font-family: DIN;
					font-size: 15px;
					color: #1a1a37;
					white-space: nowrap;
				}
				.gitee-traffic {
					background: url("./images/1-bg.png");
					background-color: #e8faea;
					background-size: 100% 100%;
				}
				.gitHub-traffic {
					background: url("./images/2-bg.png");
					background-color: #e7e1fb;
					background-size: 100% 100%;
				}
				.today-traffic {
					background: url("./images/3-bg.png");
					background-color: #fdf3e9;
					background-size: 100% 100%;
				}
				.yesterday-traffic {
					background: url("./images/4-bg.png");
					background-color: #f0f5fb;
					background-size: 100% 100%;
				}
			}
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
