import { RootStore } from '@store';
import { GetState } from 'vuex-typed-helper';

export interface Mutations {
    test(ctx: GetState<RootStore>): void
}

export const mutations: Mutations = {
    test(state) {
    },
}
