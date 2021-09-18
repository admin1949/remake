<template>
    <div class="main-content">
        <div class="title">天赋抽卡</div>
        <div class="talent-content">
            <template v-if="isSuperLife">
                <TalentList :list="allTalents" :max-selected-num="-1"></TalentList>
            </template>
            <template v-else>
                <div v-if="!hasBeenChooseTalent" class="choose-content">
                    <div @click="getTalents" class="button">10连抽！</div>
                </div>
                <TalentList v-if="hasBeenChooseTalent" :list="talents" :max-selected-num="3"></TalentList>
            </template>
        </div>
        <div>
            <div @click="isSuperLife = !isSuperLife" class="button">{{ isSuperLife ? '选择普通人生' : '选择超级人生' }}</div>
            <div @click="verifySelectedTalents() && gotoSelectPoint()" class="button">{{ isSuperLife ? '选择天赋' : '选择三个' }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { life, Life } from '@remake';
import { useStore, commit } from '@store';
import TalentList from '../components/TalentList.vue';
type WithSelectedArray<T> = T extends (infer R)[] ? (R & { selected: boolean })[] : never;

const store = useStore();
const router = useRouter();

const hasBeenChooseTalent = ref(false);
const isSuperLife = computed<boolean>({
    get() {
        return store.state.talent.isSuperLife;
    },
    set(newVal) {
        commit('talent/setIsSuperLife', newVal);
    }
});



const talents = ref<WithSelectedArray<ReturnType<Life['talentRandom']>>>([]);
const selectedTanlents = computed(() => {
    return talents.value.filter(i => i.selected);
});

const allTalents = ref<WithSelectedArray<ReturnType<Life['getAllTalent']>>>(life.getAllTalent().map(i => ({ selected: false, ...i })));
const selectedSuperTalents = computed(() => {
    return allTalents.value.filter(i => i.selected);
});

const getTalents = () => {
    hasBeenChooseTalent.value = true;
    talents.value = life.talentRandom().map(i => ({selected: false, ...i}));
}

const verifySelectedTalents = () => {
    if (isSuperLife.value) {
        return true;
    }
    if (selectedTanlents.value.length === 3) {
        return true;
    }
    console.log('verify Error');
    return false;
}

const gotoSelectPoint = () => {
    commit('talent/setSelectedTalents', isSuperLife.value ? selectedSuperTalents.value : selectedTanlents.value);
    router.replace('/select-point');
}

</script>

<style lang="scss" scoped>
.title{
    font-size: 24px;
}
.talent-content{
    flex: 1;
    height: 0;
    overflow: auto;
    .choose-content{
        display: flex;
        align-items: center;
        height: 100%;
    }

    .button{
        margin: auto;
    }
}
</style>