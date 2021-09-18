import { checkCondition } from './utils';
import { Property } from './property';

interface TEvnet {
    [eventId: string]: {
        id: number,
        event: string,
        postEvent?: string,
        effect?: {
            AGE?: number,
            CHR?: number,
            INT?: number,
            STR?: number,
            MNY?: number,
            SPR?: number,
            LIF?: number,
        },
        NoRandom: 0 | 1,
        include?: string,
        exclude?: string,
        branch?: string[],
        _branch?: [string, number][]
    }
}

export class Event {
    protected events: TEvnet | null = null;
    initial(events: TEvnet) {
        this.events = events;
        for(const id in events) {
            const event = events[id];
            if (!event.branch) continue;
            event._branch = event.branch.map((branch): [string, number] => {
                const branchs = branch.split(":");
                return [branchs[0], Number(branchs[1])];
            });
            event.branch = undefined;
        }
    }
    count() {
        return Object.keys(this.events || {}).length;
    }
    check(eventId: string | number, property: Property) {
        const { include, exclude, NoRandom } = this.get(eventId + '');
        if (NoRandom) {
            return false;
        }
        if (exclude && checkCondition(property, exclude)) return false;
        if (include) return checkCondition(property, include);
        return true;
    }
    get(eventId: string | number) {
        eventId += '';
        if (!this.events || !Reflect.has(this.events, eventId)) {
            console.log(`[ERROR] No Event[${eventId}]`);
            throw new Error(`[ERROR] No Event[${eventId}]`);
        }
        return this.events[eventId];
    }
    information(eventId: string | number) {
        const { event: description } = this.get(eventId);
        return { description };
    }

    do(eventId: string | number, property: Property) {
        const { effect, _branch, event: description, postEvent } = this.get(eventId);
        if (_branch) {
            for (const [ cond, next ] of _branch) {
                if (checkCondition(property, cond)) {
                    return { effect, next, description };
                }
            }
        }

        return { effect, postEvent, description };
    }
}