<script setup>
import TableEditor from './tools/TableEditor.vue';
import { ElMessageBox } from 'element-plus';
import Toast from '../utils/Toast';
import { ref } from 'vue';
import { creditApi } from '../request';
const tableData = ref([])
const tableColumnHeaders = [
    { prop: "username", label: "学号", require: true, type: String },
    { prop: "name", label: "姓名", require: true, type: String },
];
const submitting = ref(false)
const submitStudentInfos = () => {
    ElMessageBox.confirm("确认提交学生信息？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        icon: "QuestionFilled",
    })
        .then(() => {
            submitting.value = true
            creditApi({
                method: 'post',
                url: '/admin/createUsers',
                data: tableData.value
            }).then(() => {
                Toast("success", "提交成功！");
                tableData.value = []
            }).finally(() => {
                submitting.value = false
            })
        })
        .catch(() => { });
}
</script>
  
<template>
    <TableEditor v-model="tableData" :headers="tableColumnHeaders" @submit="$event => submitStudentInfos($event)"
        :loading="submitting" />
</template>
