"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("dashboardApi", {
    refresh: (filtros) => electron_1.ipcRenderer.invoke("dashboard:refresh", filtros),
    onUpdate: (callback) => {
        const handler = (_event, data) => {
            callback(data);
        };
        electron_1.ipcRenderer.on("dashboard:update", handler);
        return () => {
            electron_1.ipcRenderer.removeListener("dashboard:update", handler);
        };
    },
});
//# sourceMappingURL=preload.js.map