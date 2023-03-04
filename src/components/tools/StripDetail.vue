<template>
    <DataTable class="table" :table-data="tableData" :headers="tableColumnHeaders" :loading="loading" no-border no-header />
</template>

<script setup >
import { onMounted, ref, watch } from "vue";
import { creditApi } from "@/request/index.js";
import DataTable from "./DataTable.vue";
//组件属性
const props = defineProps({
    "activity-name": {
        type: String,
        default: "",
    },
});

//表格loading遮罩层的显示
const loading = ref(false);


//请求表格数据
function requestTableData() {
    if (loading.value) return;
    loading.value = true;

    creditApi({
        method: "post",
        url: "/activity/searchScore",
        params: {
            name: props.activityName,
        },
    })
        .then((data) => {
            console.log(data);
            tableData.value = data;
        })
        .catch((err) => {
            tableData.value = []
        })
        .finally(() => {
            loading.value = false;
        })
}
//表头配置
const tableColumnHeaders = [
    { prop: "username", label: "学号" },
    { prop: "uname", label: "姓名" },
    // { prop: "date", label: "日期" },
    { prop: "score", label: "分数" },
    { prop: "explanation", label: "备注" },
];

//表格全部数据
const tableData = ref([]);

watch(() => props.activityName, requestTableData);

onMounted(() => {
    requestTableData();
});
</script>
<style lang="scss" scoped>
.table {
    transform: translateY(-14px);
}
</style>
