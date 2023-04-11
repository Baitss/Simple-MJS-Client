import { BrowserWindow, Debugger } from "electron";
import { EventEmitter } from "events";
import { MahjongSoulNetworkEventEmitter } from "./mjs-network-event";
import {
    decodeMessage, lookupObject, parseInboundPath, parsePath
} from "./protobuff";
import {
    base64toHex, base64toString, formatHex, hexToUtf8, stringToBase64, stringToHex
} from "./util/str-encode";
import {
    ChromeDevtoolCommandKeys,
    ChromeDevtoolCommands,
    ChromeDevtoolEventKeys,
    ChromeDevtoolEvents,
    LoginRequestData,
    LoginResponseData,
    ParsedWebsocketInbound,
    ParsedWebsocketResponse,
    RequestSentParams,
    ResponseReceivedParams,
    WebSocketParams,
    WsBodyParseResult,
    WsInboundBodyParseResult,
    WsRequestBodyParseResult,
    WsResponseBodyParseResult,
    WsType
} from "./type/network";

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

    public typedOn(method: "responseReceived", listener: (event: Event, params: ResponseReceivedParams) => void): any;
    public typedOn(method: "requestWillBeSent", listener: (event: Event, params: RequestSentParams) => void): any;
    public typedOn(method: "webSocketFrameReceived", listener: (event: Event, params: WebSocketParams) => void): any;
    public typedOn(method: "webSocketFrameSent", listener: (event: Event, params: WebSocketParams) => void): any;
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

const parseRawWsBody = (base64body: string): WsBodyParseResult => {
    const hexBody = base64toHex(base64body);
    const bodyCandidate: string[] = [];

    let type: WsType;
    if (hexBody.startsWith("03")) {
        type = "RESPONSE";
    } else if (hexBody.startsWith("02")) {
        type = "REQUEST";
    } else if (hexBody.startsWith("01")) {
        type = "INBOUND_ONLY";
    } else {
        throw new Error("Invalid Websocket Body Data");
    }

    let parseBuffer = hexBody.slice(2);

    if (type != "INBOUND_ONLY") {
        const requestId = parseBuffer.slice(0, 4);
        parseBuffer = parseBuffer.slice(4);

        if (type == "REQUEST") {
            const path = parsePath(base64toString(base64body));

            if (!path) {
                throw new Error("Invalid Websocket Request Body Data");
            }

            const fullPath = `.lq.${path}`;
            const hexPath = base64toHex(stringToBase64(fullPath));

            parseBuffer = parseBuffer.slice(hexPath.length + 8);

            bodyCandidate.push(parseBuffer);

            return {
                type, requestId, hexData: hexBody, path, hexBodyCandidate: bodyCandidate, hexPath
            } as WsRequestBodyParseResult;
        }
        parseBuffer = parseBuffer.slice(6);
        bodyCandidate.push(parseBuffer.slice(2));
        bodyCandidate.push(parseBuffer.slice(4));

        return {
            type, requestId, hexData: hexBody, hexBodyCandidate: bodyCandidate
        } as WsResponseBodyParseResult;
    }

    parseBuffer = parseBuffer.slice(4);

    const path = parseInboundPath(hexToUtf8(parseBuffer));
    if (!path) {
        throw new Error("Invalid Websocket Request Body Data");
    }
    const fullPath = `.lq.${path}`;
    const hexPath = stringToHex(fullPath);

    bodyCandidate.push(parseBuffer.slice(hexPath.length + 4));
    bodyCandidate.push(parseBuffer.slice(hexPath.length + 6));

    return {
        type, hexData: hexBody, path, hexPath, hexBodyCandidate: bodyCandidate
    } as WsInboundBodyParseResult;
};

const deduceBody = (requestType: string, candidates: string[]) => {
    let targetObj = {};
    let rawBody = "";
    let keyLen = 0;
    candidates.map((candidate) => {
        try {
            const parsed = decodeMessage(requestType, candidate, "hex");
            const parsedObj = parsed.toJSON();

            let allKeys: (string | number | symbol)[] = [];
            const parentKeys: (keyof typeof parsedObj)[] = Object.keys(parsedObj);

            allKeys = allKeys.concat(parentKeys);

            parentKeys.map((parentKey) => {
                const currentObj = parsedObj[parentKey];
                if (typeof currentObj == "object") {
                    const childKeys: (keyof typeof currentObj)[] = Object.keys(currentObj);
                    allKeys = allKeys.concat(childKeys);
                }
            });

            if (allKeys.length > keyLen) {
                keyLen = allKeys.length;
                targetObj = parsedObj;
                rawBody = candidate;
            }
        } catch (e) {
            // ignore when parse error
        }
    });

    return {
        obj: targetObj,
        rawBody
    };
};

const doWsResProcess = async (data: WebSocketParams) => {
    const body = data.response.payloadData;

    try {
        const result = parseRawWsBody(body);
        const emitter = MahjongSoulNetworkEventEmitter.instance;

        if (result.type == "INBOUND_ONLY") {
            const deduced = deduceBody(result.path, result.hexBodyCandidate);

            if (!deduced.obj) {
                throw new Error("There is no Type in Protocol Buffer File.");
            }

            const response: ParsedWebsocketInbound<object> = {
                responseData: deduced.obj,
                rawResponseBody: deduced.rawBody,
                rawData: result.hexData,
                path: result.path,
                hexPath: result.hexPath
            };

            emitter.typedEmit("wsInbound", response);
        } else {
            const request = emitter.getWsQueue(result.requestId);

            emitter.removeWsQueue(request.requestId);

            const deduced = deduceBody(request.responseType, result.hexBodyCandidate);

            if (!deduced.obj) {
                throw new Error("There is no Type in Protocol Buffer File.");
            }

            const response: ParsedWebsocketResponse<object> = {
                requestId: request.requestId,
                request,
                responseData: deduced.obj,
                rawResponseBody: deduced.rawBody,
                rawData: result.hexData
            };
            emitter.typedEmit("wsResponded", response);
        }
    } catch (e) {
        console.error(e);
        console.error(`Base64 Body: ${body}`);
        console.error(`Hex Body: ${formatHex(base64toHex(body))}`);
    }
};

const doWsReqProcess = async (data: WebSocketParams) => {
    const body = data.response.payloadData;

    try {
        const result = parseRawWsBody(body) as WsRequestBodyParseResult;

        const rpc = lookupObject(result.path);
        const { requestType, responseType } = rpc.toJSON() as {
            requestType: string, responseType: string
        };

        const deduced = deduceBody(requestType, result.hexBodyCandidate);

        if (deduced.obj) {
            MahjongSoulNetworkEventEmitter.instance.typedEmit("wsRequested", {
                requestId: result.requestId,
                requestType,
                responseType,
                requestData: deduced.obj,
                rawData: result.hexData,
                rawRequestBody: deduced.rawBody,
                requestMethod: result.path,
                hexRequestMethod: result.hexPath
            });
        } else {
            throw new Error("There is no Type in Protocol Buffer File.");
        }
    } catch (e) {
        console.error(e);
        console.error(`Base64 Body: ${body}`);
    }
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

    hooker.typedOn("webSocketFrameReceived", async (event, args) => {
        await doWsResProcess(args);
    });

    hooker.typedOn("webSocketFrameSent", async (event, args) => {
        await doWsReqProcess(args);
    });
};

export { registerNetworkHooker, NetworkHooker, applyNetworkHookListener };
