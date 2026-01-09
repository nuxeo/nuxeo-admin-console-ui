import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { beforeEach, describe, expect, it, type MockedObject, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { HomeService } from "../services/home.service";
import { loadVersionInfoEffect, loadInstanceInfoEffect } from "./effects";
import * as HomeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";
describe("HomeEffects", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

    const actions$: Observable<Action> = of();
    let loadVersionInfo: typeof loadVersionInfoEffect;
    let loadInstanceInfo: typeof loadInstanceInfoEffect;
    let homeService: MockedObject<HomeService>;

    beforeEach(() => {
        const homeServiceSpy = {
            getVersionInfo: vi.fn().mockName("HomeService.getVersionInfo"),
            getProbesInfo: vi.fn().mockName("HomeService.getProbesInfo"),
            getInstanceInfo: vi.fn().mockName("HomeService.getInstanceInfo")
        };
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideMockActions(() => actions$),
                provideMockStore(),
                { provide: HomeService, useValue: homeServiceSpy },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        homeService = TestBed.inject(HomeService) as MockedObject<HomeService>;
        loadVersionInfo = TestBed.runInInjectionContext(() => loadVersionInfoEffect);
        loadInstanceInfo = TestBed.runInInjectionContext(() => loadInstanceInfoEffect);
    });

    describe("loadVersionInfoEffect", () => {
        it("should return fetchversionInfoSuccess on success", async () => {
            const versionInfoData = {
                server: { distributionVersion: "1.0.0" },
                cluster: { enabled: true },
            };
            homeService.getVersionInfo.mockReturnValue(of(versionInfoData));
            const outcome = HomeActions.fetchversionInfoSuccess({
                versionInfo: { version: "1.0.0", clusterEnabled: true },
            });
            const actionsMock$ = of(HomeActions.fetchversionInfo());
            loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });

        it("should return fetchversionInfoFailure on failure", async () => {
            const error = new HttpErrorResponse({
                error: "404",
                status: 404,
                statusText: "Not Found",
            });
            homeService.getVersionInfo.mockReturnValue(throwError(() => error));
            const outcome = HomeActions.fetchversionInfoFailure({ error });
            const actionsMock$ = of(HomeActions.fetchversionInfo());
            loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });
    });

    describe("loadVersionInfoEffect", () => {
        it("should return fetchversionInfoSuccess on success", async () => {
            const versionInfoData = {
                server: { distributionVersion: "1.0.0" },
                cluster: { enabled: true },
            };
            homeService.getVersionInfo.mockReturnValue(of(versionInfoData));
            const outcome = HomeActions.fetchversionInfoSuccess({
                versionInfo: { version: "1.0.0", clusterEnabled: true },
            });
            const actionsMock$ = of(HomeActions.fetchversionInfo());
            loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });

        it("should return fetchversionInfoFailure on failure", async () => {
            const error = new HttpErrorResponse({
                error: "404",
                status: 404,
                statusText: "Not Found",
            });
            homeService.getVersionInfo.mockReturnValue(throwError(() => error));
            const outcome = HomeActions.fetchversionInfoFailure({ error });
            const actionsMock$ = of(HomeActions.fetchversionInfo());
            loadVersionInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });
    });

    describe("loadInstanceInfoEffect", () => {
        it("should return fetchInstanceInfoSuccess on success", async () => {
            const instanceInfoData = {
                registered: true,
                instanceType: "dev",
            } as InstanceInfo;
            homeService.getInstanceInfo.mockReturnValue(of(instanceInfoData));
            const outcome = HomeActions.fetchInstanceInfoSuccess({
                instanceInfo: instanceInfoData,
            });
            const actionsMock$ = of(HomeActions.fetchInstanceInfo());
            loadInstanceInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });

        it("should return fetchInstanceInfoFailure on failure", async () => {
            const error = new HttpErrorResponse({
                error: "404",
                status: 404,
                statusText: "Not Found",
            });
            homeService.getInstanceInfo.mockReturnValue(throwError(() => error));
            const outcome = HomeActions.fetchInstanceInfoFailure({ error });
            const actionsMock$ = of(HomeActions.fetchInstanceInfo());
            loadInstanceInfo(actionsMock$, homeService).subscribe((result: Action) => {
                expect(result).toEqual(outcome);
                ;
            });
        });
    });
});
