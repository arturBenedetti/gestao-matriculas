import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("dashboardApi", {
    refresh: (filtros) => ipcRenderer.invoke("dashboard:refresh", filtros),
    onUpdate: (callback) => {
        const handler = (_event, data) => {
            callback(data);
        };
        ipcRenderer.on("dashboard:update", handler);
        return () => {
            ipcRenderer.removeListener("dashboard:update", handler);
        };
    },
});
//# sourceMappingURL=preload.js.map