<template>
    <transition
        name="el-message-fade"
        @before-leave="onClose"
        @after-leave="$emit('destory')"
    >
        <div
            v-show="visible"
            class="message-content"
            :id="id"
            @mouseenter="clearTimer"
            @mouseleave="startTimer"
            :style="computedStyle"
        >
            <span class="iconfont icon">&#xe6a3;</span>
            <slot>
                <span v-html="message"></span>
            </slot>
            <div
                v-if="showClose"
                class="iconfont icon-close"
                @click.stop="close"
            >
                &#xe6a8;
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, Component, computed } from 'vue';

const props = defineProps<{
    center?: boolean,
    duration?: number,
    message?: string | Component,
    type?: 'info' | 'error' | 'warning' | 'success',
    showClose?: boolean,
    offset?: number,
    id: string,
    onClose?: () => void,
}>();
defineEmits<{
    (type: 'destory'): void
}>();

const visible = ref(false);
let timer: any = null;
let hasTimeoutClose = false;

const computedStyle = computed(() => {
    return {
        top: `${props.offset || 20}px`
    };
})

const startTimer = () => {
    const duration = props.duration || 3000;
    if (duration <= 0 || hasTimeoutClose) {
        return;
    }
    hasTimeoutClose = true;
    timer = setTimeout(() => {
        if (visible.value) {
            close();
        }
    }, duration);
}

const clearTimer = () => {
    clearTimeout(timer);
    hasTimeoutClose = false;
    timer = null;
}

onMounted(() => {
    startTimer();
    visible.value = true;
});

const close = () => {
    visible.value = false;
}

defineExpose({
    close() {
        visible.value =false;
    }
})

</script>

<style lang="scss">
.message-content{
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    padding: 15px 45px 15px 15px;
    display: flex;
    align-items: center;
    min-width: 320px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform 0.4s, top 0.4s;
    box-sizing: border-box;
    border-radius: 4px;
    .icon-close{
        position: absolute;
        right: 15px;
        cursor: pointer;
        user-select: none;
        top: 50%;
        font-size: 28px;
        transform: translateY(-50%);

    }
}

.icon{
    font-size: 28px;
    margin-right: 10px;
}

.el-message-fade-enter-from,
.el-message-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -100%);
}
</style>