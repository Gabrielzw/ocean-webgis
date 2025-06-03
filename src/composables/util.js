import { createApp, h, ref } from 'vue'
import { ElNotification, ElMessageBox, ElPopover } from "element-plus";
import nprogress from "nprogress";
import CustomPopup from '~/components/CustomPopup.vue';

// 消息提示
export function toast(
    title = "成功",
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

let popupInstance = null; // 存储弹窗实例

export function showPopupWindow(
    title = "信息",
    message,
    dangerouslyUseHTMLString = true) {
    return h(ElPopover, {
        title: title,
        content: message,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
        placement: "top"
    })
}



export function showModal(content = '提示内容', type = 'warning', title = '') {
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

// 显示全屏loading
export function showFullLoading() {
    nprogress.start();
}

// 隐藏全屏loading
export function hideFullLoading() {
    nprogress.done();
}

