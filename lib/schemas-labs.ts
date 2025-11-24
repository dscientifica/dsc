
import { z } from 'zod';
export const LaboratorioSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  acreditadoRBC: z.boolean().default(false),
  rbcNumero: z.string().optional(),
  contato: z.string().optional()
});
