<template>
    <el-drawer v-model="showDrawer" 
        :title="title" 
        :size="size" 
        :close-on-click-modal="false">
        <div class="formDrawer">
            
        </div>

    <el-row class="flex-row-reverse">
        <el-button round color="#e11d48" type="primary" @click="handleCancel">取 消</el-button>     
        <el-button class="mr-2" round color="#626aef" type="primary" @click="handleSubmit">提 交</el-button>     
    </el-row>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus';
import { useLocalStorage } from "@vueuse/core";

const showDrawer = ref(false)

const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '45%',
    },
    destoryOnClose: { // 关闭时销毁组件
        type: Boolean,
        default: false,
    }
}); // 接收父组件传递的参数

const open = () => showDrawer.value = true; // 打开抽屉
const close = () => showDrawer.value = false; // 关闭抽屉

// 向父组件传递事件
defineExpose({ open, close });

</script>

<style>


</style>