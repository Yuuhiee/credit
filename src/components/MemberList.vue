<template>
    <DataTable :table-data="allData" :headers="tableColumnHeaders" :loading="loading" :filter-options="filter"
        @refresh="requestTableData"></DataTable>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { creditApi } from "@/request";
import DataTable from "./tools/DataTable.vue";
import useGlobalFilters from '../global/filters'

const { organization } = useGlobalFilters()

const filter = { oname: organization }
const tableColumnHeaders = [
    { prop: "oname", label: "社团" },
    { prop: "username", label: "负责人学号" },
    { prop: "uname", label: "负责人姓名" },
];

//loading遮罩层
const loading = ref(false);

//请求表格数据
function requestTableData() {
    loading.value = true;
    creditApi({
        method: "post",
        url: "/admin/approvedList",
    })
        .then((data) => {
            console.log(data);
            allData.value = data;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
            loading.value = false;
        });
}

const allData = ref([]);

function getOrganizations() {
    creditApi({
        url: "/organization/organizationList",
        method: "get",
    })
        .then((data) => {
            console.log(data);
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
