import "dotenv/config";
import { app, BrowserWindow, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaMatriculaRepository } from "./data/repositories/PrismaMatriculaRepository.js";
import { DashboardViewModel } from "./presentation/viewmodels/DashboardViewModel.js";
import { IpcDashboardObserver } from "./infrastructure/observers/IpcDashboardObserver.js";
import { LoggingDashboardObserver } from "./infrastructure/observers/LoggingDashboardObserver.js";
import type { DashboardFiltros } from "./core/types/DashboardSnapshot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const repository = new PrismaMatriculaRepository(prisma);
const dashboardViewModel = new DashboardViewModel(repository);

dashboardViewModel.addObserver(new LoggingDashboardObserver());

function registerDashboardIpc(): void {
  ipcMain.handle(
    "dashboard:refresh",
    async (_event, filtros: Partial<DashboardFiltros> | undefined) => {
      if (filtros) {
        dashboardViewModel.setFiltros(filtros);
      }
      return dashboardViewModel.refresh();
    },
  );
}

function createWindow(): BrowserWindow {
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

app.whenReady().then(() => {
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
