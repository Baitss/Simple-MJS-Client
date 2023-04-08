import { load, Root } from "protobufjs";
import { join } from "path";
import { writeFile } from "fs/promises";
import fetch from "./util/fetch";
import { APP_DATA_PATH } from "./util/path";
import { base64toUint8Array } from "./util/str-encode";

const PROTO_FILE_URL = "https://raw.githubusercontent.com/MahjongRepository/mahjong_soul_api/master/ms/protocol.proto";
const LOCAL_FILE_PATH = join(APP_DATA_PATH, "mjs.proto");

let proto: Root;

const downloadProtoFile = async () => {
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

const lookupObject = (path: string) => proto.lookup(path);
const decodeMessage = (typePath: string, message: string) => {
    const type = proto.lookupTypeOrEnum(typePath);
    const value = type.decode(base64toUint8Array(message));

    return value;
};

export {
    downloadProtoFile,
    loadProto,
    createRegex,
    parsePath,
    lookupObject,
    decodeMessage
};
