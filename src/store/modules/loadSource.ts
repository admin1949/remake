import { RootStore } from '@store';
import { CreateStoreItem, GetActionContext, GetState } from 'vuex-typed-helper';
import { loadSource as load } from '@remake';

interface State {
    loadSouceStatus: 'PENGING' | 'RESOLVED' | 'REJECTED',
    progress: {
        age: number,
        event: number,
        talent: number,
    }
}
interface Mutations {
    setLoadProgress(state: GetState<StoreItem>, progress: State['progress']): void,
    setLoadSouceStatus(state: GetState<StoreItem>, status: State['loadSouceStatus']): void
};

interface SourcePath {
    ageJson: string,
    eventJson: string,
    talentJson: string,
}

interface Actions {
    setSourcePath(context: GetActionContext<StoreItem, RootStore>, payload: SourcePath): Promise<{ age: any, event: any, talent: any}>
};

export type StoreItem = CreateStoreItem<State, Mutations, Actions>;


const state: State = {
    loadSouceStatus: 'PENGING',
    progress: {
        age: 0,
        event: 0,
        talent: 0,
    },
}

const mutations: Mutations = {
    setLoadProgress(state, progress) {
        state.progress.age = progress.age;
        state.progress.event = progress.event;
        state.progress.talent = progress.talent;
    },
    setLoadSouceStatus(state, status) {
        state.loadSouceStatus = status;
    }
}

const actions: Actions = {
    async setSourcePath({ commit, rootState }, payload) {
        commit('setLoadSouceStatus', 'PENGING');
        const base = process.env.NODE_ENV === 'development' ? '' : '/remake';
        const data = await load({
            ageJson: base + payload.ageJson,
            eventJson: base + payload.eventJson,
            talentJson: base + payload.talentJson,
        }, (event) => {
            commit('setLoadProgress', event);
        });
        commit('setLoadSouceStatus', 'RESOLVED');
        return {
            age: data[0].data,
            event: data[1].data,
            talent: data[2].data,
        };
    }
}

export const loadSource = {
    namespaced: true,
    state,
    mutations,
    actions,
}