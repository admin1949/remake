import { createVNode, render, isVNode, ComponentPublicInstance, Component, VNode } from 'vue';

export type MessageProps = {
    center?: boolean,
    duration?: number,
    message?: string | Component,
    type?: MessageType,
    showClose?: boolean,
    offset?: number,
    id?: string,
    onClose?: () => void,
}

import MessageConstructor from './index.vue';

type MessageType = 'info' | 'error' | 'warning' | 'success';
type MessageParams = MessageProps | string;
type IMessageHandle = {
    close: () => void,
}
type TypedMessageParams<T extends MessageType> = 
    | ({ type: T } & Omit<MessageProps, 'type'>)
    | string;

interface IMessage {
    (options: MessageParams): IMessageHandle,
    success: (options: TypedMessageParams<'success'>) => IMessageHandle,
    info: (options: TypedMessageParams<'info'>) => IMessageHandle,
    warning: (options: TypedMessageParams<'warning'>) => IMessageHandle,
    error: (options: TypedMessageParams<'error'>) => IMessageHandle,
}

type MessageVm = VNode;

const instances: MessageVm[] = [];

let seed = 1;

const MAX_MSG_INSTANCE_NUM = 1;
const closeList: { close: () => void }[] = [];

const Message: IMessage = function (
    opt: MessageParams = '',
) {
    if (!opt) {
        return;
    }
    const renderOptions = typeof opt === 'string' ? { message: opt } : opt;

    let verticalOffset = instances.reduce((offset, vm) => {
        return offset + (vm.el?.offsetHeight || 0) + 16;
    }, renderOptions.offset || 20);
    verticalOffset += 16;

    const id = `message_${seed++}`;
    const userClose = renderOptions.onClose;

    const options: MessageProps = {
        ...renderOptions,
        showClose: true,
        offset: verticalOffset,
        type: 'info',
        id: id,
        onClose: () => {
            close(id, userClose);
        },
    }

    const container = document.createElement('div');
    container.className = `container_${id}`;

    const vm = createVNode(
        MessageConstructor,
        options,
        isVNode(options.message) ? { default: () => options.message } : null,
    );

    vm.props!.onDestory = () => {
        render(null, container);
    }

    render(vm, container);
    instances.push(vm);
    if (instances.length > MAX_MSG_INSTANCE_NUM) {
        closeList[0]?.close();
    }
    document.body.appendChild(container.firstElementChild!);
    const closeItem = {
        close() {
            (
                vm.component?.proxy as ComponentPublicInstance<{ visible: boolean }>
            ).visible = false;
        }
    }
    closeList.push(closeItem);
    return closeItem
} as any;

;(['error', 'info', 'success', 'warning'] as const).forEach(type => {
    Message[type] = (options) => {
        if (typeof options === 'string') {
            options = {
                message: options,
                type: type as any,
            }
        } else {
            options.type = type;
        }
        return Message(options);
    }
})

const close = (id: string, userClose?:(id: string) => void) => {
    const idx = instances.findIndex(vm => {
        const { id: _id } = vm.component?.props!;
        return id === _id;
    });
    if (idx === -1) {
        return;
    }

    const vm = instances[idx];
    if (!vm) {
        return;
    }
    userClose?.(id);

    const removedHeight = vm.el?.offsetHeight || 0;
    instances.splice(idx, 1);
    closeList.splice(idx, 1);

    instances.forEach((vm, index) => {
        if (idx > index) {
            return
        }
        const pos = parseInt(vm?.el?.style['top'], 10) - removedHeight - 16;
        (
            vm.component?.props as { offset: number }
        ).offset = pos;
    });
}

export default Message;