import { loadSource,  StoreItem as LoadSourceStore } from './loadSource';
import { talent, StoreItem as TalentStore } from './talent';
import { property, StoreItem as PropertyStore } from './property';
import { gameResult, StoreItem as GameResultStore } from './gemaResult';

export const modules = {
    loadSource,
    talent,
    property,
    gameResult,
}

export interface Modules {
    loadSource: LoadSourceStore,
    talent: TalentStore,
    property: PropertyStore,
    gameResult: GameResultStore,
}