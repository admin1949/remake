import { GetActionContext } from 'vuex-typed-helper';
import { RootStore } from '@store';

export interface Actions {
    asyncTest(ctx: GetActionContext<RootStore>, payload: number): void
}

export const actions: Actions = {
    asyncTest({ state , getters, commit }, payload) {
    }
}
