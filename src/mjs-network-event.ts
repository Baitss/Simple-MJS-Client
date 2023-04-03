import { EventEmitter } from "events";
import { LoginRequestData, LoginResponseData } from "./mjs-type";

interface MahjongSoulNetworkEvent {
    loginRequested: [requestData: LoginRequestData];
    loginResponded: [responseData: LoginResponseData];
}

type MahjongSoulNetworkEventName = keyof MahjongSoulNetworkEvent;

type AnyListener = (...args: any) => void;
class MahjongSoulNetworkEventEmitter extends EventEmitter {
    private static readonly singleton = new MahjongSoulNetworkEventEmitter();

    public static get instance() {
        return this.singleton;
    }

    private constructor() {
        super();
    }

    public typedOn(
        eventName: MahjongSoulNetworkEventName,
        listener: (...args: MahjongSoulNetworkEvent[MahjongSoulNetworkEventName]) => void
    ) {
        return super.on(eventName, listener as AnyListener);
    }

    public typedOnce(
        eventName: MahjongSoulNetworkEventName,
        listener: (...args: MahjongSoulNetworkEvent[MahjongSoulNetworkEventName]) => void
    ) {
        return super.once(eventName, listener as AnyListener);
    }

    public typedOff(
        eventName: MahjongSoulNetworkEventName,
        listener: (...args: MahjongSoulNetworkEvent[MahjongSoulNetworkEventName]) => void
    ) {
        return super.off(eventName, listener as AnyListener);
    }

    public typedEmit(
        eventName: MahjongSoulNetworkEventName,
        ...args: MahjongSoulNetworkEvent[MahjongSoulNetworkEventName]
    ) {
        return super.emit(eventName, args);
    }
}

const applyMahjongSoulNetworkEventHandlers = () => {
    const emitter = MahjongSoulNetworkEventEmitter.instance;

    emitter.typedOn("loginRequested", (res) => {
        console.log("REQUEST LOGIN");
        console.log(res);
    });

    emitter.typedOn("loginResponded", (res) => {
        console.log("LOGIN RESULT RESPONDED");
        console.log(res);
    });
};

export {
    MahjongSoulNetworkEvent,
    MahjongSoulNetworkEventEmitter,
    MahjongSoulNetworkEventName,
    applyMahjongSoulNetworkEventHandlers
};
