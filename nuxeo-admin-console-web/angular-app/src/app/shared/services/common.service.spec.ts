import { CommonService } from "./common.service";
import { TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";

describe("CommonService", () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CommonService] });
    service = TestBed.inject(CommonService);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  it("should test if loadApp is initialised", () => {
    expect(service.loadApp).toBeInstanceOf(EventEmitter<boolean>);
  });
});
