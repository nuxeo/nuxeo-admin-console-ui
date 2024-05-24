import { AdminCommonService } from "./admin-common.service";
import { TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";

describe("AdminCommonService", () => {
  let service: AdminCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AdminCommonService] });
    service = TestBed.inject(AdminCommonService);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  it("should test if loadApp is initialised", () => {
    expect(service.loadApp).toBeInstanceOf(EventEmitter<Boolean>);
  });
});
