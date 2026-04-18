export type ModalidadeFiltro = "todos" | "Presencial" | "EaD";

export type SetorIes = "publicas" | "privadas";

export interface DashboardFiltros {
  modalidadeTotais: ModalidadeFiltro;
  setorIesPresencial: SetorIes;
  setorIesEad: SetorIes;
}

export interface RankingItem {
  posicao: number;
  rotulo: string;
  subrotulo: string;
  total: number;
}

export interface DashboardSnapshot {
  carregando: boolean;
  erro?: string;
  totaisPorAno: { ano: number; total: number }[];
  rankingCursosPresencial2022: RankingItem[];
  rankingCursosEad2022: RankingItem[];
  rankingIesPresencial2022: RankingItem[];
  rankingIesEad2022: RankingItem[];
  filtros: {
    modalidadeTotais: ModalidadeFiltro;
    setorIesPresencial: SetorIes;
    setorIesEad: SetorIes;
  };
}
