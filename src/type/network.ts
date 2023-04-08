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

interface ResponseReceivedParams {
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
}

interface RequestSentParams {
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
}

interface WebSocketParams {
    requestId: string,
    timestamp: number,
    response: {
        opcode: number,
        mask: boolean,
        payloadData: string
    }
}

type WsType = "REQUEST" | "RESPONSE";

interface WsBodyParseResult {
    type: WsType,
    requestId: string,
    hexData: string,
    path?: string
}

interface WsRequestBodyParseResult extends WsBodyParseResult {
    type: "REQUEST",
    path: string
}

interface WsResponseBodyParseResult extends WsBodyParseResult {
    type: "RESPONSE"
}

interface LoginRequestData {
    deviceId: string,
    token: string,
    uid: string
}

interface LoginResponseData {
    accessToken: string,
    channelId: string,
    current_timestamp_ms: number,
    result: number,
    token: string,
    twitter_id?: string,
    twitter_username?: string,
    google_id?: string,
    google_username?: string,
    facebook_id?: string,
    facebook_username?: string,
    uid: string,
    yostar_uid?: string,
    yostar_username?: string
}

interface ParsedWebsocketRequest<T extends object> {
    requestId: string;
    requestType: string;
    responseType: string;
    requestData: T;
    /**
     * Websocket Request Body (hex)
     */
    rawRequestBody: string;
    /**
     * Raw Websocket Request Data (Base64)
     */
    rawData: string;
}

interface ParsedWebsocketResponse<T extends object> {
    requestId: string;
    request: ParsedWebsocketRequest<object>;
    responseData: T;
    /**
     * Websocket Response Body (hex)
     */
    rawResponseBody: string;
    /**
     * Raw Websocket Response Data (Base64)
     */
    rawData: string;
}

export {
    ChromeDevtoolEvents,
    ChromeDevtoolCommands,
    ResourceType,
    ChromeDevtoolCommandKeys,
    ChromeDevtoolEventKeys,
    RequestSentParams,
    ResponseReceivedParams,
    WsResponseBodyParseResult,
    WsBodyParseResult,
    WsRequestBodyParseResult,
    WebSocketParams,
    WsType,
    LoginResponseData,
    LoginRequestData,
    ParsedWebsocketRequest,
    ParsedWebsocketResponse
};
