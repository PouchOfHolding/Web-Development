import { promises as fs } from "node:fs";
import nedb from '@seald-io/nedb';
import path from "node:path";
import type { Supplement } from "../../../../shared/types.js";
import { SupplementCategory } from "../../../../shared/types.js";
const Datastore =nedb.default ?? nedb;
type Datastore =InstanceType<typeof Datastore>;


export class SupplementsRepository {
  private readonly filePath = path.join(process.cwd(), "supplements.json");
  private db = new Datastore({ filename: 'supplements.db', autoload: true });
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

  constructor() {
    this.db = new Datastore({ filename: "supplements.db", autoload: true });
    this.seedIfNeeded().catch(console.error);
  }



    private async seedIfNeeded(): Promise<void> {
    const existing = await new Promise<any[]>((resolve, reject) => {
      this.db.find({}, (err: Error | null, docs: any[]) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    if (existing.length > 0) return;

    const docs = this.seedSupplements.map((s) => ({ ...s, _id: s.id }));

    await new Promise<void>((resolve, reject) => {
      this.db.insert(docs, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

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

  public async getById(id: string): Promise<Supplement | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err: Error | null, doc: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(doc ? ({ ...doc, id: doc._id } as Supplement) : null);
      });
    });
  }

  public async create(supplement: Supplement): Promise<Supplement> {
    const docToInsert = {
      ...supplement,
      _id: supplement.id || `sup-${Date.now()}`,
    };

    return new Promise((resolve, reject) => {
      this.db.insert(docToInsert, (err: Error | null, newDoc: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ ...newDoc, id: newDoc._id } as Supplement);
      });
    });
  }

  public async update(
    id: string,
    data: Partial<Supplement>,
  ): Promise<Supplement | null> {
    const { id: _ignored, ...fields } = data;

    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: fields },
        {},
        (err: Error | null, numAffected: number) => {
          if (err) {
            reject(err);
            return;
          }
          if (numAffected === 0) {
            resolve(null);
            return;
          }
          this.getById(id).then(resolve).catch(reject);
        },
      );
    });
  }

  public async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.remove(
        { _id: id },
        {},
        (err: Error | null, numRemoved: number) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(numRemoved > 0);
        },
      );
    });
  }
}