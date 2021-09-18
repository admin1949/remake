<template>
    <div class="talent-list">
        <div @click="selectedItem(index)" class="item" :class="['level-' + i.grade, i.selected ? 'selected' : '' ]" v-for="(i, index) in list" :key="i.id">
            <span>{{i.name}}</span>
            <span>（{{i.description}}）</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { life } from '@remake';
const props = defineProps<{
    list: {
        id: number,
        grade: number,
        name: string,
        description: string,
        selected?: boolean,
    }[],
    maxSelectedNum: number,
    disableSelect?: boolean,
}>();

const isMaxSelected = () => {
    if (props.maxSelectedNum === -1) {
        return false;
    }
    const selectedList = props.list.filter(i => i.selected);
    return selectedList.length >= props.maxSelectedNum;
}
const checkIsContradicted = (id: number) => {
    const selectedIds = props.list.filter(i => i.selected).map(i => i.id);
    const checkResult = life.exclusive(selectedIds, id);
    return {
        contradictId: Number(checkResult),
        hasContradict: Boolean(checkResult),
    };
}

const selectedItem = (index: number) => {
    if (props.disableSelect) {
        return;
    }
    const item = props.list[index];
    if (!item.selected && isMaxSelected()) {
        // 特例，最大选择数为1时, 自动切换当前选择项
        if (props.maxSelectedNum === 1) {
            props.list.forEach(i => i.selected = false);
            item.selected = true;
            return;
        }
        console.log('max Selected');
        return;
    }
    const { hasContradict, contradictId } = checkIsContradicted(item.id);
    if (!item.selected && hasContradict) {
        console.log('contradicted', contradictId, item.id);
        return;
    }
    item.selected = !item.selected;
}
</script>

<style lang="scss" scoped>
    .talent-list{
        padding: 0 20px 30px;
        margin: 0 auto;
        .item{
            text-align: left;
            text-indent: 1em;
            padding: 4px 10px;
            margin-bottom: 5px;
            border: 2px solid #c5c5c5;
            border-radius: 4px;
            font-size: 20px;
            user-select: none;
            @include styles('color', "talent");
            cursor: pointer;
            position: relative;
            &:last-child{
                margin-bottom: 0;
            }
            &.selected{
                box-shadow: #ccc 0 0 10px;
                @include styles('color', "talent-active");
                overflow: hidden;
                @keyframes blink {
                    0% {
                        opacity: 0;
                        transform: translateX(-150%);
                    }
                    50% {
                        opacity: .2;
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(150%);
                    }
                }
                &::after{
                    content: '';
                    position: absolute;
                    background-color: #000;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 0 10px #000;
                    opacity: 0;
                    animation: blink 3s linear infinite;
                }
            }
            &.level-0{
                @include styles('background-color', "level-0");
                &.selected{
                   @include styles('background-color', "active-level-0");
                }
            }
            &.level-1{
                @include styles('background-color', "level-1");
                &.selected{
                   @include styles('background-color', "active-level-1");
                }
            }
            &.level-2{
                @include styles('background-color', "level-2");
                &.selected{
                   @include styles('background-color', "active-level-2");
                }
            }
            &.level-3{
                @include styles('background-color', "level-3");
                &.selected{
                   @include styles('background-color', "active-level-3");
                }
            }
        }
    }
</style>