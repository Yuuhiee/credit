<!-- 展示活动列表 -->
<template>
    <DataTable :table-data="activities" :loading="loading" :headers="tableColumnHeaders" no-border no-header />
</template>

<script setup>
import { computed } from "vue";
import DataTable from "./DataTable.vue";
import useGlobalProperties from "@/global/properties";

const { $scoreType } = useGlobalProperties()

const props = defineProps({
    activities: {
        type: Array,
        default: [],
    },
    loading: {
        type: Boolean,
        default: true
    }
});
const activities = computed(() => {
    return props.activities.map((item) => {
        item.activityType = $scoreType[item.activityType];
        return item;
    });
});
//表头配置
const tableColumnHeaders = [
    { prop: "aname", label: "活动名称" },
    { prop: "site", label: "活动地点" },
    { prop: "activityType", label: "学分类型" },
    { prop: "time", label: "活动时间" },
    { prop: "year", label: "活动年份" },
    { prop: "explanation", label: "活动描述" },
];

</script>