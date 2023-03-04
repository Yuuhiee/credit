<script setup>
import { ref, computed } from "vue";
import * as XLSX from "xlsx";
import Toast from "@/utils/Toast";
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    /**headers:
     *  [   ...,
            { prop: "username", label: "学号", require: true },
            ...
        ]
     */
    headers: {
        type: Array,
        default: []
    },
    fileData: Array
})
const emit = defineEmits(["update:modelValue"])

const visible = computed(() => props.modelValue)
const changeVisible = (val) => {
    emit('update:modelValue', val)
}

const headerStr = computed(() => {
    let str = ""

    props.headers.forEach((header, index) => {
        str += header.label
        if (header.require)
            str += "*"
        if (index < props.headers.length - 1)
            str += " | "
    })
    return str
})


//批量导入-对话框
let fileName = ref("");
let fileInput = ref();
let file = null;


//表头
const translation = {}
props.headers.forEach((header) => {
    translation[header.label] = header.prop
})

//xlxs转对象
function fileChange() {
    if (!fileInput.value.files[0]) return clearFile();
    file = fileInput.value.files[0];
    fileName.value = file.name;
}
function clearFile() {
    fileName.value = "";
    file = null;
    fileInput.value.value = "";
}
function importByFile() {
    if (!file)
        return Toast("info", "请选择文件");
    else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        Toast("info", "请上传xls或者xlsx文件");
        return clearFile();
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        try {
            const data = e.target.result;
            const workbook = XLSX.read(data, {
                type: "binary",
            });
            if (workbook.SheetNames.length >= 1) {
                Toast("success", "导入成功");
            }
            const wsname = workbook.SheetNames[0];
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
            //将表格加入fileData，显示
            for (let i = ws.length - 1; i >= 0; i--) {
                let row = {};
                for (let key in ws[i]) row[translation[key]] = ws[i][key];
                props.fileData.unshift(row);
            }
            changeVisible(false)
            clearFile();
        } catch (e) {
            console.log(e);
        }
    };
    fileReader.readAsBinaryString(file);
}
</script>
  
<template>
    <el-dialog :modelValue="visible" @update:modelValue="changeVisible($event)" title="批量导入">
        <div class="file-container">
            <div class="input-appearance">
                <el-icon :size="30" color="#409eff">
                    <Plus />
                </el-icon>
                <span>选择 或 拖入 .xls/.xlsx文件</span>
                <br />
                <span>请包含表头: {{ headerStr }}</span>
            </div>
            <input ref="fileInput" class="file-input" type="file" @change="fileChange" accept=".xls,.xlsx" />
            <div class="tag-box">
                <el-tag v-if="fileName" closable @close="clearFile">{{
                    fileName
                }}</el-tag>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="changeVisible(false)">取消</el-button>
                <el-button type="primary" @click="importByFile">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog {
    .file-container {
        width: 70%;
        position: relative;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        --input-height: 200px;

        .file-input {
            width: 100%;
            height: var(--input-height);
            opacity: 0;
            margin-bottom: 20px;
            cursor: pointer;
        }

        .input-appearance {
            width: 100%;
            height: var(--input-height);
            position: absolute;
            top: 0;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed #5cadff;
            border-radius: 3px;

            span {
                color: #409eff;
                font-size: 12px;
                transform: translateY(20px);
            }
        }

        .tag-box {
            align-self: flex-start;
            height: 60px;
        }
    }
}
</style>