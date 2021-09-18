import { commit, dispatch, SubModuleActionContext,  } from '@store';
import { summary, TYPES, Life } from '@remake';

const extendTalentKey = 'extendTalent'

export interface State {
    isEnd: boolean,
    lastGameSavedTalent: number,
    allRecord: ReturnType<Life['getRecord']>,
}

export const state: State = {
    isEnd: false,
    lastGameSavedTalent: JSON.parse(localStorage.getItem(extendTalentKey) || '0'),
    allRecord: [],
}

type ActionContext = SubModuleActionContext<State, typeof gameResult>;

export const gameResult = {
    namespaced: true,
    state,
    mutations: {
        setIsEnd(state: State, isEnd: boolean) {
            state.isEnd = isEnd
        },
        setLastGameSavedTalent(state: State, talentId: number) {
            state.lastGameSavedTalent = talentId;
            localStorage.setItem(extendTalentKey, JSON.stringify(talentId));
        },
        setGamgeResultRecord(state: State, allRecord: State['allRecord']) {
            state.allRecord = allRecord;
        }
    },
    getters: {
        hasResult(state: State, getters:any, rootState: any, rootGetters: any) {
            return state.isEnd && state.allRecord.length > 0;
        },
        summary(state: State, getters:any, rootState: any, rootGetters: any) {
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
        },
    },
    actions: {
    }
}

