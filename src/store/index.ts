import { createStore, useStore as baseUseStore, Store, CommitOptions, DispatchOptions } from 'vuex';
import { CreateStoreItem, TypedDispatch, TypedCommit, GetGlobalGetterFn, GetState } from 'vuex-typed-helper';
import { InjectionKey } from 'vue';
import { mutations, Mutations } from './mutations';
import { actions, Actions } from './actions';
import { modules, Modules } from './modules';
import { state, State } from './state';

export type RootStore = CreateStoreItem<State, Mutations, Actions, {}, Modules>;
type RootState = GetState<RootStore>;

export const key: InjectionKey<Store<RootState>> = Symbol('key');

export const store = createStore({
    state: state as RootState,
    mutations: mutations as any,
    actions: actions as any,
    modules: modules as any,
});

export const useStore = () => {
    return baseUseStore(key);
}

export const commit: TypedCommit<RootStore> = (type, payload?, options?: CommitOptions) => {
    store.commit(type, payload, options);
}

export const dispatch: TypedDispatch<RootStore> = (type, payload?, options?: DispatchOptions) => {
    return store.dispatch(type, payload, options);
}

export const getters: GetGlobalGetterFn<RootStore> = (type) => {
    return store.getters[type];
}
