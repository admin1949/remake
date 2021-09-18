<template>
    <div>
        <div class="inline-content">
            <div class="label">{{title}}</div>
            <div class="input-content">
                <span @click="change(-1)" class="iconfont delete">&#xe6a5;</span>
                <input v-model="value" @input="input" type="text">
                <span @click="change(1)" class="iconfont add">&#xe6a6;</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';

const props = defineProps<{
    val: number,
    title: string,
}>();
let lastValue = props.val || 0;
const value = ref(lastValue);

const emit = defineEmits<{
    (event: 'change', value: number): void,
}>();

watch(() => props.val, () => {
    update();
})

const update = () => {
    lastValue = props.val;
    value.value = props.val;
}

const input = () => {
    const newValue = Number(value.value);
    if (isNaN(newValue)) {
        value.value = lastValue;
        return;
    }
    value.value = newValue;
    lastValue = newValue;
    change();
}

const change = (num: number = 0) => {
    const newValue = value.value + num;
    value.value = newValue < 0 ? 0 : newValue
    emit('change', value.value);
    nextTick(update);
}

</script>

<style scoped, lang="scss">
.inline-content{
    display: inline-flex;
    align-items: center;
    margin-bottom: 10px;
    .label{
        font-size: 26px;
        margin-right: 2em;
    }
    .input-content{
        display: flex;
        align-items: center;
        input{
            width: 1.7em;
            text-align: center;
            font-size: 32px;
            border: 2px solid #ccc;
            margin: 0 7px;
        }
        .add, .delete{
            font-size: 36px;
            cursor: pointer;
            user-select: none;
            &:hover{
                color: #5c5c5c;
            }
        }
    }
}
</style>