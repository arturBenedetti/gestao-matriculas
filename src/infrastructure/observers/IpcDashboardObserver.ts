import type { WebContents } from "electron";
import type { Observer } from "../../core/interfaces/Observer.js";
import type { DashboardSnapshot } from "../../core/types/DashboardSnapshot.js";

/** Observer que encaminha atualizações do ViewModel para o processo de renderização (IPC). */
export class IpcDashboardObserver implements Observer<DashboardSnapshot> {
  constructor(private readonly webContents: WebContents) {}

  update(data: DashboardSnapshot): void {
    if (this.webContents.isDestroyed()) return;
    this.webContents.send("dashboard:update", data);
  }
}
