import { ElMessage } from "element-plus";
export default function (type, message, duration = 800) {
    ElMessage({
        type: type,
        message: message,
        duration,
    })
}