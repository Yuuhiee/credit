<template>
    <DataTable :table-data="tableData" :headers="tableColumnHeaders" :extra-columns="[{ name: 'operation', label: '操作' }]"
        :loading="loading" @refresh="requestTableData">
        <template #operation="{ scope }">
            <TableButton @click="getActsByOrgName(scope.row.organizationName)">查看活动</TableButton>
        </template>
    </DataTable>
    <el-dialog v-model="viewDialogVisible" title="社团活动" width="1000px">
        <ActivityList :activities="activities" :loading="requesting" />
    </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { creditApi } from "../request";
import ActivityList from "./tools/ActivityList.vue";
import DataTable from "./tools/DataTable.vue";
import TableButton from "./tools/TableButton.vue";

const tableColumnHeaders = [
    { prop: "organizationName", label: "名称" },
    { prop: "content", label: "描述" },
];

//loading遮罩层
let loading = ref(false);
//请求表格数据
function requestTableData() {
    loading.value = true;
    // setTimeout(() => {
    //     tableData.value = data;
    //     loading.value = false;
    // }, 500);
    creditApi({
        url: "/organization/organizationList",
        method: "get",
    })
        .then((data) => {
            console.log(data);
            tableData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}

let tableData = ref([]);

let viewDialogVisible = ref(false);

let queryname = ref("");

const activities = ref([]);
const requesting = ref(false)
function getActsByOrgName(name) {
    viewDialogVisible.value = true;
    queryname.value = name;
    requesting.value = true
    creditApi({
        url: "/organization/activityList",
        method: "post",
        params: {
            organization: queryname.value,
        },
    })
        .then((data) => {
            console.log(data);
            activities.value = data;
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            requesting.value = false
        })
}

onMounted(() => {
    requestTableData();
});
</script>

<style lang="scss" scoped>
.el-table {
    min-height: 440px;
}

.org-view {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    height: 100%;
}

.total-points {
    display: flex;

    span {
        font-size: 14px;
        color: #000;
        margin-right: 30px;
    }
}

.org-table {
    width: 100%;

    .button-group {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        margin-bottom: 10px;

        .select-container {
            display: flex;
            gap: 10px;
            margin-right: 10px;

            .el-select {
                width: 150px;
            }
        }
    }

    .table-container {
        min-height: 450px;
    }

    .el-link {
        font-size: 12px;
        margin-right: 8px;
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

.cap {
    font-size: 16px;
    text-align: left;
}
</style>