<template>
    <DataTable :table-data="tableData" :headers="tableColumnHeaders" :loading="loading" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { creditApi } from "@/request";
import DataTable from "./tools/DataTable.vue";

const loading = ref(false);

const tableColumnHeaders = [
    { prop: "oname", label: "社团" },
];
function requestTableData() {
    loading.value = true;
    creditApi({
        method: "post",
        url: "/user/admin",
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
const tableData = ref([]);

onMounted(() => {
    requestTableData();
});
</script>
