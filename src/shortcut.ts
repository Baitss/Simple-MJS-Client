import { globalShortcut } from "electron";
import isDev from "electron-is-dev";
import { getWindow, WINDOW_TITLE } from "./main";

const fullscreen = () => {
    const mainWindow = getWindow();

    const handler = () => {
        if (!getWindow().isFocused()) return;
        if (mainWindow.fullScreen) {
            mainWindow.setFullScreen(false);
        } else {
            mainWindow.setFullScreen(true);
        }
    };

    globalShortcut.register("F11", handler);
    globalShortcut.register("Alt+Enter", handler);
};

const mute = () => {
    globalShortcut.register("Control+M", () => {
        if (!getWindow().isFocused()) return;

        const content = getWindow().webContents;

        if (content.isAudioMuted()) {
            content.setAudioMuted(false);
            getWindow().setTitle(`${WINDOW_TITLE}`);
        } else {
            content.setAudioMuted(true);
            getWindow().setTitle(`${WINDOW_TITLE} [Muted]`);
        }
    });
};

const devTool = () => {
    if (isDev) {
        globalShortcut.register("F12", () => {
            if (!getWindow().isFocused()) return;

            getWindow().webContents.openDevTools({
                mode: "detach"
            });
        });
    }
};
const applyShortcuts = () => {
    fullscreen();
    mute();
    devTool();
};

export default applyShortcuts;
