import { load, Root } from "protobufjs";
import { join } from "path";
import { access, writeFile } from "fs/promises";
import fetch from "./util/fetch";
import { APP_DATA_PATH } from "./util/path";
import { base64toUint8Array, hexToUint8Array } from "./util/str-encode";

const PROTO_FILE_URL = "https://raw.githubusercontent.com/MahjongRepository/mahjong_soul_api/master/ms/protocol.proto";
const LOCAL_FILE_PATH = join(APP_DATA_PATH, "mjs.proto");

let proto: Root;

const hasProtoFile = async (): Promise<boolean> => {
    try {
        await access(LOCAL_FILE_PATH);
        return true;
    } catch (e) {
        return false;
    }
};
const downloadProtoFile = async () => {
    if (await hasProtoFile()) {
        console.log("WS Protocol Buffer File Found. Skip Download.");
        return;
    }

    console.log("Download WS Protocol Buffer File...");
    console.log(`from '${PROTO_FILE_URL}' -> to '${LOCAL_FILE_PATH}'`);

    const raw = await fetch(PROTO_FILE_URL);
    const str = raw.toString();
    await writeFile(LOCAL_FILE_PATH, str);

    console.log("WS Protocol Buffer File Downloaded.");
};

const loadProto = async () => {
    console.log("Loading Protocol Buffer File...");
    console.log(`from '${LOCAL_FILE_PATH}'`);

    const root = await load(LOCAL_FILE_PATH);
    proto = root;

    console.log("Protocol Buffer File Loaded.");

    return root;
};

const createRegex = () => /\.lq\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/gmu;
const parsePath = (raw: string): string | undefined => {
    const regex = createRegex();
    const result = regex.exec(raw);

    if (result && result.length > 0) {
        const target = result[0];

        return target.replace(".lq.", "");
    }
};

const createInboundRegex = () => /\.lq\.[a-zA-Z0-9]+/gmu;
const parseInboundPath = (raw:string): string | undefined => {
    const regex = createInboundRegex();
    const result = regex.exec(raw);

    if (result && result.length > 0) {
        const target = result[0];

        return target.replace(".lq.", "");
    }
};

const lookupObject = (path: string) => proto.lookup(path);
const decodeMessage = (typePath: string, message: string, messageType: "base64" | "hex") => {
    const type = proto.lookupType(typePath);

    if (messageType == "base64") {
        return type.decode(base64toUint8Array(message));
    }
    return type.decode(hexToUint8Array(message));
};

const decodeDelimitedMessage = (typePath: string, message: string, messageType: "base64" | "hex") => {
    const type = proto.lookupType(typePath);

    if (messageType == "base64") {
        return type.decodeDelimited(base64toUint8Array(message));
    }
    return type.decodeDelimited(hexToUint8Array(message));
};

const encodeMessage = (typePath: string, obj: object) => {
    const type = proto.lookupType(typePath);
    return type.encode(obj);
};

export {
    downloadProtoFile,
    loadProto,
    createRegex,
    parsePath,
    lookupObject,
    decodeMessage,
    encodeMessage,
    parseInboundPath,
    decodeDelimitedMessage
};
