import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import { appStore } from '~/store/index.js';
import { toast, showModal } from '~/composables/util'

export function useRepassword() {
    const form = reactive({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const formRef = ref(null)

    const rules = {
        oldPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        newPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        confirmPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
    }

    return { form, formRef, rules }
}

export function useLogout() {
    const router = useRouter();
    const store = appStore();
    function handleLogout() {
        showModal('是否要退出登录？').then(res => {
            store.logout();
            router.push('/login');
            toast('成功', '已退出登录', 'success');
        })
    }
    return { handleLogout }
}



