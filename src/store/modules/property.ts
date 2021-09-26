import { RootStore, getters } from '@store';
import { CreateStoreItem, GetGetterContext, GetState } from 'vuex-typed-helper';
import { life } from '@remake';

type TProperty = {
    CHR: number, // 颜值 charm CHR
    INT: number, // 智力 intelligence INT
    STR: number, // 体质 strength STR
    MNY: number, // 家境 money MNY
}

interface State {
    property: TProperty,
    lastGameProperty: TProperty,
    lastGamePoint: number,
}

interface Mutations {
    setPropertyItem<T extends keyof TProperty>(state: GetState<StoreItem>, { key, value }: {key: T, value: number}): void,
    resetProperty(state: GetState<StoreItem>): void,
    recoveryLastGameProperty(state: GetState<StoreItem>): void
}

interface Actions {};

interface Getters {
    allPointNum(...args: GetGetterContext<StoreItem, RootStore>): number,
    canUsePointNum(...args: GetGetterContext<StoreItem, RootStore>): number,
}

export type StoreItem = CreateStoreItem<State, Mutations, Actions, Getters>;

const state: State = {
    property: {
        CHR: 0,
        STR: 0,
        INT: 0,
        MNY: 0,
    },
    lastGamePoint: 0,
    lastGameProperty: {
        CHR: 0,
        STR: 0,
        INT: 0,
        MNY: 0,
    }
}

const mutations: Mutations = {
    setPropertyItem(state, { key, value }) {
        state.property[key] = value;
    },
    resetProperty() {
        state.lastGameProperty.CHR = state.property.CHR;
        state.lastGameProperty.STR = state.property.STR;
        state.lastGameProperty.INT = state.property.INT;
        state.lastGameProperty.MNY = state.property.MNY;

        state.lastGamePoint = getters('property/allPointNum');

        state.property.CHR = 0;
        state.property.STR = 0;
        state.property.INT = 0;
        state.property.MNY = 0;
    },
    recoveryLastGameProperty(state) {
        state.property.CHR = state.lastGameProperty.CHR;
        state.property.STR = state.lastGameProperty.STR;
        state.property.INT = state.lastGameProperty.INT;
        state.property.MNY = state.lastGameProperty.MNY;
    }
}

const selfGetter: Getters = {
    allPointNum(state, selfGetters, rootState, rootGetters) {
        const initPonit = rootState?.talent.isSuperLife ? 30 : 20;
        return initPonit + life.getTalentAllocationAddition(getters('talent/selectedTalentIds'));
    },
    canUsePointNum(state, getters) {
        const allPointNum: number = getters.allPointNum;
        const usedPoints = ['CHR', 'STR', 'INT', 'MNY'].reduce((i, j) => {
            return i + state.property[j];
        }, 0);
        return allPointNum - usedPoints;
    }
}

export const property = {
    namespaced: true,
    state,
    mutations,
    getters: selfGetter,
    actions: {
    }
}