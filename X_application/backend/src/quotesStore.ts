
import { QuoteInput, QuoteResult } from './calc.js';

export type SavedQuote = {
  id: string;
  input: QuoteInput;
  result: QuoteResult;
  quoteName: string;
};

export class QuotesStore {
  private quotes: SavedQuote[] = [];

  list(): SavedQuote[] {
    return this.quotes.slice();
  }

  add(entry: { input: QuoteInput; result: QuoteResult; name?: string }): SavedQuote {
    const id = Math.random().toString(36).slice(2, 10);
    const quoteName = entry.name || 'Untitled Quote';
    const saved: SavedQuote = { id, input: entry.input, result: entry.result, quoteName };
    this.quotes.unshift(saved);
    return saved;
  }

  remove(id: string): boolean {
    const idx = this.quotes.findIndex(q => q.id === id);
    if (idx === -1) return false;
    this.quotes.splice(idx, 1);
    return true;
  }
}
