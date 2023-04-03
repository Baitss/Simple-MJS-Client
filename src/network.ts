import { BrowserWindow, Debugger } from "electron";
import { EventEmitter } from "events";
import { MahjongSoulNetworkEventEmitter } from "./mjs-network-event";
import { LoginRequestData, LoginResponseData } from "./mjs-type";

enum ChromeDevtoolEvents {
    dataReceived = "dataReceived",
    eventSourceMessageReceived = "eventSourceMessageReceived",
    loadingFailed = "loadingFailed",
    loadingFinished = "loadingFinished",
    requestServedFromCache = "requestServedFromCache",
    requestWillBeSent = "requestWillBeSent",
    responseReceived = "responseReceived",
    webSocketClosed = "webSocketClosed",
    webSocketCreated = "webSocketCreated",
    webSocketFrameError = "webSocketFrameError",
    webSocketFrameReceived = "webSocketFrameReceived",
    webSocketFrameSent = "webSocketFrameSent",
    webSocketHandshakeResponseReceived = "webSocketHandshakeResponseReceived",
    webSocketWillSendHandshakeRequest = "webSocketWillSendHandshakeRequest",
    webTransportClosed = "webTransportClosed",
    webTransportConnectionEstablished = "webTransportConnectionEstablished",
    webTransportCreated = "webTransportCreated"
}

enum ChromeDevtoolCommands {
    clearBrowserCache = "clearBrowserCache",
    clearBrowserCookies = "clearBrowserCookies",
    deleteCookies = "deleteCookies",
    disable = "disable",
    emulateNetworkConditions = "emulateNetworkConditions",
    enable = "enable",
    getCookies = "getCookies",
    getRequestPostData = "getRequestPostData",
    getResponseBody = "getResponseBody",
    setCacheDisabled = "setCacheDisabled",
    setCookie = "setCookie",
    setCookies = "setCookies",
    setExtraHTTPHeaders = "setExtraHTTPHeaders",
    setUserAgentOverride = "setUserAgentOverride"
}

type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" | "Font" | "Script" | "TextTrack" | "XHR"
| "Fetch" | "Prefetch" | "EventSource" | "WebSocket" | "Manifest" | "SignedExchange" | "Ping" | "CSPViolationReport"
| "Preflight" | "Other";

type ChromeDevtoolEventKeys = keyof typeof ChromeDevtoolEvents;
type ChromeDevtoolCommandKeys = keyof typeof ChromeDevtoolCommands;

const resolveDevtoolMethod = (key: ChromeDevtoolCommandKeys | ChromeDevtoolEventKeys) => {
    const cmdKeys = Object.keys(ChromeDevtoolCommands) as ChromeDevtoolCommandKeys[];
    if (cmdKeys.find((k) => k == key)) {
        return `Network.${ChromeDevtoolCommands[key as ChromeDevtoolCommandKeys]}`;
    }
    return `Network.${ChromeDevtoolEvents[key as ChromeDevtoolEventKeys]}`;
};

class NetworkHooker extends EventEmitter {
    private static readonly singleton = new NetworkHooker();

    private devtoolIns: Debugger | undefined;

    public static get instance() {
        return this.singleton;
    }

    private constructor() {
        super();
    }

    public set devtool(devToolIns: Debugger) {
        this.devtoolIns = devToolIns;
    }

    public typedOn(method: "responseReceived", listener: (event: Event, params: {
        frameId: string,
        hasExtraInfo: boolean,
        loaderId: string,
        requestId: string,
        timestamp: number,
        type: ResourceType,
        response: {
            url: string,
            status: number,
            statusText: string,
            headers: Record<string, string>,
            mimeType: string,
            requestHeaders?: Record<string, string>,
            connectionRefused: boolean,
            connectionId: number,
            remoteIPAddress?: string,
            remotePort?: number,
            fromDiskCache?: boolean,
            fromServiceWorker?: boolean,
            fromPrefetchCache?: boolean,
            encodedDataLength: number,
            timing?: string,
            responseTime?: number,
            cacheStorageCacheName?: string,
            protocol?: string,
            serviceWorkerResponseSource?: "cache-storage" | "http-cache" | "fallback-code" | "network"
        }
    }) => void): any;
    public typedOn(method: "requestWillBeSent", listener: (event: Event, params: {
        requestId: string,
        loaderId: string,
        documentURL: string,
        request: {
            url: string,
            urlFragment?: string,
            method: string,
            headers: Record<string, string>,
            postData?: string,
            hasPostData?: boolean,
            referrerPolicy: string,
            isLinkPreload?: boolean
        },
        timestamp: number,
        wallTime: number,
        initiator: {
            type: "parser" | "script" | "preload" | "SignedExchange" | "preflight" | "other",
            url?: string,
            lineNumber?: number,
            columnNumber?: number,
            requestId: string
        },
        redirectHasExtraInfo: boolean,
        redirectResponse?: {
            url: string,
            urlFragment?: string,
            method: string,
            headers: Record<string, string>,
            postData?: string,
            hasPostData?: boolean,
            referrerPolicy: string,
            isLinkPreload?: boolean
        },
        type?: ResourceType,
        frameId?: string,
        hasUserGesture?: boolean
    }) => void): any;
    public typedOn(method: ChromeDevtoolEventKeys, listener: (event: Event, params: any) => void) {
        super.on(method, listener);
    }

    public typedEmit(method: ChromeDevtoolEventKeys, event: Event, params: any) {
        super.emit(method, event, params);
    }

    public async sendCommand(command: ChromeDevtoolCommandKeys, params?: any, sessionId?: string) {
        if (this.devtoolIns) {
            return this.devtoolIns
                .sendCommand(resolveDevtoolMethod(command), params, sessionId);
        }
    }
}

const registerNetworkHooker = async (window: BrowserWindow) => {
    const devtool = window.webContents.debugger;

    devtool.attach("1.2");
    NetworkHooker.instance.devtool = devtool;

    try {
        await NetworkHooker.instance.sendCommand("enable");
    } catch (e) {
        console.error(e);
    }

    const eventKeys = Object.keys(ChromeDevtoolEvents) as ChromeDevtoolEventKeys[];

    devtool.on("message", (event, method, params) => {
        eventKeys.map((key) => {
            if (method == resolveDevtoolMethod(key)) {
                NetworkHooker.instance.typedEmit(key, event, params);
            }
        });
    });
};

const applyNetworkHookListener = () => {
    const hooker = NetworkHooker.instance;
    const networkEventEmitter = MahjongSoulNetworkEventEmitter.instance;

    // hook request sent
    hooker.typedOn("requestWillBeSent", (event, args) => {
        const { request, requestId } = args;

        // when send login request
        if (request.url == "https://passport.mahjongsoul.com/user/login") {
            const requestData = JSON.parse(request.postData) as LoginRequestData;

            networkEventEmitter.typedEmit("loginRequested", requestData);
        }
    });

    // hook response received
    hooker.typedOn("responseReceived", async (event, args) => {
        const { requestId, response, type } = args;

        // fetch response body
        let body;
        let base64Encoded = false;
        try {
            const responseBody = await hooker.sendCommand("getResponseBody", { requestId });
            if (response) {
                body = responseBody.body as string;
                base64Encoded = responseBody.base64Encoded as boolean;
            }
        } catch (ignore) {
            // ignore error when response body is empty
        }

        const { url } = response;

        if (url == "https://passport.mahjongsoul.com/user/login") {
            const responseData = JSON.parse(body) as LoginResponseData;
            networkEventEmitter.typedEmit("loginResponded", responseData);
        }
    });
};

export { registerNetworkHooker, NetworkHooker, applyNetworkHookListener };
