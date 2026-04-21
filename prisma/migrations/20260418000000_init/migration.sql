DROP TABLE IF EXISTS "matricula_linha";

CREATE TABLE "matricula_linha" (
    "id" SERIAL NOT NULL,
    "Estado" TEXT,
    "Cidade" TEXT,
    "IES" TEXT,
    "Sigla" TEXT,
    "Organização" TEXT,
    "Categoria Administrativa" TEXT,
    "Pública" TEXT,
    "Nome do Curso" TEXT,
    "Nome Detalhado do Curso" TEXT,
    "Modalidade" TEXT,
    "Grau" TEXT,
    "y2014" INTEGER,
    "y2015" INTEGER,
    "y2016" INTEGER,
    "y2017" INTEGER,
    "y2018" INTEGER,
    "y2019" INTEGER,
    "y2020" INTEGER,
    "y2021" INTEGER,
    "y2022" INTEGER,

    CONSTRAINT "matricula_linha_pkey" PRIMARY KEY ("id")
);
