import { get as getHttp, IncomingMessage } from "http";
import { get as getHttps } from "https";

const callback = (res: IncomingMessage, resolver: (buffer: Buffer) => any) => {
    let buffer = Buffer.from([]);
    res.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
    });
    res.on("close", () => {
        resolver(buffer);
    });
};

const fetch = async (url: string) => new Promise<Buffer>((resolve) => {
    if (url.startsWith("https")) {
        getHttps(url, (res) => {
            callback(res, resolve);
        });
    } else {
        getHttp(url, (res) => {
            callback(res, resolve);
        });
    }
});

export default fetch;
