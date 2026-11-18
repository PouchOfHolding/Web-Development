import type { JSONSchemaType } from "ajv"; //validador de schemas. garante que cumprem as regras do modelo antes de chegarem á base de dados
import { SupplementCategory } from "../../../../shared/types.js";
import type { Supplement } from "../../../../shared/types.js";

// Validamos o payload sem o campo 'id' (pois o id é gerado no backend)
export const supplementValidationSchema: JSONSchemaType<Omit<Supplement, "id">> = {
  type: "object",
  properties: {
    // 2.2: name e laboratory devem ser strings e não podem ser vazias (minLength: 1)
    name: { type: "string", minLength: 1 },
    laboratory: { type: "string", minLength: 1 },

    // 2.3: price deve ser um número estritamente maior que 0
    price: { type: "number", exclusiveMinimum: 0 },

    // 2.5: category deve ser estritamente um dos valores do Enum do domínio
    category: {
      type: "string",
      enum: Object.values(SupplementCategory) as SupplementCategory[],
    },

    // 2.4: stock deve ser um número inteiro maior ou igual a 0
    stock: { type: "integer", minimum: 0 },

    // 2.6: description é uma string opcional/anulável
    description: { type: "string", nullable: true },
  },
  // 2.1 & 2.7: Campos obrigatórios e rejeição de propriedades extra não declaradas
  required: ["name", "laboratory", "price", "category", "stock"],
  additionalProperties: false,
};