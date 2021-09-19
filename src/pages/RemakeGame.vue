<template>
    <div class="main-content">
        <div class="property">
            <div class="item">
                <div>颜值</div>
                <div>{{currentProperty.CHR}}</div>
            </div>
            <div class="item">
                <div>智力</div>
                <div>{{currentProperty.INT}}</div>
            </div>
            <div class="item">
                <div>体质</div>
                <div>{{currentProperty.STR}}</div>
            </div>
            <div class="item">
                <div>家境</div>
                <div>{{currentProperty.MNY}}</div>
            </div>
            <div class="item">
                <div>快乐</div>
                <div>{{currentProperty.SPR}}</div>
            </div>
        </div>
        <div ref="lifeContent" @click="next" class="life-event-content">
            <div class="item" v-for="i in lifeEventList" :key="i.age">
                <div class="age">{{ i.age }} 岁：</div>
                <div class="info">
                    <div v-for="(i, index) in i.eventContent">
                        {{i.description}}
                    </div>
                    <template v-if="i.age === 0">
                        <div v-for="i in replaceMent" :key="i.source._id">
                            天赋【{{i.source.name}}】发动: 替换为天赋【{{i.target.name}}】                       
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div>
            <template v-if="isEnd">
                <div @click="gotoResult" class="button">人生总结</div>
            </template>
            <template v-else>
                <div v-for="(i, index) in autoList" @click="autoPlay(index)" class="button">{{ index === currentAuto ? '立即停止' : i.name }}</div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore, getters, commit } from '@store';
import { life } from '@remake';
import { useRouter } from 'vue-router';
import { computed, ref, nextTick } from 'vue';

const store = useStore();
const router = useRouter();

const replaceMent = life.restart({
    ...store.state.property.property,
    SPR: 5, // 默认快乐 5
    LIF: 1, // 生命默认 1
    TLT: getters('talent/selectedTalentIds'), // 选择的天赋
});

const currentProperty = ref(life.getLastRecord());

const lifeEventList = ref<ReturnType<typeof life.next>[]>([]);
const isEnd = computed<boolean>({
    get() {
        return store.state.gameResult.isEnd;
    },
    set(newVal) {
        commit('gameResult/setIsEnd', newVal);
    }
});

commit('gameResult/setIsEnd', false);


const lifeContent = ref<HTMLDivElement>();
const scrollToButton = () => {
    lifeContent.value?.scrollTo({
        top: lifeContent.value.scrollHeight,
    })
}

const next = () => {
    if (isEnd.value) {
        return;
    }
    const lifeEventItem = life.next();
    isEnd.value = lifeEventItem.isEnd;
    lifeEventList.value.push(lifeEventItem);
    currentProperty.value = life.getLastRecord();
    nextTick(scrollToButton);
}

let currentAuto = ref(-1);
const autoList = [
    {
        time: 1000,
        name: '自动播放'
    },
    {
        time: 500,
        name: '自动 x 2'
    },
    {
        time: 0,
        name: '立即结束',
    }
]

let interval:any;
const autoPlay = (index: number) => {
    if (index === currentAuto.value) {
        clearInterval(interval);
        return currentAuto.value = -1;
    }

    currentAuto.value = index;
    const time = autoList[index].time;
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        if (isEnd.value) {
            clearInterval(interval);
            currentAuto.value = -1;
        }
        next();
    }, time);
}

// 0岁时，自动执行一次。
next();

const gotoResult = () => {
    if(!isEnd.value) {
        return;
    }
    commit('gameResult/setGamgeResultRecord', life.getRecord());
    router.replace('/check-result');
}

</script>

<style scoped lang="scss">
.property{
    display: flex;
    padding: 0 20px;
    .item{
        flex: 1;
        margin-right: 6px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        border: 1px solid #a7a7a7;
        border-radius: 4px;
        font-size: 18px;
        box-sizing: border-box;
        align-items: center;
        text-align: center;
        border: 1px solid #ccc;
        div{
            width: 100%;
        }
        div:first-child{
            @include themed('white') {
                background-color: #8d8d8d;
            }
            color: #fff;
        }
        div:last-child{
            background-color: #eee;
            @include themed('dark') {
                color: #666;
            }
        }
        &:last-child{
           margin-right: 0;
        }
    }
}
.life-event-content{
    flex: 1;
    margin: 20px;
    height: 0;
    box-sizing: border-box;
    overflow: auto;
    user-select: none;
    border: 1px solid #a7a7a7;
    border-radius: 8px;
    padding: 10px 0;
    font-size: 22px;
    .item{
        margin-bottom: 10px;
        box-shadow: #a7a7a7 0 0 10px;
        padding: 10px;
        display: flex;
        align-items: flex-start;
        &:last-child{
            margin-bottom: 0;
        }
        .age{
            width: 4em;
            text-align: right;
        }
        .info{
            width: 0;
            flex: 1;
        }
    }
}
</style>