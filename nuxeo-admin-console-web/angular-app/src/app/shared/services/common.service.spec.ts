import { CommonService } from "./common.service";
import { TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

describe("CommonService", () => {
  let service: CommonService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CommonService] });
    service = TestBed.inject(CommonService);
    router = TestBed.inject(Router);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  it("should test if loadApp is initialised", () => {
    expect(service.loadApp).toBeInstanceOf(EventEmitter<boolean>);
  });

 

  it("should navigate to /bulk-action-monitoring with the correct commandId", () => {
    spyOn(router, "navigate");
    const commandId = "12345";
    service.redirectToBulkActionMonitoring(commandId);
    expect(router.navigate).toHaveBeenCalledWith([
      "/bulk-action-monitoring",
      commandId,
    ]);
  });

  it("should navigate to /probes", () => {
    spyOn(router, "navigate");
    service.redirectToProbesDetails();
    expect(router.navigate).toHaveBeenCalledWith(["/probes"]);
  });
});
