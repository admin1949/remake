<template>
    <div class="main-content">
        <div class="title-content">
            <div class="title">人生重开模拟器</div>
            <div class="sub-title">这垃圾人生一秒也不想待了</div>
        </div>
        <div class="load-progress">
            <div class="item">
                <span class="label">事件列表:</span>
                <span class="value">{{animationProgress.event}}%</span>
            </div>
            <div class="item">
                <span class="label">年龄列表:</span>
                <span class="value">{{animationProgress.age}}%</span>
            </div>
            <div class="item">
                <span class="label">天赋列表:</span>
                <span class="value">{{animationProgress.talent}}%</span>
            </div>
        </div>
        <div>
            <template v-if="loadSouceStatus === 'PENGING'">
                <div>资源加载中。。。</div>
            </template>
            <template v-if="loadSouceStatus === 'RESOLVED'">
                <div @click="gotoSelectTalent" class="button">立即重开</div>
            </template>
            <template v-if="loadSouceStatus === 'REJECTED'">
                <div>资源文件加载失败</div>
                <div class="button">点击重试</div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore, commit } from "@store";
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNumberTransitionGroup } from '../hooks/useNumberTransition';

const store = useStore();

const progress = {
    age: computed(() =>  store.state.loadSource.progress.age),
    event: computed(() =>  store.state.loadSource.progress.event),
    talent: computed(() =>  store.state.loadSource.progress.talent),
};

const animationProgress = useNumberTransitionGroup(progress);

const loadSouceStatus = computed(() => store.state.loadSource.loadSouceStatus);
const router = useRouter();
const gotoSelectTalent = () => {
    router.push({
        path: '/select-talent',
    })
}

</script>

<style scoped lang="scss">
.main-content{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 100px 0;
    box-sizing: border-box;
    justify-content: space-between;
}
.load-progress{
    .item{
        font-size: 20px;
        margin-top: 10px;
        &:last-child{
            margin-bottom: 10px;
        }
        .value{
            display: inline-block;
            width: 4em;
            text-align: right;
        }
    }
}
</style>