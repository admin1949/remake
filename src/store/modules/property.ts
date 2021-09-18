import { commit, dispatch, SubModuleActionContext, getters } from '@store';
import { life } from '@remake';

type TProperty = {
    CHR: number, // 颜值 charm CHR
    INT: number, // 智力 intelligence INT
    STR: number, // 体质 strength STR
    MNY: number, // 家境 money MNY
}

export interface State {
    property: TProperty,
    lastGameProperty: TProperty,
    lastGamePoint: number,
}

export const state: State = {
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

type ActionContext = SubModuleActionContext<State, typeof property>;

export const property = {
    namespaced: true,
    state,
    mutations: {
        setPropertyItem<T extends keyof TProperty>(state: State, { key, value }: {key: T, value: number}) {
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
        recoveryLastGameProperty(state: State) {
            state.property.CHR = state.lastGameProperty.CHR;
            state.property.STR = state.lastGameProperty.STR;
            state.property.INT = state.lastGameProperty.INT;
            state.property.MNY = state.lastGameProperty.MNY;
        }
    },
    getters: {
        allPointNum(state: State, selfGetters:any, rootState: any, rootGetters: any): number {
            const initPonit = (rootState as ActionContext['rootState']).talent.isSuperLife ? 30 : 20;
            return initPonit + life.getTalentAllocationAddition(getters('talent/selectedTalentIds'));
        },
        canUsePointNum(state: State, getters:any) {
            const allPointNum: number = getters.allPointNum;
            const usedPoints = ['CHR', 'STR', 'INT', 'MNY'].reduce((i, j) => {
                return i + state.property[j];
            }, 0);
            return allPointNum - usedPoints;
        }

    },
    actions: {
    }
}