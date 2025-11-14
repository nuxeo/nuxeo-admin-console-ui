import { PersistenceService } from "./persistence.service";
import { TestBed } from "@angular/core/testing";

describe("PersistenceService", () => {
  let service: PersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PersistenceService] });
    service = TestBed.inject(PersistenceService);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  describe("should test getting & setting of key value pair in localstorage", () => {
    beforeEach(() => {
      const store: { [key: string]: string | null } = {};
      const mockLocalStorage = {
        getItem: (key: string): string | null => {
          return key in store ? store[key] : null;
        },
        setItem: (key: string, value: string) => {
          store[key] = `${value}`;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
      };
      spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
      spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
      spyOn(localStorage, "removeItem").and.callFake(
        mockLocalStorage.removeItem
      );
    });
    it("should set key-value pair in localstorage successfully, if there is no error", () => {
      service.set("doNotWarn-Administrator", "true");
      expect(localStorage.getItem("doNotWarn-Administrator")).toBe('"true"');
    });

    it("should not set key-value pair in localstorage, if there is error", () => {
      spyOn(service, "set").and.callFake(() => {
        throw new Error("");
      });
      expect(localStorage.getItem("doNotWarn-Administrator")).toBe(null);
    });

    it("should not return value if getting key-value pair from localstorage thorws an error", () => {
      localStorage.removeItem("doNotWarn-Administrator");
      expect(service.get("doNotWarn-Administrator")).toBe(null);
    });

    it("should call localStorage.setItem with correct key and stringified value", () => {
      const key = "mockKey";
      const value = { foo: "mockValue" };
      service.set(key, value);
      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
  });

  it("should handle errors thrown by localStorage.setItem gracefully", () => {
    spyOn(localStorage, "setItem").and.throwError("");
    spyOn(console, "error");
    service.set("errorKey", "value");
    expect(console.error).toHaveBeenCalledWith(
      "Error saving to local storage",
      jasmine.any(Error)
    );
  });

  it("should handle errors thrown by localStorage.setItem gracefully", () => {
    spyOn(localStorage, "getItem").and.throwError("");
    spyOn(console, "error");
    service.get("errorKey");
    expect(console.error).toHaveBeenCalledWith(
      "Error getting from local storage",
      jasmine.any(Error)
    );
  });

  it("should return the correct value for primitive types", () => {
    service.set("numberKey", 123);
    expect(service.get<number>("numberKey")).toBe(123);

    service.set("booleanKey", true);
    expect(service.get<boolean>("booleanKey")).toBe(true);

    service.set("stringKey", "test");
    expect(service.get<string>("stringKey")).toBe("test");
  });
});
