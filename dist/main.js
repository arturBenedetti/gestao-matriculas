import { config as loadEnv } from "dotenv";
import { app, BrowserWindow, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaMatriculaRepository } from "./data/repositories/PrismaMatriculaRepository.js";
import { DashboardViewModel } from "./presentation/viewmodels/DashboardViewModel.js";
import { IpcDashboardObserver } from "./infrastructure/observers/IpcDashboardObserver.js";
import { LoggingDashboardObserver } from "./infrastructure/observers/LoggingDashboardObserver.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Carrega .env da raiz do projeto (não depende do cwd do processo, como atalhos ou Explorer).
loadEnv({ path: join(__dirname, "..", ".env") });
const prisma = new PrismaClient();
const repository = new PrismaMatriculaRepository(prisma);
const dashboardViewModel = new DashboardViewModel(repository);
dashboardViewModel.addObserver(new LoggingDashboardObserver());
function registerDashboardIpc() {
    ipcMain.handle("dashboard:refresh", async (_event, filtros) => {
        if (filtros) {
            dashboardViewModel.setFiltros(filtros);
        }
        return dashboardViewModel.refresh();
    });
}
function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 820,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const ipcObserver = new IpcDashboardObserver(win.webContents);
    dashboardViewModel.addObserver(ipcObserver);
    win.on("closed", () => {
        dashboardViewModel.removeObserver(ipcObserver);
    });
    void win.loadFile(join(__dirname, "view", "index.html"));
    return win;
}
async function logDatabaseHealth() {
    try {
        await prisma.$connect();
        const countRows = await prisma.$queryRaw `SELECT COUNT(*)::bigint AS n FROM "matricula_linha"`;
        const n = countRows[0]?.n ?? 0n;
        console.log(`[DB] Conexão OK — matricula_linha: ${n.toString()} linha(s).`);
        const mods = await prisma.$queryRaw `
      SELECT DISTINCT "Modalidade" AS m FROM "matricula_linha" WHERE "Modalidade" IS NOT NULL ORDER BY 1 LIMIT 12
    `;
        const sample = mods.map((x) => x.m).filter(Boolean);
        if (sample.length) {
            console.log(`[DB] Exemplos de "Modalidade" no banco: ${sample.join(" | ")}`);
        }
    }
    catch (e) {
        console.error("[DB] Falha ao conectar ou ler matricula_linha:", e);
    }
}
app.whenReady().then(async () => {
    await logDatabaseHealth();
    registerDashboardIpc();
    createWindow();
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("before-quit", async () => {
    ipcMain.removeHandler("dashboard:refresh");
    await prisma.$disconnect();
});
//# sourceMappingURL=main.js.map