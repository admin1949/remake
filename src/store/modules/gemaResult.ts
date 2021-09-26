import { RootStore } from '@store';
import { GetState, GetGetterContext, CreateStoreItem } from 'vuex-typed-helper';
import { summary, Life } from '@remake';

const extendTalentKey = 'extendTalent'

interface State {
    isEnd: boolean,
    lastGameSavedTalent: number,
    allRecord: ReturnType<Life['getRecord']>,
}

interface Mutations {
    setIsEnd(ctx: GetState<StoreItem>, isEnd: boolean): void
    setLastGameSavedTalent(ctx: GetState<StoreItem>, talentId: number): void
    setGamgeResultRecord(ctx: GetState<StoreItem>, allRecord: State['allRecord']): void
}

interface Actions {
    
}

interface SummaryItem {
    judge: string;
    grade: number;
    value: number;
}

interface Getters {
    hasResult(...args: GetGetterContext<StoreItem, RootStore>): boolean;
    summary(...args: GetGetterContext<StoreItem, RootStore>): {
        CHR: SummaryItem,
        MNY: SummaryItem,
        SPR: SummaryItem,
        AGE: SummaryItem,
        INT: SummaryItem,
        STR: SummaryItem,
        SUM: SummaryItem,
    }
}

export type StoreItem = CreateStoreItem<State, Mutations, Actions, Getters>


const state: State = {
    isEnd: false,
    lastGameSavedTalent: JSON.parse(localStorage.getItem(extendTalentKey) || '0'),
    allRecord: [],
}

const mutations: Mutations = {
    setIsEnd(state, isEnd) {
        state.isEnd = isEnd
    },
    setLastGameSavedTalent(state, talentId) {
        state.lastGameSavedTalent = talentId;
        localStorage.setItem(extendTalentKey, JSON.stringify(talentId));
    },
    setGamgeResultRecord(state, allRecord) {
        state.allRecord = allRecord;
    }
}

const getters: Getters = {
    hasResult(state, getters, rootState, rootGetters) {
        return state.isEnd && state.allRecord.length > 0;
    },
    summary(state, getters, rootState, rootGetters) {
        const max = (type: "CHR" | "MNY" | "SPR" | "INT" | "STR" | "AGE" ) => {
            return Math.max.apply(Math, state.allRecord.map(i => i[type]));
        }
        const getSummaryItem = (type: "CHR" | "MNY" | "SPR" | "INT" | "STR" | "AGE") => {
            const value = max(type);
            const { judge, grade } = summary(type, value);
            return { judge, grade, value };
        }

        const getSumSumarry = () => {
            const value = Math.floor((max('CHR') + max('INT') + max('STR') + max('MNY') + max('SPR'))*2 + max('AGE') /2)
            const { judge, grade } = summary('SUM', value);
            return { judge, grade, value };
        }

        return {
            CHR: getSummaryItem('CHR'),
            MNY: getSummaryItem('MNY'),
            SPR: getSummaryItem('SPR'),
            AGE: getSummaryItem('AGE'),
            INT: getSummaryItem('INT'),
            STR: getSummaryItem('STR'),
            SUM: getSumSumarry(),
        }
    }
}

const actions: Actions = {

}

export const gameResult = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}

