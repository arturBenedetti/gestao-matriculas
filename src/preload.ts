import { contextBridge, ipcRenderer } from "electron";
import type {
  DashboardFiltros,
  DashboardSnapshot,
} from "./core/types/DashboardSnapshot.js";

contextBridge.exposeInMainWorld("dashboardApi", {
  refresh: (filtros?: Partial<DashboardFiltros>) =>
    ipcRenderer.invoke("dashboard:refresh", filtros) as Promise<DashboardSnapshot>,
  onUpdate: (callback: (data: DashboardSnapshot) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: DashboardSnapshot) => {
      callback(data);
    };
    ipcRenderer.on("dashboard:update", handler);
    return () => {
      ipcRenderer.removeListener("dashboard:update", handler);
    };
  },
});
