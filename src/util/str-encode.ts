const base64toString = (base64string: string): string =>
    Buffer.from(base64string, "base64").toString("utf8");

const utf8toString = (utf8string: string): string =>
    Buffer.from(utf8string, "utf8").toString("utf8");

const base64toHex = (base64string: string): string =>
    Buffer.from(base64string, "base64")
        .toString("hex");

const base64toUint8Array = (base64string: string) =>
    Uint8Array.from(Buffer.from(base64string, "base64"));

const stringToBase64 = (s: string) => Buffer.from(s).toString("base64");

const hexToBase64 = (hex: string) => Buffer.from(hex, "hex").toString("base64");

export {
    base64toString,
    utf8toString,
    base64toUint8Array,
    base64toHex,
    stringToBase64,
    hexToBase64
};
