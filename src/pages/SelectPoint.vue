<template>
    <div class="main-content">
        <div class="title-content">
            <div class="title">调整初始属性</div>
            <div class="sub-title">可用属性点{{canUsePoints}}</div>
        </div>
        <div>
            <InputItem @change="num => setPointItem('CHR', num)" :val="property.CHR" title="颜值"></InputItem>
            <InputItem @change="num => setPointItem('INT', num)" :val="property.INT" title="智力"></InputItem>
            <InputItem @change="num => setPointItem('STR', num)" :val="property.STR" title="体质"></InputItem>
            <InputItem @change="num => setPointItem('MNY', num)" :val="property.MNY" title="家境"></InputItem>
        </div>
        <div>
            <div @click="setRandomPorty" class="button">随机分配</div>
            <div @click="gotoRemakeGame" class="button">开始新人生</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore, getters, commit } from '@store';
import { useRouter } from 'vue-router';
import InputItem from '../components/InputItem.vue';

const store = useStore();
const router = useRouter();
const allPoints = computed(() => getters('property/allPointNum'));

if (allPoints.value >= store.state.property.lastGamePoint) {
    commit('property/recoveryLastGameProperty');
}

type TProperty = {
    CHR: number, // 颜值 charm CHR
    INT: number, // 智力 intelligence INT
    STR: number, // 体质 strength STR
    MNY: number, // 家境 money MNY
}
const property = computed(() => store.state.property.property);

const canUsePoints = computed(() => getters('property/canUsePointNum'));

const setPointItem = <T extends keyof TProperty>(key: T, value: number) => {
    const addValue = value - property.value[key];
    if (addValue < 0){
        commit('property/setPropertyItem', { key, value });
        return 
    }
    if(addValue > canUsePoints.value) {
        commit('property/setPropertyItem', { key, value: property.value[key] + canUsePoints.value})
        return;
    }
    commit('property/setPropertyItem', { key, value });
    property.value[key] = value;
}

const getRandomPropoty = () => {
    let allPointsNum = allPoints.value;
    return Array.from({ length: 4 }).map((item, index, arr) => {
        if (allPointsNum === 0) {
            return 0;
        }
        if (index === arr.length - 1) {
            return allPointsNum;
        }
        const val = Math.floor(Math.random() * allPointsNum);
        allPointsNum -= val;
        return val
    });
}

const setRandomPorty = () => {
    const [CHR, STR, INT, MNY] = getRandomPropoty();
    commit('property/setPropertyItem', { key: 'CHR', value: CHR });
    commit('property/setPropertyItem', { key: 'STR', value: STR });
    commit('property/setPropertyItem', { key: 'INT', value: INT });
    commit('property/setPropertyItem', { key: 'MNY', value: MNY });
}

const gotoRemakeGame = () => {
    if (canUsePoints.value > 0) {
        return void console.log('has other point:', canUsePoints.value);
    }
    router.replace({
        path: '/remake-game',
    })
}

</script>

<style lang="scss" scoped>
</style>