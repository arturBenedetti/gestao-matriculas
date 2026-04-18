import type { DashboardFiltros, DashboardSnapshot } from "../core/types/DashboardSnapshot.js";
declare global {
    interface Window {
        dashboardApi: {
            refresh: (filtros?: Partial<DashboardFiltros>) => Promise<DashboardSnapshot>;
            onUpdate: (cb: (data: DashboardSnapshot) => void) => () => void;
        };
    }
}
//# sourceMappingURL=renderer.d.ts.map