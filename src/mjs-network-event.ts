import { EventEmitter } from "events";
import {
    LoginRequestData,
    LoginResponseData,
    ParsedWebsocketInbound,
    ParsedWebsocketRequest,
    ParsedWebsocketResponse
} from "./type/network";
import {
    ActionChiPengGang,
    ActionDealTile,
    ActionDiscardTile,
    ActionHule,
    ActionPrototype,
    NotifyAccountUpdate,
    NotifyGameEndResult,
    NotifyGameFinishRewardV2,
    NotifyMatchGameStart,
    ReqBroadcastInGame,
    ReqChiPengGang,
    ReqSelfOperation,
    ReqStartUnifiedMatch,
    ResAuthGame,
    ResCharacterInfo,
    ResCurrentMatchInfo,
    ResEnterGame,
    ResFriendList,
    ResGamePlayerState,
    ResLogin
} from "./type/parsed";
import { MahjongSoulMatchEventEmitter } from "./mjs-match-event";
import { RoomType } from "./type/match";

interface MahjongSoulNetworkEvent {
    loginRequested: [requestData: LoginRequestData];
    loginResponded: [responseData: LoginResponseData];
    wsRequested: [requestData: ParsedWebsocketRequest<object>];
    wsResponded: [responseData: ParsedWebsocketResponse<object>];
    wsInbound: [inboundData: ParsedWebsocketInbound<object>];
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
    const networkEmitter = MahjongSoulNetworkEventEmitter.instance;
    const matchEmitter = MahjongSoulMatchEventEmitter.instance;

    networkEmitter.typedOn("loginRequested", (requestData: LoginRequestData) => {
    });

    networkEmitter.typedOn("loginResponded", (responseData: LoginResponseData) => {
    });

    networkEmitter.typedOn("wsRequested", (requestData: ParsedWebsocketRequest<object>) => {
        networkEmitter.addWsQueue(requestData);
    });

    networkEmitter.typedOn("wsResponded", (responseData: ParsedWebsocketResponse<object>) => {
        // this contains user profile data (ex: nickname)
        if (responseData.request.requestMethod == "Lobby.oauth2Login") {
            const data = responseData.responseData as ResLogin;
        }

        // this contains user friend list
        if (responseData.request.requestMethod == "Lobby.fetchFriendList") {
            const data = responseData.responseData as ResFriendList;
        }

        // this contains user character list
        if (responseData.request.requestMethod == "Lobby.fetchCharacterInfo") {
            const data = responseData.responseData as ResCharacterInfo;
        }

        if (responseData.request.requestMethod == "Lobby.matchGame") {
            const data = responseData.request.requestData;
        }

        // this means user start to matching
        if (responseData.request.requestMethod == "Lobby.startUnifiedMatch") {
            const data = responseData.request.requestData as ReqStartUnifiedMatch;
        }

        // this contains number of current connected users
        if (responseData.request.requestMethod == "Lobby.fetchCurrentMatchInfo") {
            const data = responseData.responseData as ResCurrentMatchInfo;
        }

        // this contains current match data
        if (responseData.request.requestMethod == "FastTest.authGame") {
            const data = responseData.responseData as ResAuthGame;

            const playerTypeId = data.gameConfig.mode.mode;
            const matchType = data.gameConfig.meta.modeId;

            if (data.gameConfig.meta.contestUid) {
                // contest mode
                matchEmitter.typedEmit("gameStarted", RoomType.CONTEST, playerTypeId);
            } else if (data.gameConfig.meta.modeId) {
                // matching mode
                matchEmitter.typedEmit("gameStarted", RoomType.MATCH, playerTypeId, matchType);
            } else if (data.gameConfig.meta.roomId) {
                // custom game
                matchEmitter.typedEmit("gameStarted", RoomType.CUSTOM, playerTypeId);
            } else {
                matchEmitter.typedEmit("gameStarted", RoomType.OTHERS, playerTypeId);
            }

            // matchEmitter.typedEmit("gameStarted");
        }

        // this contains user ready state
        if (responseData.request.requestMethod == "FastTest.fetchGamePlayerState") {
            const data = responseData.responseData as ResGamePlayerState;
        }

        // this means user joined match
        if (responseData.request.requestMethod == "FastTest.enterGame") {
            const data = responseData.responseData as ResEnterGame;
        }

        // this means user did operation (throw away card)
        if (responseData.request.requestMethod == "FastTest.inputOperation") {
            const data = responseData.request.requestData as ReqSelfOperation;
        }

        // this means user did chi or pend or gang (or cancel it)
        if (responseData.request.requestMethod == "FastTest.inputChiPengGang") {
            const data = responseData.request.requestData as ReqChiPengGang;
        }

        // this means new round start
        if (responseData.request.requestMethod == "FastTest.confirmNewRound") {
            matchEmitter.typedEmit("roundStarted");
        }

        // this means user use emote
        if (responseData.request.requestMethod == "FastTest.broadcastInGame") {
            const data = responseData.request.requestData as ReqBroadcastInGame;
        }
        /*
        console.log({
            ...responseData,
            rawResponseBody: formatHex(responseData.rawResponseBody),
            rawData: formatHex(responseData.rawData),
            request: {
                ...responseData.request,
                rawRequestBody: formatHex(responseData.request.rawRequestBody),
                rawData: formatHex(responseData.request.rawData),
                hexRequestMethod: formatHex(responseData.request.hexRequestMethod)
            }
        }); */
    });

    networkEmitter.typedOn("wsInbound", (inboundData: ParsedWebsocketInbound<object>) => {
        // this means match created
        if (inboundData.path == "NotifyMatchGameStart") {
            const data = inboundData.responseData as NotifyMatchGameStart;
        }

        // this means did something match action
        if (inboundData.path == "ActionPrototype") {
            const data = inboundData.responseData as ActionPrototype;

            // this means round started
            if (data.name == "ActionMJStart") {
            }

            if (data.name == "ActionDiscardTile") {
                // TODO: IMPLEMENT PARSE data.data;
            }

            if (data.name == "ActionDealTile") {
                // TODO: IMPLEMENT PARSE data.data;
            }

            if (data.name == "ActionChiPengGang") {
                // TODO: IMPLEMENT PARSE data.data;
            }

            if (data.name == "ActionHule") {
                // TODO: IMPLEMENT PARSE data.data;
            }
        }

        // this means game end
        if (inboundData.path == "NotifyGameEndResult") {
            const data = inboundData.responseData as NotifyGameEndResult;
            matchEmitter.typedEmit("gameFinished");
        }

        if (inboundData.path == "NotifyAccountUpdate") {
            const data = inboundData.responseData as NotifyAccountUpdate;
        }

        if (inboundData.path == "NotifyGameFinishRewardV2") {
            const data = inboundData.responseData as NotifyGameFinishRewardV2;
        }

        if (inboundData.path == "NotifyGameTerminate") {
            matchEmitter.typedEmit("gameFinished");
        }

        /*
        console.log({
            ...inboundData,
            rawData: formatHex(inboundData.rawData),
            rawResponseBody: formatHex(inboundData.rawResponseBody),
            hexPath: formatHex(inboundData.hexPath)
        }); */
    });
};

export {
    MahjongSoulNetworkEvent,
    MahjongSoulNetworkEventEmitter,
    MahjongSoulNetworkEventName,
    applyMahjongSoulNetworkEventHandlers
};
