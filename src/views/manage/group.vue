<template>
	<div class="table-box">		
		<el-button type="primary" :icon="CirclePlus" @click="createTestGroups">批量新增测试群组</el-button>
    <a-popconfirm
      title="你确定要进行批量解散吗？"
      ok-text="是"
      cancel-text="否"
      @confirm="dismissManyByAdmin"
    >
		  <el-button type="danger" :icon="Delete">批量解散群组</el-button>
    </a-popconfirm>
    <a-input-search
          placeholder="根据群名称模糊搜索"
          enter-button
          v-model:value="searchName"
          @search="onSearch"
      />
	</div>
	<a-table :dataSource="groupListft" :columns="columns" :row-selection="rowSelection" :rowKey="(record:any) => record._id">
    <template #bodyCell="{ record,column }">
      <template v-if="column.dataIndex === 'isRecommanded'">
        <el-button type="success" v-if="record.isRecommanded" @click="recommand(record,false)">是</el-button>
        <el-button type="info" v-if="!record.isRecommanded" @click="recommand(record,true)">否</el-button>
      </template>

      <template v-if="column.dataIndex === 'members'">
        {{ record.members.length }}
      </template>

      <template v-if="column.dataIndex === 'operations'">
        <a @click="updateGroupNameByAdmin(record)">修改群名称</a> 
        
        <a-popconfirm
          title="你确定要进行批量解散吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="dismissByAdmin(record)"
        >
          <a>解散群聊</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>  
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, onMounted, computed, toRaw } from "vue";
import { ElMessage, ElMessageBox, ElButton } from "element-plus";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh, MessageBox } from "@element-plus/icons-vue";
import axios from "@/config/axios"
import mongoose from 'mongoose'
import type { TableProps } from "ant-design-vue";

const searchName = ref('')
const groupListft = ref([])
const groupList = ref([])

// 选中id列表
let selectedIds:[] = []
const rowSelection: TableProps['rowSelection'] = {
  type: 'checkbox',
  onChange: (selectedRowKeys: any) => {
    selectedIds = toRaw(selectedRowKeys)
  }
}

// 表项
let columns = [
  {
    title: 'id',
    dataIndex: '_id',
    width: 200,
    sorter: (a:any, b:any)=> new mongoose.Types.ObjectId(a._id).getTimestamp() - new mongoose.Types.ObjectId(b._id).getTimestamp()
  },
  {
    title: '群名称',
    dataIndex: 'name',
  },
  {
    title: '拥有人',
    dataIndex: 'owner',
  },
  {
    title: '是否推荐',
    dataIndex: 'isRecommanded',
    width: 105,
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
    onFilter: (value, record)=> record.isRecommanded == value
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    width: 80,
    filters: [
      {
        text: '游戏',
        value: 'game'
      },
      {
        text: '学习',
        value: 'study'
      },
      {
        text: '兴趣',
        value: 'hobby'
      },
    ],
    onFilter: (value: string, record: any) => record.type.indexOf(value) === 0
  },
  {
    title: '群人数',
    dataIndex: 'members',
    align: 'center',
    width: 90,
    sorter: (a:any, b:any)=> a.members.length - b.members.length
  },
  {
    title: '操作',
    dataIndex: 'operations',
    align: 'center',
    width: 130,
    fixed: 'right'
  }
]

function onSearch() {
  if (searchName.value && searchName.value.trim() !== '') {
    groupListft.value = groupList.value.filter(
      (p) => p.name.indexOf(searchName.value) !== -1
    )
  } else {
    groupListft.value = groupList.value
  }
}

// 获取群组列表
function getGroupList(){
	axios.get('/api/getGroupList').then((resp)=>{
		groupList.value = resp.data
    onSearch()
	})
}

// 批量创建群组
function createTestGroups() {
	ElMessageBox.prompt('请输入测试用户ID', 'Tip', {
    confirmButtonText: '提交',
    cancelButtonText: '返回',
    inputValidator: (data)=>{
		if(data.length == 24) return true
		return false
	},
    inputErrorMessage: '格式不正确',
  })
    .then(({ value }) => {
      axios.post('/api/createTestGroups',{userId: value}).then((resp)=>{
        if(resp?.code === 200){
          ElMessage.success(resp.msg)
          getGroupList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

// 更新群组名称
function updateGroupNameByAdmin(record:any) {
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
      axios.post('/api/updateGroupNameByAdmin',{groupId: record._id, groupName:value}).then((resp)=>{
        if(resp?.code === 200){
          ElMessage.success(resp.msg)
          getGroupList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

// 推荐群组
function recommand(record, status) {
	axios.post('/api/recommandByAdmin',{groupId: record._id, isRecommanded: status}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
			getGroupList()
		}
	})
}

// 解散群组
function dismissByAdmin(record) {
	axios.post('/api/dismissByAdmin',{groupId: record._id}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
      getGroupList()
		}
	})
}

// 批量解散群组
function dismissManyByAdmin() {
	axios.post('/api/dismissManyByAdmin',{groupIds: selectedIds}).then((resp)=>{
		if(resp?.code === 200){
			ElMessage.success(resp.msg)
      getGroupList()
		}
	})
}

onMounted(()=>{
	getGroupList()
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