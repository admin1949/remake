import { ref, watch, Ref, ComputedRef, computed } from 'vue';
import { gsap } from 'gsap';
(window['gsap'] as any) = gsap;

const fixNumber = (val: number, fix = 2) => {
    return Number(Number.prototype.toFixed.call(val, fix));
}

export const useNumberTransition = (val: Ref<number> | ComputedRef<number>, fix = 2) => {
    const showValue = ref(0);

    const update = (target: Ref<number>, newValue: number) => {
        gsap.to(target, {
            duration: .5,
            value: newValue
        });
    }
    update(showValue, val.value);
    watch(val, (newValue) => {
        update(showValue, newValue);
    });

    const res = computed(() => fixNumber(showValue.value, fix))
    return res;
}

type GetGroupReturnType<T> = {
    [key in keyof T]: ComputedRef<number>
}

export const useNumberTransitionGroup = <T extends {[key: string]: Ref<number> | ComputedRef<number>}>(val: T, fix = 2) => {

    const res = {} as GetGroupReturnType<T>;

    for (const key in val) {
        (res[key] as ComputedRef<number>) = useNumberTransition(val[key], fix);
    }

    return computed(() => res);
}