import { PersistenceService } from "./persistence.service";
import { TestBed } from "@angular/core/testing";

describe("PersistenceService", () => {
  let service: PersistenceService;
  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PersistenceService] });
    service = TestBed.inject(PersistenceService);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  describe("should test getting & setting of key value pair in localstorage", () => {
    beforeEach(() => {
      let store: { [key: string]: any } = {};
      const mockLocalStorage = {
        getItem: (key: string): string => {
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
      service.set("doNotWarn", "true");
      expect(localStorage.getItem("doNotWarn")).toBe('"true"');
    });

    it("should not set key-value pair in localstorage, if there is error", () => {
      spyOn(service, "set").and.callFake(() => {
        throw new Error("");
      });
      expect(localStorage.getItem("doNotWarn")).toBe(null);
    });

    it("should not return value if getting key-value pair from localstorage thorws an error", () => {
      localStorage.removeItem("doNotWarn");
      expect(service.get("doNotWarn")).toBe(null);
    });
  });
});
