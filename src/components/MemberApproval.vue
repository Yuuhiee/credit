<template>
    <DataTable :table-data="allData" :headers="tableColumnHeaders" :loading="loading" :filter-options="filter"
        :extra-columns="[{ name: 'operation', label: '操作' }]" @refresh="requestTableData">
        <template #operation="{ scope }">
            <TableButton @click="adoptApply(scope.row)">同意</TableButton>
            <TableButton @click="refuseApply(scope.row)">拒绝</TableButton>
        </template>
    </DataTable>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import Toast from "../utils/Toast";
import { creditApi } from "@/request";
import DataTable from "./tools/DataTable.vue";
import TableButton from "./tools/TableButton.vue";
import useGlobalFilters from '../global/filters'

const { organization } = useGlobalFilters()
const filter = { oname: organization }
const tableColumnHeaders = [
    { prop: "oname", label: "社团" },
    { prop: "username", label: "申请人学号" },
    { prop: "uname", label: "申请人姓名" },
];

//loading遮罩层
let loading = ref(false);

const allData = ref([]);
//请求表格数据
function requestTableData() {
    loading.value = true;
    creditApi({
        method: "get",
        url: "/admin/submitterlist",
    })
        .then((data) => {
            console.log(data);
            allData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log("error", err);
            if (err.data.code == 400) allData.value = [];
            loading.value = false;
        });
}
function adoptApply(row) {
    ElMessageBox.confirm("确认通过申请？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
        icon: "QuestionFilled",
    })
        .then(() => {
            //#region 发送请求
            creditApi({
                url: "/admin/approvalsubmitter",
                method: "post",
                params: {
                    name: row.uname,
                    organization: row.oname,
                    status: 1,
                },
            })
                .then((data) => {
                    console.log(data);
                    // tableData.value[currentIndex].status = 1;
                    requestTableData();
                    Toast("success", "已通过");
                })
                .catch((err) => {
                    console.log(err);
                });
            //#endregion
        })
        .catch(() => { });
}
function refuseApply(row) {
    ElMessageBox.confirm("确认拒绝申请？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        icon: "QuestionFilled",
    })
        .then(() => {
            //#region 发送请求
            creditApi({
                url: "/admin/approvalsubmitter",
                method: "post",
                params: {
                    name: row.uname,
                    organization: row.oname,
                    status: 2,
                },
            })
                .then((data) => {
                    console.log(data);
                    requestTableData();
                    Toast("success", "已拒绝");
                })
                .catch((err) => {
                    console.log(err);
                });
            //#endregion
        })
        .catch(() => { });
}


function getOrganizations() {
    creditApi({
        url: "/organization/organizationList",
        method: "get",
    })
        .then((data) => {
            console.log(data);
            // tableData.value = data;
            filter.oname.options = data.map((item) => ({
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
onMounted(() => {
    requestTableData();
    getOrganizations();
});
</script>
