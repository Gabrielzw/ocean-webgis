import { ElNotification } from "element-plus";

// 消息提示
export function toast(
    title="成功", 
    message, 
    type = "success", 
    dangerouslyUseHTMLString = false) {
    ElNotification({
        title: title,
        message: message,
        type: type,
        duration: 3000,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString, // 是否允许HTML内容
    });
}




