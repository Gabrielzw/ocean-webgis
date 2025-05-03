import router from '~/router'

import { getToken } from "~/composables/auth";
import { toast } from "~/composables/util";

// 全局前置守卫
router.beforeEach((to, from, next)=>{
    const token = getToken()

    // 没有登录，则强制跳转回登录页
    if(!token && to.path != '/login'){
        toast('错误', '请先登录！', 'error')
        return next({ path: '/login' })
    }

    // 防止重复登录
    if(token && to.path == '/login'){
        return next({ path: from.path ? from.path : '/' })
    }
    
    next()
})

