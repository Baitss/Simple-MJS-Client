import { EventEmitter } from "events";
import {
    GamePlayerType, MatchMode, playerTypeMap, RoomType, roomTypeMap
} from "./type/match";
import { setActivity } from "./discord";
import { getDiscordClient } from "./main";

interface MahjongSoulMatchEvent {
    gameStarted: [roomType: RoomType, plyerType: GamePlayerType, mode?: MatchMode];
    roundStarted: [];
    gameFinished: [];
}

type MahjongSoulMatchEventName = keyof MahjongSoulMatchEvent;

type AnyListener = (...args: any) => void;

class MahjongSoulMatchEventEmitter extends EventEmitter {
    private static readonly singleton = new MahjongSoulMatchEventEmitter();

    private constructor() {
        super();
    }

    public static get instance() {
        return this.singleton;
    }

    public typedOn<K extends MahjongSoulMatchEventName>(
        eventName: K,
        listener: (...args: MahjongSoulMatchEvent[K]) => void
    ) {
        return super.on(eventName, listener as AnyListener);
    }

    public typedOnce<K extends MahjongSoulMatchEventName>(
        eventName: K,
        listener: (...args: MahjongSoulMatchEvent[K]) => void
    ) {
        return super.once(eventName, listener as AnyListener);
    }

    public typedOff<K extends MahjongSoulMatchEventName>(
        eventName: K,
        listener: (...args: MahjongSoulMatchEvent[K]) => void
    ) {
        return super.off(eventName, listener as AnyListener);
    }

    public typedEmit<K extends MahjongSoulMatchEventName>(
        eventName: K,
        ...args: MahjongSoulMatchEvent[K]
    ) {
        return super.emit(eventName, ...args);
    }
}

const applyMahjongSoulMatchEventHandlers = () => {
    const emitter = MahjongSoulMatchEventEmitter.instance;

    emitter.typedOn("gameStarted", async (roomType, playerType, matchMode) => {
        const playerTypeStr = playerTypeMap[playerType];
        const roomTypeStr = roomTypeMap[roomType];
        await setActivity(getDiscordClient(), {
            startTimestamp: new Date(),
            state: playerTypeStr,
            details: roomTypeStr,
            largeImageKey: "logo"
        });
    });

    emitter.typedOn("gameFinished", async () => {
        await setActivity(getDiscordClient());
    });
};

export {
    applyMahjongSoulMatchEventHandlers,
    MahjongSoulMatchEventEmitter,
    MahjongSoulMatchEventName,
    MahjongSoulMatchEvent
};
