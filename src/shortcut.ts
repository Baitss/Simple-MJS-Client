import { globalShortcut } from "electron";
import { getWindow } from "./main";

const fullscreen = () => {
    const mainWindow = getWindow();

    const handler = () => {
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
        const content = getWindow().webContents;

        if (content.isAudioMuted()) {
            content.setAudioMuted(false);
        } else {
            content.setAudioMuted(true);
        }
    });
};
const applyShortcuts = () => {
    fullscreen();
    mute();
};

export default applyShortcuts;
