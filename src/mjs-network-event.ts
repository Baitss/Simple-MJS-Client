import { EventEmitter } from "events";
import {
    LoginRequestData, LoginResponseData, ParsedWebsocketRequest, WebsocketResponse
} from "./type/network";
import { decodeMessage } from "./protobuff";
import { hexToBase64 } from "./util/str-encode";

interface MahjongSoulNetworkEvent {
    loginRequested: [requestData: LoginRequestData];
    loginResponded: [responseData: LoginResponseData];
    wsRequested: [requestData: ParsedWebsocketRequest<object>];
    wsResponded: [responseData: WebsocketResponse];
}

type MahjongSoulNetworkEventName = keyof MahjongSoulNetworkEvent;

type AnyListener = (...args: any) => void;
class MahjongSoulNetworkEventEmitter extends EventEmitter {
    private static readonly singleton = new MahjongSoulNetworkEventEmitter();

    private readonly wsRequestQueue: Map<string, ParsedWebsocketRequest<object>> = new Map();

    public static get instance() {
        return this.singleton;
    }

    private constructor() {
        super();
    }

    public typedOn<K extends MahjongSoulNetworkEventName>(
        eventName: K,
        listener: (...args: MahjongSoulNetworkEvent[K]) => void
    ) {
        return super.on(eventName, listener as AnyListener);
    }

    public typedOnce<K extends MahjongSoulNetworkEventName>(
        eventName: K,
        listener: (...args: MahjongSoulNetworkEvent[K]) => void
    ) {
        return super.once(eventName, listener as AnyListener);
    }

    public typedOff<K extends MahjongSoulNetworkEventName>(
        eventName: K,
        listener: (...args: MahjongSoulNetworkEvent[K]) => void
    ) {
        return super.off(eventName, listener as AnyListener);
    }

    public typedEmit<K extends MahjongSoulNetworkEventName>(
        eventName: K,
        ...args: MahjongSoulNetworkEvent[K]
    ) {
        return super.emit(eventName, ...args);
    }

    public addWsQueue(request: ParsedWebsocketRequest<object>) {
        this.wsRequestQueue.set(request.requestId, request);
    }

    public getWsQueue(requestId: string) {
        return this.wsRequestQueue.get(requestId);
    }

    public removeWsQueue(requestId: string) {
        this.wsRequestQueue.delete(requestId);
    }
}

const applyMahjongSoulNetworkEventHandlers = () => {
    const emitter = MahjongSoulNetworkEventEmitter.instance;

    emitter.typedOn("loginRequested", (requestData: LoginRequestData) => {
        console.log("Request Login");
        console.log(requestData);
    });

    emitter.typedOn("loginResponded", (responseData: LoginResponseData) => {
        console.log("Login Result Responded");
        console.log(responseData);
    });

    emitter.typedOn("wsRequested", (requestData: ParsedWebsocketRequest<object>) => {
        emitter.addWsQueue(requestData);
    });

    emitter.typedOn("wsResponded", (responseData: WebsocketResponse) => {
        const request = emitter.getWsQueue(responseData.requestId);

        try {
            const parsed = decodeMessage(request.responseType, hexToBase64(responseData.rawResponseBody));
            console.log(parsed);
        } catch (e) {
            console.error(e);
            console.error(`Base64 Body: ${responseData.rawData}`);
        }
        emitter.removeWsQueue(request.requestId);
    });
};

export {
    MahjongSoulNetworkEvent,
    MahjongSoulNetworkEventEmitter,
    MahjongSoulNetworkEventName,
    applyMahjongSoulNetworkEventHandlers
};
