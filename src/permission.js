import router from '~/router'

import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/util";
import { appStore } from "~/store/index.js";

// 全局前置守卫
router.beforeEach((to, from, next)=>{
    // 显示loading
    showFullLoading()

    const token = getToken()
    // console.log(token)
    // 没有登录，则强制跳转回登录页
    if(!token && to.path != '/login'){
        toast('错误', '请先登录！', 'error')
        return next({ path: '/login' })
    }

    // 防止重复登录
    if(token && to.path == '/login'){
        return next({ path: from.path ? from.path : '/' })
    }

    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : '') + '-渤海赤潮监测WebGIS'
    document.title = title

    next()
})

// 全局后置守卫
router.afterEach((to, from)=>{
    // 隐藏loading
    hideFullLoading()
})

