<script lang="ts" setup>
import { ref } from 'vue';
import { loadSource, Life } from '../remake';
import { ElMessage } from '../components/Message'

const progress = ref({
    age: 0,
    event: 0,
    talent: 0,
});

const loadSourceDone = ref(false);

loadSource({
    ageJson: '/data/age.json',
    eventJson: '/data/events.json',
    talentJson: '/data/talents.json',
}, (event) => {
    progress.value.age = event.age;
    progress.value.event = event.event;
    progress.value.talent = event.talent;
}).then(res => {
    const data = res.map(i => i.data);
    life.initial({
        age: data[0],
        event: data[1],
        talent: data[2],
    });
    loadSourceDone.value = true;
}).catch(err => {
    ElMessage.error(err);
});

const life = new Life;
const hasStart = ref(false);

const remake = () => {
    life.restart({
        CHR: 5,
        INT: 5,
        STR: 5,
        MNY: 5,
        SPR: 4,
        TLT: [ 1001, 1003, 1005 ],
    });
    hasStart.value = true;
    lifeEventList.value.length = 0;
    let interval = setInterval(() => {
        const detail = next();
        if (detail.isEnd) {
            clearInterval(interval);
        }
    }, 1000)
    next();
}
const next = () => {
    const detail = life.next();
    lifeEventList.value.push(detail);
    return detail;
}

const lifeEventList = ref<ReturnType<Life["next"]>[]>([]);

</script>

<template>
    <h1>remake</h1>
    <div v-if="!loadSourceDone">
        <div>load Progress</div>
        <div>age: {{ progress.age }}</div>
        <div>event: {{ progress.age }}</div>
        <div>talent: {{ progress.age }}</div>
    </div>
    <div v-else>
        <button v-if="!hasStart" type="button" @click="remake">REMAKE</button>
        <div v-else>
            <div v-for="i in lifeEventList" :key="i.age">
                <div>{{ i.age + 1 }} 岁</div>
                <div>
                    <div v-for="(i, index) in i.eventContent">
                        {{i.description}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <button v-if="hasStart" @click="next">next</button>
    </div>
</template>