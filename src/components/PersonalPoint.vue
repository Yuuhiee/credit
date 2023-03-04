<script setup>
import exportDataAsPdf from "@/utils/download_pdf"
import { ref, onMounted } from "vue";
import DataTable from "./tools/DataTable.vue";
import { creditApi } from "../request";
import useGlobalProperties from '../global/properties'
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user";
const { username } = storeToRefs(useUserStore());
const { $scoreType } = useGlobalProperties()

const loading = ref(false)
const data = ref([])
const columns = [
    { label: '活动名称', prop: 'name' },
    { label: '学分', prop: 'score' },
    { label: '社团', prop: 'organization' },
    { label: '加分类型', prop: 'type' },
]
const exportData = () => {
    exportDataAsPdf(data.value, columns, `${username}的加分条`)
}
const exportButton = {
    label: '导出为PDF',
    type: 'primary',
    icon: 'DocumentAdd',
    plain: true,
    onClickHandler: exportData
}
const requestData = () => {
    loading.value = true
    creditApi({
        method: 'post',
        url: '/user/allScore',
        params: {
            org: '无',
            type: 0,
            username,
            year: '无'
        }
    }).then((_data) => {
        console.log(_data);
        data.value = _data
        data.value.forEach(item => {
            item.type = $scoreType[item.type]
        })
    }).finally(() => {
        loading.value = false
    })
}

onMounted(() => {
    requestData()
})


</script>
  
<template>
    <DataTable :table-data="data" :headers="columns" :extra-buttons="[exportButton]" @refresh="requestData"
        v-loading="loading" />
</template>
