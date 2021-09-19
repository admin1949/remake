import { commit, dispatch, SubModuleActionContext } from '@store';
import { loadSource as load } from '@remake';
export interface State {
    loadSouceStatus: 'PENGING' | 'RESOLVED' | 'REJECTED',
    progress: {
        age: number,
        event: number,
        talent: number,
    }
}

export const state: State = {
    loadSouceStatus: 'PENGING',
    progress: {
        age: 0,
        event: 0,
        talent: 0,
    },
}

type ActionContext = SubModuleActionContext<State, typeof loadSource>

interface SourcePath {
    ageJson: string,
    eventJson: string,
    talentJson: string,
}

export const loadSource = {
    namespaced: true,
    state,
    mutations: {
        setLoadProgress(state: State, progress: State['progress']) {
            state.progress.age = progress.age;
            state.progress.event = progress.event;
            state.progress.talent = progress.talent;
        },
        setLoadSouceStatus(state: State, status: State['loadSouceStatus']) {
            state.loadSouceStatus = status;
        }
    },
    actions: {
        async setSourcePath(context: ActionContext, payload: SourcePath) {
            context.commit('setLoadSouceStatus', 'PENGING');
            const base = process.env.NODE_ENV === 'development' ? '' : '/remake';
            const data = await load({
                ageJson: base + payload.ageJson,
                eventJson: base + payload.eventJson,
                talentJson: base + payload.talentJson,
            }, (event) => {
                context.commit('setLoadProgress', event);
            });
            context.commit('setLoadSouceStatus', 'RESOLVED');
            return {
                age: data[0].data,
                event: data[1].data,
                talent: data[2].data,
            };
        }
    }
}