import { loadSource, state as loadSouceState } from './loadSource';
import { talent, state as talentState } from './talent';
import { property, state as PropertyState } from './property';
import { gameResult, state as gameResultState } from './gemaResult';

export const modules = {
    loadSource,
    talent,
    property,
    gameResult,
}

export const modulesState = {
    loadSource: loadSouceState,
    talent: talentState,
    property: PropertyState,
    gameResult: gameResultState,
}