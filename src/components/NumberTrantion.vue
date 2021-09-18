<template>
    <span>{{fixNumber(showValue)}}</span>
    {{value}}
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { gsap } from 'gsap';
const props = defineProps<{
    value: number
}>();

const showValue = ref(0);

const update = (val: number) => {
    gsap.to(showValue, {
        duration: .5,
        value: val
    });
}

update(props.value);

watch(() => props.value, (newValue) => {
    update(newValue);
});

const fixNumber = (val: number, fix = 2) => {
    return Number.prototype.toFixed.call(val, fix);
}

</script>