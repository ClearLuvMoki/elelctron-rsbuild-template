import path from "node:path";
import { BrowserWindow, app } from "electron";
import 'dotenv/config';

export let mainWindow: BrowserWindow | null = null;

export const isDev = !app.isPackaged;
const loadUrl: string = isDev
    ? `http://localhost:${process.env.PORT}`
    : `file://${path.resolve(__dirname, "../render/index.html")}`;

const initIpc = () => {};

const onCreateMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        minWidth: 1000,
        height: 900,
        minHeight: 700,
        frame: false,
        titleBarStyle: "hiddenInset",
        trafficLightPosition: { x: 15, y: 15 },
        webPreferences: {
            devTools: isDev,
            nodeIntegration: true,
            webSecurity: false,
            webviewTag: true,
            preload: path.resolve(__dirname, "./preload.js"),
        },
    });
    mainWindow.loadURL(loadUrl);
};

app.on("ready", async () => {
    initIpc();
    onCreateMainWindow();
});
