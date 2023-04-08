import { join } from "path";
import { nativeImage } from "electron";
import { writeFile } from "fs/promises";
import fetch from "./util/fetch";
import { APP_DATA_PATH } from "./util/path";

const FAVICON_URL = "https://webusstatic.yo-star.com/mahjongsoul_kr_web/mainsite/prod/favicon.ico";
const LOCAL_FAVICON_PATH = join(APP_DATA_PATH, "favicon.ico");

const downloadIcon = async () => {
    console.log("Downloading Application Icon...");
    console.log(`from '${FAVICON_URL}' -> to '${LOCAL_FAVICON_PATH}'`);
    const raw = await fetch(FAVICON_URL);
    await writeFile(LOCAL_FAVICON_PATH, raw);
    console.log("Application Icon Downloaded.");
};

const createIconObj = () => nativeImage.createFromPath(LOCAL_FAVICON_PATH);

export { downloadIcon, createIconObj };
