<template>
    <DataTable :table-data="allData" :headers="tableColumnHeaders" :loading="loading" :filter-options="filter"
        :extra-columns="[{ name: 'operation', label: '操作' }]" @refresh="requestTableData">
        <template #operation="{ scope }">
            <TableButton @click="showDetail(scope.row)">查看</TableButton>
            <TableButton @click="adoptApply(scope.row)">同意</TableButton>
            <TableButton @click="refuseApply(scope.row)">拒绝</TableButton>
        </template>
    </DataTable>
    <el-dialog v-model="detailDialogVisible" title="详情" width="1000px">
        <StripDetail :activity-name="activityName" />
        <template #footer> </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import Toast from "../utils/Toast";
import DataTable from "./tools/DataTable.vue";
import TableButton from "./tools/TableButton.vue";
import StripDetail from "@/components/tools/StripDetail.vue";
import { creditApi } from "../request";
import useGlobalProperties from "../global/properties";
import useGlobalFilters from "../global/filters";

const { $scoreType } = useGlobalProperties()
const { tern, organization, activityType } = useGlobalFilters()

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
            status: 2,
        },
    })
        .then((data) => {
            console.log("list", data);
            data.forEach((item) => {
                item.activityType =
                    $scoreType[item.activityType];
            });
            allData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}
//同意
function adoptApply({ aname }) {
    // currentIndex = (currentPage.value - 1) * pageSize + index;
    ElMessageBox.confirm("确认通过申请？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
        icon: "QuestionFilled",
    })
        .then(() => {
            creditApi({
                url: "/admin/approvalActivity",
                method: "post",
                params: {
                    name: aname,
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
        })
        .catch(() => { });
}
//拒绝
function refuseApply({ aname }) {
    ElMessageBox.prompt("输入拒绝原因", "补充", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    })
        .then(({ value }) => {
            creditApi({
                url: "/admin/approvalActivity",
                method: "post",
                params: {
                    name: aname,
                    status: 3,
                },
            })
                .then(() => {
                    creditApi({
                        url: "admin/reject",
                        method: "post",
                        params: {
                            aname: aname,
                            reject: value || " ",
                        },
                    }).catch(() => { });
                    requestTableData();
                    Toast("success", "已拒绝");
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch(() => { });
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
onMounted(() => {
    requestTableData();
    getOrganizations();
});
</script>
