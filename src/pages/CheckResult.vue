<template>
    <div class="main-content">
        <div class="title">人生总结</div>
        <div class="content">
            <div class="result">
                <div class="item" :class="['level-' + result[i.key].grade]" v-for="i in list" :key="i.key">
                    <div class="label">{{ i.name }}：</div>
                    <div class="value">
                        {{ result[i.key].value }} {{ result[i.key].judge }}
                    </div>
                </div>
            </div>
            <div class="extend-talent-content">
                <div class="sub-title">天赋, 你可以选一个, 下辈子还能抽到</div>
                <TalentList :list='talentList' :max-selected-num="1"></TalentList>
            </div>
        </div>
        <div>
            <div @click="remake" class="button">再次重开</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getters, useStore, commit } from '@store';
import { computed, readonly, UnwrapRef, ref } from 'vue';
import { useRouter } from 'vue-router';
import TalentList from '../components/TalentList.vue';

const result = computed(() => getters('gameResult/summary'));
const store = useStore();
const router = useRouter();
const list = readonly<{key: keyof UnwrapRef<typeof result>, name: string}[]>([
    {
        key: 'CHR',
        name: '颜值',
    },
    {
        key: 'INT',
        name: '智力',
    },
    {
        key: 'STR',
        name: '体质',
    },
    {
        key: 'MNY',
        name: '家境',
    },
    {
        key: 'SPR',
        name: '快乐',
    },
    {
        key: 'AGE',
        name: '享年',
    },
    {
        key: 'SUM',
        name: '总评',
    }
]);

const talentList = ref(store.state.talent.selectedTalents.map(i => ({ ...i, selected: false })));

const selectedToSaveTalentId = computed(() => {
    const selectedTalent = talentList.value.filter(i => i.selected);
    if (!selectedTalent.length) {
        return 0;
    }
    return selectedTalent[0].id;
})

const remake = () => {
    commit('gameResult/setIsEnd', false);
    commit('gameResult/setGamgeResultRecord', []),
    commit('talent/setSelectedTalents', []),
    commit('property/resetProperty');
    commit('gameResult/setLastGameSavedTalent', selectedToSaveTalentId.value);
    router.push('/');
}
</script>

<style scoped lang="scss">
.content{
    display: flex;
    flex-direction: column;
    height: 0;
    flex: 1;
    overflow: auto;
    // .extend-talent-content{
    //     height: 0;
    //     flex: 1;
    //     overflow: auto;
    // }
}
.result{
    padding: 20px 20px 30px;
    .item{
        display: flex;
        color: #fff;
        box-shadow: #ccc 0 0 10px;
        border: 2px solid #c5c5c5;
        margin-bottom: 10px;
        font-size: 20px;
        padding: 4px 0;
        border-radius: 4px;
        &:last-child{
            margin-bottom: 0;
        }
        &.level-0{
            background-color: #464646;
        }
        &.level-1{
            background-color: #6495ed;
        }
        &.level-2{
            background-color: #e2a7ff;
        }
        &.level-3{
            background-color: #ffa07a;
        }
        .label{
            width: 4em;
            box-sizing: border-box;
            text-align: right;
        }
        .value{
            width: 0;
            flex: 1;
            text-align: center;
        }
    }
}
.sub-title{
    padding-bottom: 10px;
}
</style>