-- CreateTable
CREATE TABLE "matricula_linha" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "ies" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "organizacao" TEXT NOT NULL,
    "categoria_administrativa" TEXT NOT NULL,
    "publica" BOOLEAN NOT NULL,
    "nome_curso" TEXT NOT NULL,
    "nome_detalhado_curso" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "grau" TEXT NOT NULL,
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

CREATE INDEX "matricula_linha_modalidade_idx" ON "matricula_linha"("modalidade");
CREATE INDEX "matricula_linha_publica_idx" ON "matricula_linha"("publica");
CREATE INDEX "matricula_linha_modalidade_publica_idx" ON "matricula_linha"("modalidade", "publica");
