
import { z } from 'zod';

export const EquipamentoSchema = z.object({
  tag: z.string().min(1, 'Tag obrigatória'),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  localizacao: z.string().optional(),
  responsavelUserId: z.string().nullable().optional(),
  status: z.enum(['em_uso', 'bloqueado', 'em_calibracao']).default('em_uso'),
  periodicidadeMeses: z.number().int().min(1).max(60),
  faixa: z.string().min(1, 'Faixa obrigatória'),
  classe: z.string().min(1, 'Classe obrigatória'),
  tolerancias: z.string().min(1, 'Tolerâncias obrigatórias'),
});

export const CalibracaoSchema = z.object({
  dataEnvio: z.string().optional(),
  dataCalibracao: z.string().optional(),
  dataRetorno: z.string().optional(),
  laboratorioId: z.string().min(1, 'Laboratório obrigatório'),
  laboratorioAcreditadoRBC: z.boolean().optional(),
  certificadoNumero: z.string().optional(),
  certificadoArquivoPath: z.string().optional(),
  resultados: z.array(z.object({
    ponto: z.number(),
    valor: z.number(),
    erro: z.number(),
    incerteza: z.number(),
    unidade: z.string()
  })).optional(),
  criterioAceitacao: z.string().optional(),
  decisaoConformidade: z.enum(['conforme', 'nao_conforme']).optional(),
  condicoesAmbientais: z.object({
    temperatura: z.number().optional(),
    umidade: z.number().optional(),
  }).optional(),
  observacoes: z.string().optional(),
});
