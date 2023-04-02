import { app, BrowserWindow, nativeImage } from "electron";
import isDev from "electron-is-dev";
import { writeFile } from "fs/promises";
import { join } from "path";
import applyShortcuts from "./shortcut";
import fetchIcon from "./fetch-icon";

const MJ_URL = "https://mahjongsoul.game.yo-star.com/kr/index.html";
const FAVICON_URL = "https://webusstatic.yo-star.com/mahjongsoul_kr_web/mainsite/prod/favicon.ico";
const LOCAL_FAVICON_PATH = "favicon.ico";
const WINDOW_TITLE = "Mahjong Soul";

let mainWindow: BrowserWindow;

const downloadIcon = async () => {
    const raw = await fetchIcon(FAVICON_URL);
    await writeFile(LOCAL_FAVICON_PATH, raw);
};
const createWindow = async () => {
    await downloadIcon();

    const icon = nativeImage.createFromPath(LOCAL_FAVICON_PATH);

    const window = new BrowserWindow({
        title: WINDOW_TITLE,
        resizable: true,
        movable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        focusable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            devTools: true
        },
        icon
    });

    // Fix Title
    window.on("page-title-updated", (event) => {
        event.preventDefault();
    });

    window.setAspectRatio(16 / 9);
    window.removeMenu();

    /*
    let resizeTimeout: NodeJS.Timeout;
    window.on("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const size = window.getSize();
            window.setSize(size[0], Math.round(size[0] * (9 / 16)));
        }, 100);
    });
    */

    await window.loadURL(MJ_URL);

    if (isDev) {
        window.webContents.openDevTools();
    }

    return window;
};

app.whenReady().then(async () => {
    mainWindow = await createWindow();
    applyShortcuts();
});

app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length == 0) mainWindow = await createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
});

process.on("uncaughtException", () => {
    process.exit(1);
});

const getWindow = () => mainWindow;

export { getWindow };
