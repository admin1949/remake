import { RootStore } from '@store';
import { Life } from '@remake';
import { CreateStoreItem, GetGetterContext, GetState } from 'vuex-typed-helper';

interface State {
    selectedTalents: ReturnType<Life['getAllTalent']>;
    isSuperLife: boolean;
}
interface Mutations {
    setSelectedTalents(state: GetState<StoreItem>, selectedTalents: State['selectedTalents']): void;
    setIsSuperLife(state: GetState<StoreItem>, isSuperLife: boolean): void;
}

interface Getters {
    selectedTalentIds(...args: GetGetterContext<StoreItem, RootStore>): number[];
}

export type StoreItem = CreateStoreItem<State, Mutations, {}, Getters>;

const state: State = {
    selectedTalents: [],
    isSuperLife: false,
}

const mutations: Mutations = {
    setSelectedTalents(state, selectedTalents) {
        state.selectedTalents = selectedTalents;
    },
    setIsSuperLife(state, isSuperLife) {
        state.isSuperLife = isSuperLife;
    },
}

const getters: Getters = {
    selectedTalentIds(state) {
        return state.selectedTalents.map(i => i.id);
    }
}

export const talent = {
    namespaced: true,
    state,
    mutations: mutations,
    getters,
    actions: {
    }
}