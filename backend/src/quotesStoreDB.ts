// quotesStoreDb.ts
import Database from "better-sqlite3";
import { QuoteInput, QuoteResult } from "./calc.js";

export type SavedQuote = {
  id: string;
  input: QuoteInput;
  result: QuoteResult;
  quoteName: string;
};

export class QuotesStore {
  private db: Database.Database;

  constructor() {
    this.db = new Database("quotes.db");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        input TEXT NOT NULL,
        result TEXT NOT NULL,
        quoteName TEXT NOT NULL
      )
    `);
  }

  list(): SavedQuote[] {
    const rows = this.db
      .prepare("SELECT id, input, result, quoteName FROM quotes")
      .all() as Array<{ id: string; input: string; result: string; quoteName: string }>;

    return rows.map((r) => ({
    id: r.id,
    input: JSON.parse(r.input) as QuoteInput,
    result: JSON.parse(r.result) as QuoteResult,
    quoteName: r.quoteName,
    }));
  }

  add(entry: { input: QuoteInput; result: QuoteResult; name?: string }): SavedQuote {
    const exists = this.db
      .prepare("SELECT COUNT(*) as c FROM quotes WHERE input = ?")
      .get(JSON.stringify(entry.input)) as { c: number } | undefined;

    if ((exists?.c ?? 0) > 0) {
      throw new Error("A quote with identical input already exists");
    }

    const id = Math.random().toString(36).slice(2, 10);
    const quoteName = entry.name || "Untitled Quote";

    this.db
      .prepare("INSERT INTO quotes (id, input, result, quoteName) VALUES (?, ?, ?, ?)")
      .run(id, JSON.stringify(entry.input), JSON.stringify(entry.result), quoteName);

    return { id, input: entry.input, result: entry.result, quoteName };
  }

  remove(id: string): boolean {
    const res = this.db.prepare("DELETE FROM quotes WHERE id = ?").run(id);
    return res.changes > 0;
  }
}
