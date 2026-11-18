import Datastore from "nedb";
import path from "node:path";
import type { UserRole } from "../../../../shared/types.js";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export class UsersRepository {
  private readonly db: Datastore;

  constructor() {
    this.db = new Datastore({
      filename: path.join(process.cwd(), "users.db"),
      autoload: true,
    });
  }

  /**
   * Procurar um utilizador pelo seu endereço de email de forma assíncrona.
   */
  public async getByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email }, (err, doc: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc || null);
        }
      });
    });
  }

  /**
   * Inserir um novo utilizador na coleção users.db.
   */
  public async create(user: Omit<User, "id" | "_id">): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err, newDoc: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }
}