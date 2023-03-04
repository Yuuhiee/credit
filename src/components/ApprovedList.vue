<template>
    <DataTable :table-data="allData" :headers="tableColumnHeaders" :loading="loading" :filter-options="filter"
        :extra-columns="[{ name: 'operation', label: '操作' }]" @refresh="requestTableData">
        <template #operation="{ scope }">
            <TableButton @click="showDetail(scope.row)">查看</TableButton>
            <TableButton @click="outputExcel(scope.row)">导出</TableButton>
        </template>
    </DataTable>
    <el-dialog v-model="detailDialogVisible" title="详情" width="1000px">
        <StripDetail :activity-name="activityName" />
        <template #footer> </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import StripDetail from "./tools/StripDetail.vue";
import { creditApi } from "../request";
import { downloadExcel } from "@/utils/download_excel";
import DataTable from "./tools/DataTable.vue";
import TableButton from "./tools/TableButton.vue";
import useGlobalProperties from "../global/properties";
import useGlobalFilters from '../global/filters'

const { tern, organization, activityType } = useGlobalFilters()
const { $scoreType } = useGlobalProperties()


//loading遮罩层
const loading = ref(false);

const filter = { year: tern, organization, activityType }
const tableColumnHeaders = [
    { prop: "year", label: "学期" },
    { prop: "organization", label: "社团" },
    { prop: "aname", label: "活动名" },
    { prop: "activityType", label: "学分类型" },
];

const allData = ref([]);
//请求表格数据
function requestTableData() {
    loading.value = true;
    creditApi({
        url: "/admin/findActivity",
        method: "post",
        params: {
            status: 1,
        },
    })
        .then((data) => {
            console.log("list", data);
            data.forEach((item) => {
                item.activityType = $scoreType[item.activityType];
            });
            allData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}

//展示该活动详情的对话框
const detailDialogVisible = ref(false); //可见性
const activityName = ref("");
function showDetail(row) {
    const { aname } = row;
    console.log(aname);
    activityName.value = aname;
    detailDialogVisible.value = true;
}
function getOrganizations() {
    creditApi({
        url: "/organization/organizationList",
        method: "get",
    })
        .then((data) => {
            console.log(data);
            // tableData.value = data;
            filter.organization.options = data.map((item) => ({
                value: item.organizationName,
                label: item.organizationName,
            }));
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}

function outputExcel(row) {
    console.log("0000", row);
    const { aname, activityType, organization } = row;

    creditApi({
        method: "post",
        url: "/activity/searchScore",
        params: {
            name: aname,
        },
    })
        .then((data) => {
            console.log(data);
            data = data.map((item) => ({
                stuNum: item.username,
                name: item.uname,
                type: activityType,
                score: item.score,
                remark: item.exlanation ?? "",
            }));
            downloadExcel(
                data,
                [["学号", "姓名", "学分类型", "分数", "备注"]],
                aname + "加分表"
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

onMounted(() => {
    requestTableData();
    getOrganizations();
});
</script>
