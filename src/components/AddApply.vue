<template>
    <TableEditor v-model="tableData" :headers="tableColumnHeaders" @submit="$event => selectActivity($event)"
        :loading="submitting" />
    <el-dialog v-model="dialogVisible" title="选择活动" width="30%" :show-close="false">
        活动名称：
        <el-cascader v-if="activitiesVisible" v-model="activity" :options="activities" filterable clearable
            :show-all-levels="false" />
        &nbsp;&nbsp;&nbsp;<el-button type="primary" plain @click="getActivities">刷新</el-button>
        <template #footer>
            <span class="dialog-footer">
                <el-button :disabled="submitting" @click="dialogVisible = false">取消</el-button>
                <el-button :loading="submitting" type="primary" @click="submitApply">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import Toast from "../utils/Toast";
import { creditApi } from "../request";
import TableEditor from './tools/TableEditor.vue';

const props = defineProps({
    "detail-list": {
        type: Array,
        default: [],
    },
    "activity-name": {
        type: String,
        default: "",
    },
});


//表头配置
const tableColumnHeaders = [
    { prop: "username", label: "学号", require: true, type: String },
    { prop: "name", label: "姓名", require: true, type: String },
    { prop: "score", label: "分数", require: true, type: Number },
    { prop: "explanation", label: "备注", require: false, type: String, textarea: true },
];

//表格数据
const tableData = ref([]);
watch(
    () => props.detailList,
    (val) => {
        tableData.value = val;
    }
);


//选择活动名称及提交对话框
const dialogVisible = ref(false);
const submitting = ref(false);
const activities = ref([]);
const activity = ref("");
const activitiesVisible = ref(true)
//获取-选择活动-对话框的活动数据
function getActivities() {
    activities.value = []
    creditApi
        .get("/organization/organizationList")
        .then((data) => {
            data.forEach(({ organizationName }) => {
                const item = {
                    value: organizationName,
                    label: organizationName,
                };

                if (
                    !activities.value.some(
                        ({ value }) => value == organizationName
                    )
                ) {
                    activities.value.push(item);

                    creditApi({
                        url: "/organization/activityList",
                        method: "post",
                        params: {
                            organization: organizationName,
                        },
                    }).then((data) => {
                        const children = data.map(({ aname }) => {
                            return {
                                value: aname,
                                label: aname,
                            };
                        });
                        item["children"] = children;
                        item["disabled"] = !children.length;

                        activitiesVisible.value = false
                        nextTick(() => activitiesVisible.value = true)
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}
//选择加分条活动
function selectActivity() {
    if (props.activityName) {
        console.log("activity-name:", props.activityName);
        creditApi({
            url: "/activity/addstrip",
            method: "post",
            params: {
                name: props.activityName,
            },
            data: tableData.value,
        })
            .then((data) => {
                console.log(data);
                Toast("success", "提交成功！");
            }).catch((err) => { return err })
            .finally((err) => {
                console.log(err);
                submitting.value = false;
            });
    } else {
        dialogVisible.value = true;
        getActivities();
    }
}
//提交表格
function submitApply(clearTable) {
    if (submitting.value) return;
    submitting.value = true;
    console.log(tableData.value);
    creditApi({
        url: "/activity/addstrip",
        method: "post",
        params: {
            name: activity.value[1],
        },
        data: tableData.value,
    })
        .then((data) => {
            console.log(data);
            dialogVisible.value = false;
            submitting.value = false;
            clearTable()
            Toast("success", "提交成功！");
        })
        .catch(() => { })
        .finally(() => {
            submitting.value = false;
        });
}



onMounted(() => {
    getActivities();
});
</script>

