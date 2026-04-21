const el = (id) => {
    const n = document.getElementById(id);
    if (!n)
        throw new Error(`Elemento #${id} não encontrado`);
    return n;
};
function fmt(n) {
    return n.toLocaleString("pt-BR");
}
function renderTotais(data) {
    const tbody = el("tbody-totais");
    tbody.innerHTML = "";
    for (const row of data.totaisPorAno) {
        const tr = document.createElement("tr");
        tr.className = "border-t border-slate-800/80";
        tr.innerHTML = `<td class="py-2 pr-4 text-slate-300">${row.ano}</td><td class="py-2 font-medium text-white">${fmt(row.total)}</td>`;
        tbody.appendChild(tr);
    }
}
function renderRanking(listEl, items) {
    listEl.innerHTML = "";
    for (const it of items) {
        const li = document.createElement("li");
        li.className =
            "flex items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2";
        li.innerHTML = `<span class="text-slate-300"><span class="font-mono text-emerald-400">${it.posicao}.</span> ${it.rotulo}</span><span class="text-slate-400">${fmt(it.total)}</span>`;
        listEl.appendChild(li);
    }
}
function renderRankingIes(listEl, items) {
    listEl.innerHTML = "";
    for (const it of items) {
        const li = document.createElement("li");
        li.className =
            "flex flex-col gap-0.5 rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between";
        li.innerHTML = `<span class="text-slate-300"><span class="font-mono text-emerald-400">${it.posicao}.</span> ${it.rotulo} <span class="text-slate-500">(${it.subrotulo})</span></span><span class="text-slate-400">${fmt(it.total)}</span>`;
        listEl.appendChild(li);
    }
}
function applySnapshot(data) {
    const status = el("status-bar");
    const err = el("erro-global");
    err.textContent = data.erro ?? "";
    if (data.carregando) {
        status.textContent = "Carregando dados…";
        return;
    }
    status.textContent = "Dados atualizados.";
    renderTotais(data);
    renderRanking(el("lista-cursos-presencial"), data.rankingCursosPresencial2022);
    renderRanking(el("lista-cursos-ead"), data.rankingCursosEad2022);
    renderRankingIes(el("lista-ies-presencial"), data.rankingIesPresencial2022);
    renderRankingIes(el("lista-ies-ead"), data.rankingIesEad2022);
}
function readFiltrosFromDom() {
    const modalidadeTotais = el("filtro-modalidade")
        .value;
    const setorIesPresencial = el("filtro-ies-pres")
        .value;
    const setorIesEad = el("filtro-ies-ead").value;
    return { modalidadeTotais, setorIesPresencial, setorIesEad };
}
async function refreshFromUi() {
    if (!window.dashboardApi)
        return;
    try {
        const filtros = readFiltrosFromDom();
        await window.dashboardApi.refresh(filtros);
    }
    catch (e) {
        el("erro-global").textContent =
            e instanceof Error ? e.message : String(e);
    }
}
function init() {
    if (!window.dashboardApi) {
        el("erro-global").textContent =
            "API do painel indisponível (preload não carregou). Rode npm run build e confira o terminal do Electron por erros de preload.";
        return;
    }
    const unsub = window.dashboardApi.onUpdate(applySnapshot);
    el("btn-aplicar-totais").addEventListener("click", () => {
        void refreshFromUi();
    });
    el("filtro-modalidade").addEventListener("change", () => {
        void refreshFromUi();
    });
    for (const id of ["filtro-ies-pres", "filtro-ies-ead"]) {
        el(id).addEventListener("change", () => {
            void refreshFromUi();
        });
    }
    window.addEventListener("beforeunload", () => {
        unsub();
    });
    void refreshFromUi();
}
init();
export {};
//# sourceMappingURL=renderer.js.map