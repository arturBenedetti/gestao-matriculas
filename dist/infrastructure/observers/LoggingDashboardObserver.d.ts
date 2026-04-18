import type { Observer } from "../../core/interfaces/Observer.js";
import type { DashboardSnapshot } from "../../core/types/DashboardSnapshot.js";
/** Observer adicional (exemplo de múltiplos observadores): registro no console do processo principal. */
export declare class LoggingDashboardObserver implements Observer<DashboardSnapshot> {
    update(data: DashboardSnapshot): void;
}
//# sourceMappingURL=LoggingDashboardObserver.d.ts.map