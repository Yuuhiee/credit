<template>
    <DataTable :table-data="allData" :headers="tableColumnHeaders" :loading="loading" :filter-options="filter"
        :extra-columns="[{ name: 'operation', label: '操作' }]" @refresh="requestTableData">
        <template #operation="{ scope }">
            <TableButton v-if="scope.row.status != '待提交'" @click="showDetailDialog(scope.row.aname)">查看
            </TableButton>
            <TableButton v-if="
                scope.row.status == '已拒绝' ||
                scope.row.status == '待审批'
            " @click="remakeApply(scope.row.aname)">修改</TableButton>
            <TableButton v-if="scope.row.status == '已通过'" @click="outputExcel(scope.row)">导出</TableButton>
        </template>
    </DataTable>
    <el-dialog v-model="editDialogVisible" title="编辑" width="1000px">
        <AddApply :detail-list="stripDetail" :activity-name="addApply_aname" />
        <template #footer> </template>
    </el-dialog>
    <el-dialog v-model="detailDialogVisible" title="详情" width="1000px">
        <StripDetail :activity-name="activityName" />
        <template #footer> </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AddApply from "./AddApply.vue";
import StripDetail from "./tools/StripDetail.vue";
import DataTable from "./tools/DataTable.vue";
import TableButton from "./tools/TableButton.vue";
import { creditApi } from "../request";
import { downloadExcel } from "@/utils/download_excel";
import useGlobalProperties from "../global/properties";
import useGlobalFilters from '../global/filters'

const { tern, organization, activityType, status } = useGlobalFilters()
const { $scoreType, $status } = useGlobalProperties()

//表格配置
//过滤器配置
const filter = { year: tern, organization, activityType, status }
//表格表头
const tableColumnHeaders = [
    { prop: "year", label: "学期", width: '120px' },
    { prop: "organization", label: "部门" },
    { prop: "aname", label: "活动名称" },
    { prop: "activityType", label: "学分类型", width: '140px' },
    { prop: "status", label: "状态", width: '100px' },
    { prop: "reject", label: "拒绝原因" },
];

//loading遮罩层
const loading = ref(false);

//请求表格数据
function requestTableData() {
    loading.value = true;
    creditApi({
        method: "post",
        url: "/user/admin",
    })
        .then((data) => {
            console.log("orgs", data);

            filter.organization.options = data.map((item) => ({
                value: item.oname,
                label: item.oname,
            }));
            allData.value = [];

            data.forEach(({ oname }) => {
                creditApi({
                    method: "post",
                    url: "/organization/activityList",
                    params: {
                        organization: oname,
                    },
                }).then((data) => {
                    console.log("acts", data);
                    data.forEach((item) => {
                        item.status = $status[item.status];
                        item.activityType = $scoreType[item.activityType];
                    });

                    allData.value.push(...data);
                });
            });
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        })
}
//表格数据

const allData = ref([]);


//编辑对话框
const stripDetail = ref([]);
let editDialogVisible = ref(false);
const addApply_aname = ref("");
//修改加分条数据
function remakeApply(activity) {
    addApply_aname.value = activity;
    creditApi({
        method: "post",
        url: "/activity/searchScore",
        params: {
            name: activity,
        },
    })
        .then((data) => {
            console.log("----", data);
            stripDetail.value = data.map(
                ({ uname, username, score, explanation }) => ({
                    username: username,
                    name: uname,
                    score,
                    explanation,
                })
            );
        })
        .catch((err) => {
            console.log(err);
        });
    editDialogVisible.value = true;
}

//查看详情对话框
const detailDialogVisible = ref(false);
const activityName = ref("");
function showDetailDialog(activity) {
    detailDialogVisible.value = true;
    activityName.value = activity;
}

function outputExcel(row) {
    creditApi({
        method: "post",
        url: "/activity/searchScore",
        params: {
            name: row.aname,
        },
    })
        .then((data) => {
            data = data.map((item) => ({
                stuNum: item.username,
                name: item.uname,
                type: row.activityType,
                score: item.score,
                remark: item.explanation ?? null,
            }));
            downloadExcel(
                data,
                [["学号", "姓名", "学分类型", "分数", "备注"]],
                row.aname + "加分表"
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

onMounted(() => {
    requestTableData();
});
</script>
