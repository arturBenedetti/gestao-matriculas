import type { Observer } from "../../core/interfaces/Observer.js";
import type { DashboardSnapshot } from "../../core/types/DashboardSnapshot.js";

/** Observer adicional (exemplo de múltiplos observadores): registro no console do processo principal. */
export class LoggingDashboardObserver implements Observer<DashboardSnapshot> {
  update(data: DashboardSnapshot): void {
    if (data.carregando) return;
    if (data.erro) {
      console.error("[DashboardViewModel]", data.erro);
      return;
    }
    const t2022 = data.totaisPorAno.find((x) => x.ano === 2022)?.total ?? 0;
    console.log(`[Dashboard] totais carregados — 2022 (filtro aplicado na série): ${t2022}`);
  }
}
