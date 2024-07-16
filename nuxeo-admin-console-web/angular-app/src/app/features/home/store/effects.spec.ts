import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { HomeService } from "../services/home.service";
import { loadVersionInfoEffect } from "./effects";
import * as HomeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

describe("HomeEffects", () => {
  let actions$: Observable<Action>;
  let effect: typeof loadVersionInfoEffect;
  let homeService: jasmine.SpyObj<HomeService>;

  beforeEach(() => {
    const homeServiceSpy = jasmine.createSpyObj("HomeService", [
      "getVersionInfo",
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: HomeService, useValue: homeServiceSpy },
      ],
    });
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    effect = TestBed.runInInjectionContext(() => loadVersionInfoEffect);
  });

  it("should return fetchversionInfoFailure on failure", (done) => {
    const error = new HttpErrorResponse({
      error: "404",
      status: 404,
      statusText: "Not Found",
    });
    homeService.getVersionInfo.and.returnValue(throwError(() => error));
    const outcome = HomeActions.fetchversionInfoFailure({ error });
    const actionsMock$ = of(HomeActions.fetchversionInfo());
    effect(actionsMock$, homeService).subscribe((result: Action) => {
      expect(result).toEqual(outcome);
      done();
    });
  });
});
