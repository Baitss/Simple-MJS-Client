import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { join } from "path";
import applyShortcuts from "./shortcut";
import { applyNetworkHookListener, registerNetworkHooker } from "./network";
import { applyMahjongSoulNetworkEventHandlers } from "./mjs-network-event";
import { downloadProtoFile, loadProto } from "./protobuff";
import { createIconObj, downloadIcon } from "./icon";
import { initDiscord, setActivity } from "./discord";

const MJ_URL = "https://mahjongsoul.game.yo-star.com/kr/index.html";

const WINDOW_TITLE = "Mahjong Soul";

let mainWindow: BrowserWindow;

const createWindow = async () => {
    await downloadIcon();
    await downloadProtoFile();
    await loadProto();

    const icon = createIconObj();

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
            devTools: isDev
        },
        icon
    });

    // Fix Title
    window.on("page-title-updated", (event) => {
        event.preventDefault();
    });

    window.setAspectRatio(16 / 9);
    window.removeMenu();

    let resizeTimeout: NodeJS.Timeout;
    window.on("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const size = window.getSize();
            const titleBarSize = size[1] - window.getContentSize()[1];
            window.setSize(size[0], Math.floor(size[0] * (9 / 16) + titleBarSize));
        }, 10);
    });

    registerNetworkHooker(window)
        .then(applyNetworkHookListener)
        .then(applyMahjongSoulNetworkEventHandlers)
        .catch(console.error);

    if (isDev) {
        window.webContents.openDevTools();
    }

    await window.loadURL(MJ_URL);

    initDiscord()
        .then((client) => setActivity(client))
        .catch((e) => {
            console.error("Failed to Connect Discord RPC Server.");
            console.error(e);
        });

    return window;
};

app.whenReady().then(async () => {
    mainWindow = await createWindow();
    applyShortcuts();
}).catch(console.error);

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
