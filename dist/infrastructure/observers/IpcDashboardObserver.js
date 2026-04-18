/** Observer que encaminha atualizações do ViewModel para o processo de renderização (IPC). */
export class IpcDashboardObserver {
    webContents;
    constructor(webContents) {
        this.webContents = webContents;
    }
    update(data) {
        if (this.webContents.isDestroyed())
            return;
        this.webContents.send("dashboard:update", data);
    }
}
//# sourceMappingURL=IpcDashboardObserver.js.map