import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PersistenceService } from "./persistence.service";
describe("PersistenceService", () => {
  let service: PersistenceService;

  initializeTestBed();

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PersistenceService] });
    service = TestBed.inject(PersistenceService);
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("set", () => {
    it("should store string value in localStorage", () => {
      const key = "testKey";
      const value = "testValue";

      service.set(key, value);

      const stored = localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should store object value in localStorage", () => {
      const key = "testKey";
      const value = { foo: "bar", num: 123 };

      service.set(key, value);

      const stored = localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should handle localStorage.setItem errors gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const error = new Error("Storage full");
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw error;
      });

      service.set("key", "value");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving to local storage",
        error
      );
    });
  });

  describe("get", () => {
    it("should retrieve string value from localStorage", () => {
      const key = "testKey";
      const value = "testValue";
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.get<string>(key);

      expect(result).toBe(value);
    });

    it("should retrieve number value from localStorage", () => {
      const key = "numberKey";
      const value = 123;
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.get<number>(key);

      expect(result).toBe(value);
    });

    it("should retrieve boolean value from localStorage", () => {
      const key = "boolKey";
      const value = true;
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.get<boolean>(key);

      expect(result).toBe(value);
    });

    it("should retrieve object value from localStorage", () => {
      const key = "objKey";
      const value = { foo: "bar", num: 123 };
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.get<typeof value>(key);

      expect(result).toEqual(value);
    });

    it("should return null for non-existent key", () => {
      const result = service.get("nonExistentKey");

      expect(result).toBeNull();
    });

    it("should handle localStorage.getItem errors gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const error = new Error("Storage error");
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw error;
      });

      const result = service.get("key");

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting from local storage",
        error
      );
    });
  });
});
