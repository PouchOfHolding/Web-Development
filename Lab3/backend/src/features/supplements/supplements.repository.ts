import { promises as fs } from "node:fs";
import path from "node:path";

import type { Supplement } from "../../../../shared/types.js";
import { SupplementCategory } from "../../../../shared/types.js";

export class SupplementsRepository {
  private readonly filePath = path.join(process.cwd(), "supplements.json");

  private readonly seedSupplements: Supplement[] = [
    {
      id: "sup-101",
      name: "Creatina Monohidratada",
      laboratory: "NutriLab",
      price: 24.9,
      category: SupplementCategory.Sports,
      stock: 30,
      description: "Creatina monohidratada em pó.",
    },
    {
      id: "sup-102",
      name: "Whey Protein",
      laboratory: "Power Nutrition",
      price: 34.5,
      category: SupplementCategory.Protein,
      stock: 18,
      description: "Proteína whey sabor chocolate.",
    },
    {
      id: "sup-103",
      name: "Multivitamínico",
      laboratory: "VitaPlus",
      price: 15.99,
      category: SupplementCategory.Vitamins,
      stock: 40,
      description: "Complexo multivitamínico diário.",
    },
  ];

  public async getAll(): Promise<Supplement[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");

      return JSON.parse(data) as Supplement[];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await fs.writeFile(
          this.filePath,
          JSON.stringify(this.seedSupplements, null, 2),
          "utf-8",
        );

        return this.seedSupplements;
      }

      throw error;
    }
  }
  public async saveAll(supplements: Supplement[]): Promise<void> {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(supplements, null, 2),
      "utf-8",
    );
  }
}
