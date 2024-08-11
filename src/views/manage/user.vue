<template>
	<div class="table-box">		
		<el-button type="primary" :icon="CirclePlus" @click="createTestUsers">批量新增测试用户</el-button>
		
    <a-popconfirm
      title="你确定要进行批量解封吗？"
      ok-text="是"
      cancel-text="否"
      @confirm="banMany(false)"
    >
      <el-button type="primary" :icon="Unlock">批量解封用户</el-button>
    </a-popconfirm>

    <a-popconfirm
      title="你确定要进行批量封禁吗？"
      ok-text="是"
      cancel-text="否"
      @confirm="banMany(true)"
    >
      <el-button type="danger" :icon="Close">批量封禁用户</el-button>
    </a-popconfirm>

    <a-popconfirm
      title="你确定要进行批量删除吗？"
      ok-text="是"
      cancel-text="否"
      @confirm="removeManyUser()"
    >
      <el-button type="danger" :icon="Delete" >批量删除用户</el-button>
    </a-popconfirm>

    <a-input-search
          placeholder="根据昵称模糊搜索"
          enter-button
          v-model:value="searchName"
          @search="onSearch"
      />
    <!--  列表 -->
    <a-table :dataSource="userListft" :columns="columns" :row-selection="rowSelection" :rowKey="(record:any) => record._id">
    <template #bodyCell="{ record,column }">
      <template v-if="column.dataIndex === 'isBanned'">
        <el-button type="danger" v-if="record.isBanned" @click="ban(record,false)">是</el-button>
        <el-button type="info" v-if="!record.isBanned" @click="ban(record,true)">否</el-button>
      </template>

      <template v-if="column.dataIndex === 'regDate'">
        {{ parseDate(record.regDate) }}
      </template>

      <template v-if="column.dataIndex === 'operations'">
        <a @click="updateNicknameByAdmin(record)">修改昵称</a>
        <a-popconfirm
          title="你确定要删除吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="removeUser(record)"
        >
          <a>删除用户</a> 
        </a-popconfirm>
      </template>
    </template>
  </a-table>  
	</div>
	
</template>

<script setup lang="tsx" name="useProTable">
import { ref, onMounted, toRaw } from "vue";
import { ElMessage, ElMessageBox, ElButton } from "element-plus";
import { CirclePlus, Unlock, Delete, Close } from "@element-plus/icons-vue";
import axios from "@/config/axios"
import type { TableProps } from "ant-design-vue";
import mongoose from 'mongoose'

const searchName = ref('')
const userListft = ref([])
const userList = ref([])

// 选中id列表
let selectedIds:[] = []
const rowSelection: TableProps['rowSelection'] = {
  type: 'checkbox',
  onChange: (selectedRowKeys: any) => {
    selectedIds = toRaw(selectedRowKeys)
  },
  
}

// 构造位置筛选
let locations = ["北京", "上海", "天津", "重庆", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "江苏",
                    "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "四川",
                    "贵州", "云南", "西藏", "陕西", "甘肃", "宁夏", "青海", "新疆", "香港", "澳门",
                    "台湾", "其它"]
let locationFilters:any = []
locations.forEach((loc)=>{
  locationFilters.push({
    text: loc,
    value: loc
  })
})

// 表项
let columns = [
  {
    title: 'id',
    dataIndex: '_id',
    width: 200,
    sorter: (a:any, b:any)=> new mongoose.Types.ObjectId(a._id).getTimestamp() - new mongoose.Types.ObjectId(b._id).getTimestamp()
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 110
  },
  {
    title: '是否封禁',
    dataIndex: 'isBanned',
    width: 110,
    align: 'center',
    filters: [
      {
        text: '是',
        value: true
      },
      {
        text: '否',
        value: false
      },
    ],
    onFilter: (value, record)=> record.isBanned == value
  },
  {
    title: '归属地',
    dataIndex: 'location',
    align: 'center',
    width: 90,
    filters: locationFilters,
    onFilter: (value: string, record: any) => record.location.indexOf(value) === 0
  },
  {
    title: '注册时间',
    dataIndex: 'regDate',
    align: 'center',
    width: 90,
    sorter: (a:any, b:any)=> a.regDate - b.regDate
  },
  {
    title: '操作',
    dataIndex: 'operations',
    align: 'center',
    width: 150,
    fixed: 'right'
  }
]

function onSearch() {
  if (searchName.value && searchName.value.trim() !== '') {
    userListft.value = userList.value.filter(
      (p) => p.nickname.indexOf(searchName.value) !== -1
    )
  } else {
    userListft.value = userList.value
  }
}

// 新增测试用户
function createTestUsers(){
	axios.get('/api/createTestUsers').then((resp)=>{
		if(resp.code === 200){
      ElMessage.success(resp.msg)
      getUserList()
    }
	})
}

// 获取用户列表
function getUserList(){
	axios.get('/api/getUserList').then((resp)=>{
		userList.value = resp.data 
    onSearch() 
	})
}

// 更新用户昵称
function updateNicknameByAdmin(row) {
	ElMessageBox.prompt('请输入昵称', 'Tip', {
    confirmButtonText: '提交',
    cancelButtonText: '返回',
    inputValidator: (data)=>{
		if(data.length <= 8) return true
		return false
	},
    inputErrorMessage: '格式不正确',
  })
    .then(({ value }) => {
		axios.post('/api/updateNicknameByAdmin',{userId: row._id, nickname:value}).then((resp)=>{
			if(resp?.code === 200){
				ElMessage.success(resp.msg)
				row.nickname = value
			}
		})
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

// 封禁/解封
function ban(record, status) {
	axios.post('/api/banByAdmin',{userId: record._id, isBanned:status}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
			record.isBanned = status
		}
	})
}

// 批量封禁/解封
function banMany(status) {
	axios.post('/api/banManyByAdmin',{userIds: selectedIds, isBanned:status}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
			getUserList()
		}
	})
}

// 删除用户
function removeUser(record) {
	axios.post('/api/removeUser',{userId: record._id}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
			getUserList()
		}
	})
}

// 批量删除用户
function removeManyUser() {
	axios.post('/api/removeManyUser',{userIds: selectedIds}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
			getUserList()
		}
	})
}

// 日期转换
function parseDate(date:string){
	return new Date(parseInt(date)).toLocaleString()
}

onMounted(()=>{
	getUserList()
})

</script>
<style>
.table-box>.el-button{
	margin: 10px;
}
.ant-table-cell a{
  display: block;
  padding: 5px;
}
</style>