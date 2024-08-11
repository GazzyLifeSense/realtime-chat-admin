<template>
    <a-table :dataSource="api" :columns="columns">
        <template #bodyCell="{column, record}">
            <template v-if="column.dataIndex === 'path'">
                <span class="path">{{ record.path }}</span>
            </template>
            <template v-if="column.dataIndex === 'method'">
                <el-button type="danger" size="small" v-if="record.method=='POST'">{{ record.method }}</el-button>
                <el-button type="success" size="small" v-if="record.method=='GET'">{{ record.method }}</el-button>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts" setup>
import api from './api.json'

const filterData = data => {
    data = data.map( item => item.class)
    
    data = data.filter((item, index)=>{
        return data.indexOf(item) === index
    })
    
    return data.map( item => ({
        text: item,
        value: item
    }))
}
const columns = [
    {
        title: '分类',
        dataIndex: 'class',
        width: 80,
        align: 'center',
        filters: filterData(api),
        onFilter: (value, record)=> record.class == value
    },
    {
        title: '请求方法',
        dataIndex: 'method',
        width: 110,
        align: 'center',
        filters: [
            {
                text: 'POST',
                value: 'POST'
            },
            {
                text: 'GET',
                value: 'GET'
            }],
        onFilter: (value, record)=> record.method == value
    },    
    {
        title: '接口路径',
        dataIndex: 'path',
        width: 150
    },
    {
        title: '描述',
        dataIndex: 'desc'
    },
]
</script>

<style>
.path{
    display: inline-block;
    color:aquamarine;
}
</style>