<template>
    <div class="add-apply">
        <div class="apply-table">
            <div class="button-container">
                <div class="import-buttons">
                    <el-button size="small" @click="batchImportVisible = true">导入表格</el-button>
                    <el-button size="small" @click="addVisible = true">添加单行</el-button>
                    <el-tag type="info" effect="dark">共{{ totalCount }}条</el-tag>
                    <el-button size="small" type="danger" plain @click="clearTable"
                        :disabled="!tableData.length">清空</el-button>
                </div>
                <div>
                    <el-popover v-if="blanksInTable.length" placement="top-start" :width="200" trigger="click"
                        :content="`第${blanksInTable.join(',')}行缺少数据`">
                        <template #reference>
                            <el-button type="warning" plain>表格不完整</el-button>
                        </template>
                    </el-popover>
                    <el-button :disabled="blanksInTable.length != 0 || tableData.length == 0" type="primary"
                        @click="emit('submit', () => { emit('update:modelValue', []) })">提交</el-button>
                </div>
            </div>
            <div class="table-container">
                <el-table :data="pageData" border stripe v-loading="loading">
                    <el-table-column label="序号" width="60px" align="center">
                        <template #default="scope">{{
                            (currentPage - 1) * pageSize + scope.$index + 1
                        }}</template>
                    </el-table-column>
                    <el-table-column v-for="(header, index) in headers" :key="index" :prop="header.prop"
                        :label="header.label" align="center" />
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-link type="primary" @click="showEditBox(scope.$index)">编辑</el-link>
                            <el-link type="primary" @click="removeRow(scope.$index)">删除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" small background layout="prev, pager, next"
                    :total="totalCount" />
            </div>
        </div>
    </div>
    <FileDialog v-model="batchImportVisible" :headers="headers" :file-data="tableData" />
    <TableRowDialog v-model="addVisible" title="新增" :keys="headers" @confirm="addRow($event)" />
    <TableRowDialog v-model="editVisible" title="编辑" :keys="headers" :data="tableData[rowIndex]"
        @confirm="reviseRow($event)" />
</template>

<script setup>
import { ref, computed } from "vue";
import { ElMessageBox } from "element-plus";
import Toast from "../../utils/Toast";
import FileDialog from "./FileDialog.vue";
import TableRowDialog from "./TableRowDialog.vue";

const props = defineProps({
    modelValue: Array,
    headers: Array,
    loading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:modelValue', 'submit'])

const tableData = computed(() => props.modelValue)


const currentPage = ref(1);
const totalCount = computed(() => tableData.value.length);
const pageSize = 10;
const pageData = computed(() =>
    tableData.value.slice(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize
    )
);

const rowIndex = ref(0)
const batchImportVisible = ref(false);
const addVisible = ref(false);
const editVisible = ref(false);
const addRow = (data) => {
    tableData.value.unshift(data);
    addVisible.value = false;
}
const showEditBox = (index) => {
    rowIndex.value = (currentPage.value - 1) * pageSize + index;
    editVisible.value = true;
}
const reviseRow = (data) => {
    tableData.value[rowIndex.value] = data;
    editVisible.value = false;
}


//判断表格是否有数据缺失
const blanksInTable = computed(() => {
    const res = []
    tableData.value.forEach((data, index) => {
        props.headers.forEach((header) => {
            if (header.require && !data[header.prop])
                res.push(index + 1)
        })
    })
    return res
})
//移除单行数据
const removeRow = (index) => {
    rowIndex.value = (currentPage.value - 1) * pageSize + index;
    ElMessageBox.confirm("确认删除该条数据？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        icon: "QuestionFilled",
    })
        .then(() => {
            tableData.value.splice(rowIndex.value, 1);
            Toast("success", "已删除");
        })
        .catch(() => { });
}
//清空表格数据
const clearTable = () => {
    ElMessageBox.confirm("确认清空表格？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            emit('update:modelValue', [])
            Toast("success", "已清空");
        })
        .catch(() => { });
}

</script>

<style lang="scss" scoped>
.add-apply {
    .el-table {
        min-height: 440px;
    }

    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    height: 100%;

    .apply-table {
        width: 100%;

        .button-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 16px;

            .el-tag {
                margin: 0 8px 0 25px;
            }
        }

        .select-container {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            margin-right: 10px;

            .el-select {
                width: 150px;
            }
        }

        .table-container {
            min-height: 450px;
        }

        .el-link {
            font-size: 12px;
            margin-right: 5px;
        }

        .pagination-container {
            width: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0 0 0;
        }
    }
}

.el-dialog {
    .el-input {
        width: 100%;
    }
}
</style>
