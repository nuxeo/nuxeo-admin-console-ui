import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PersistenceService {
  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  }

  get<T>(key: string): T | null {
    try {
      const localStorageItem = localStorage.getItem(key);
      return localStorageItem ? JSON.parse(localStorageItem) as T : null;
    } catch (e) {
      console.error("Error getting from local storage", e);
      return null;
    }
  }
}
