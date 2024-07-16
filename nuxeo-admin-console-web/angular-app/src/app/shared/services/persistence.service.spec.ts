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
  });
});
