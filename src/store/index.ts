import { createStore, useStore as baseUseStore, Store, CommitOptions, DispatchOptions, WithTypeCommit, WithTypeDispatch } from 'vuex';
import { GetActionsType, GetMutationsType, GetPayLoad, GetReturnType } from 'vuex-typescript-commit-dispatch-prompt';
import { InjectionKey } from 'vue';
import mutations from './mutations';
import actions from './actions';
import { modules } from './modules';
import { State, state } from './state';

export const key: InjectionKey<Store<State>> = Symbol('key');

export const store = createStore<State>({
    state,
    mutations,
    actions,
    modules
});

export const useStore = () => {
    return baseUseStore(key);
}

const vuexOptions = {
    mutations,
    actions,
    modules,
}

type Mutations = GetMutationsType<typeof vuexOptions>;
type Actions = GetActionsType<typeof vuexOptions>;
type Getters = GetGetterType<typeof vuexOptions>;

export const commit: WithTypeCommit<Mutations> = (type, payload?, options?) => {
    store.commit(type, payload, options);
}

export const dispatch: WithTypeDispatch<Actions> = (type, payload?, options?) => {
    // 利用函数联合实现函数的重载,参数校验,返回值已经通过重载推断完毕, 此处的any不影响
    return store.dispatch(type, payload, options) as any;
}

export const getters: WithTypeGetter<Getters> = (type) => {
    return store.getters[type];
}

declare module 'vuex' {
    export type WithTypeCommit<M> = UnionToIntersection<GetCommitFuncType<M, CommitOptions>>

    export type WithTypeDispatch<M> = UnionToIntersection<GetDispatchFuncType<M, DispatchOptions>>
}

export interface SubModuleActionContext<S, SubModule> {
    dispatch: WithTypeDispatch<GetActionsType<SubModule>>;
    commit: WithTypeCommit<GetMutationsType<SubModule>>;
    state: S;
    getters: any;
    rootState: State;
    rootGetters: any;
}


type GetGetterType<T> = UnionToIntersection<GetSubModuleGettersType<T> | GetGetterTypes<T>>

// 将联合类型转为交叉类型, 可以实现无返回值函数的重载定义.
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;

type GetSubModuleGettersType<Modules> = Modules extends { modules: infer SubModules } ? GetModulesGetters<SubModules> : never;

type GetModulesGetters<Modules> = {
    [Key in keyof Modules]: GetGetterTypes<Modules[Key], Key>;
}[keyof Modules]

type GetGetterTypes<Module, ModuleName = ''> = Module extends { getters: infer M } ? {
    [GetterKey in keyof M as AddPrefix<GetterKey, ModuleName>]: ReturnType<M[GetterKey]>;
}: never;

type AddPrefix<Keys, Prefix = ''> = `${Prefix & string}${Prefix extends '' ? '' : '/'}${Keys & string}`;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

interface WithTypeGetter<G> {
    <T extends keyof G>(type:T): G[T]
}


type GetCommitFuncType<M, O> = {
    [Key in keyof M]: M[Key] extends () => any ? (type: Key, payload?: null, options?: O) => void : (type: Key, payload: GetPayload<M[Key]>, options?: O) => void
}[keyof M];

type GetDispatchFuncType<A, O> = {
    [Key in keyof A]: A[Key] extends () => any ? (type: Key, payload?: null, options?: O) => GetReturnType<A, Key> : (type: Key, payload: GetPayload<A[Key]>, options?: O) => GetReturnType<A, Key>
}[keyof A];

type GetPayload<T> = T extends (payload: infer P) => any ? P : never;
