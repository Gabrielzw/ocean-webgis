import { ElNotification, ElMessageBox } from "element-plus";

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

export function showModal(content='提示内容', type='warning', title=''){
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
        }
    )
}


