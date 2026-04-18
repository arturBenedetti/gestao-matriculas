/** Observer adicional (exemplo de múltiplos observadores): registro no console do processo principal. */
export class LoggingDashboardObserver {
    update(data) {
        if (data.carregando)
            return;
        if (data.erro) {
            console.error("[DashboardViewModel]", data.erro);
            return;
        }
        const t2022 = data.totaisPorAno.find((x) => x.ano === 2022)?.total ?? 0;
        console.log(`[Dashboard] totais carregados — 2022 (filtro aplicado na série): ${t2022}`);
    }
}
//# sourceMappingURL=LoggingDashboardObserver.js.map