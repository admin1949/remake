import { modulesState } from './modules';

type TopState = {
    
}

const topState: TopState = {

}

const gloablState = Object.assign({}, topState, modulesState)

export const state = (() => topState) as () => State;

export type State = typeof gloablState;
