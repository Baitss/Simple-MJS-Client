const base64toString = (base64string: string): string => Buffer.from(base64string, "base64").toString("utf8");

const utf8toString = (utf8string: string): string => Buffer.from(utf8string, "utf8").toString("utf8");

const base64toUint8Array = (base64string: string) => Uint8Array.from(Buffer.from(base64string, "base64"));

export { base64toString, utf8toString, base64toUint8Array };
