import type { WebContents } from "electron";
import type { Observer } from "../../core/interfaces/Observer.js";
import type { DashboardSnapshot } from "../../core/types/DashboardSnapshot.js";
/** Observer que encaminha atualizações do ViewModel para o processo de renderização (IPC). */
export declare class IpcDashboardObserver implements Observer<DashboardSnapshot> {
    private readonly webContents;
    constructor(webContents: WebContents);
    update(data: DashboardSnapshot): void;
}
//# sourceMappingURL=IpcDashboardObserver.d.ts.map