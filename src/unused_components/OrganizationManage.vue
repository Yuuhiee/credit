<template>
    <div class="org-view">
        <div class="org-table">
            <div class="button-group">
                <div class="select-container"></div>
                <el-button @click="requestTableData" type="primary" :icon="Refresh">刷新</el-button>
            </div>
            <div class="table-container">
                <el-table :data="pageData" border stripe v-loading="loading">
                    <el-table-column label="序号" width="60px" align="center">
                        <template #default="scope">{{
                            (currentPage - 1) * pageSize + scope.$index + 1
                        }}</template>
                    </el-table-column>
                    <el-table-column v-for="(header, index) in tableColumnHeaders" :key="index" :prop="header.prop"
                        :label="header.label" align="center" />
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-link type="primary" @click="seeall(scope.row.organizationName)">查看所有活动</el-link>
                            <el-link type="primary" @click="seenoadde(scope.row.organizationName)">查看未提交加分条的活动</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination v-model="currentPage" @current-change="queryPage" small background layout="prev, pager, next"
                    :total="totalCount" />
            </div>
        </div>
    </div>
    <el-dialog v-model="viewDialogVisible" title="查看活动" width="1000px">
        <div class="cap">
            <ActivityList :activities="activities" />
        </div>
    </el-dialog>
    <el-dialog v-model="view2DialogVisible" title="未提交加分条的活动" width="1000px">
        <div class="cap">
            <ActivityList :activities="activities" />
        </div>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { creditApi } from "@/request";
import ActivityList from "@/components/tools/ActivityList.vue";

const tableColumnHeaders = [
    { prop: "organizationName", label: "名称" },
    { prop: "content", label: "描述" },
];

//loading遮罩层
let loading = ref(false);

//请求表格数据
function requestTableData() {
    loading.value = true;
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
let currentPage = ref(1);
let totalCount = computed(() => tableData.value.length);
const pageSize = 10;
let pageData = computed(() =>
    tableData.value.slice(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize
    )
);

let viewDialogVisible = ref(false);
let view2DialogVisible = ref(false);

function queryPage(page) {
    currentPage.value = page;
    console.log("query page " + page);
}

const activities = ref([]);
let queryname = ref("");
function seeall(name) {
    viewDialogVisible.value = true;
    queryname.value = name;
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
        });
}

function seenoadde(name) {
    view2DialogVisible.value = true;
    queryname.value = name;
    creditApi({
        url: "/admin/unapprovedStrip",
        method: "post",
        params: {
            name: queryname.value,
        },
    })
        .then((data) => {
            console.log(data);
            activities.value = data;
        })
        .catch((err) => {
            console.log(err);
        });
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