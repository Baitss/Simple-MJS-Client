import { join } from "path";
import { app } from "electron";

const APP_DATA_PATH = join(app.getPath("appData"), "mahjong-soul-client");

export { APP_DATA_PATH };
