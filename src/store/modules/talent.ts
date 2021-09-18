import { commit, dispatch, SubModuleActionContext } from '@store';
import { Life } from '@remake';

export interface State {
    selectedTalents: ReturnType<Life['getAllTalent']>,
    isSuperLife: boolean,
}

export const state: State = {
    selectedTalents: [],
    isSuperLife: false,
}

type ActionContext = SubModuleActionContext<State, typeof talent>;

export const talent = {
    namespaced: true,
    state,
    mutations: {
        setSelectedTalents(state: State, selectedTalents: State['selectedTalents']) {
            state.selectedTalents = selectedTalents;
        },
        setIsSuperLife(state: State, isSuperLife: boolean) {
            state.isSuperLife = isSuperLife;
        }
    },
    getters: {
        selectedTalentIds(state: State) {
            return state.selectedTalents.map(i => i.id);
        }
    },
    actions: {
    }
}