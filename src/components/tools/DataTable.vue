<!-- 展示各种数据 -->
<script setup>
import { computed, ref, reactive } from 'vue'
import { Refresh } from "@element-plus/icons-vue";
import Filter from "./Filter.vue";

const props = defineProps({
    tableData: Array,//表格数据
    headers: Array,//表头
    loading: Boolean,//加载动画 用v-loading也可以
    filterOptions: Object,//过滤器配置,不传就不显示过滤器
    extraColumns: Array,//额外的列(如果有的话) Array<{ prop:string, name:string }>
    extraButtons: Array,//额外的按钮(如果有的话) Array<{ label:string, type:string, icon:string, plain:boolean, onClickHandler: funtion }>
    pageSize: {
        type: Number,
        default: 10
    },
    noBorder: {//表格是否有边框
        type: Boolean,
        default: false
    },
    noHeader: {//是否有过滤器和提交按钮
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['refresh'])

const filterModel = reactive({})
Object.keys(props.filterOptions || {}).forEach((key) => {
    filterModel[key] = null
})

const temp = computed(() => {
    let { tableData } = props
    for (const key in filterModel)
        if (filterModel[key])
            tableData = tableData.filter((item) => item[key] == filterModel[key]);
    return tableData
})
const currentPage = ref(1);
const totalCount = computed(() => temp.value.length);
const pageData = computed(() => {
    const { pageSize } = props
    return temp.value.slice(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize
    )
})
</script>
  
<template>
    <div class="data-table" v-loading="loading">
        <div v-if="!noHeader" class="header">
            <div>
                <el-button @click="emit('refresh')" type="primary" :icon="Refresh">刷新</el-button>
                <el-button v-for="(button, index) in extraButtons" :key="index" :type="button.type" :plain="button.plain"
                    @click="button.onClickHandler">
                    <el-icon v-if="button.icon">
                        <Component :is="button.icon" />
                    </el-icon>
                    {{ button.label }}
                </el-button>
            </div>
            <Filter v-if="filterOptions" :options="filterOptions" :model="filterModel" clearable />
        </div>
        <div class="table-container">
            <el-table :data="pageData" :border="!noBorder" stripe :default-sort="{ prop: 'year', order: 'descending' }">
                <el-table-column label="序号" width="60px" align="center">
                    <template #default="scope">{{
                        (currentPage - 1) * pageSize + scope.$index + 1
                    }}</template>
                </el-table-column>
                <el-table-column v-for="(header, index) in headers" :key="index" :width="header.width ?? ''"
                    :prop="header.prop" :label="header.label" align="center" />
                <el-table-column v-for="(column, index) in extraColumns" :key="index" :label="column.label" align="center">
                    <template #default="scope">
                        <slot :name="column.name" :scope="scope"></slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" small background layout="prev, pager, next"
                :total="totalCount" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.data-table {
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;

    .header {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        min-height: 42px;
    }

    .el-table {
        min-height: 450px;
    }

    .pagination-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0 0 0;
    }
}
</style>