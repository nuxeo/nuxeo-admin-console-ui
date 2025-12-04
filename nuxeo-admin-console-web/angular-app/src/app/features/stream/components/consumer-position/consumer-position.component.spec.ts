import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsumerPositionComponent } from "./consumer-position.component";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { MAIN_TAB_LABELS } from "../../stream.constants";
import { MatTabsModule } from "@angular/material/tabs";

describe("ConsumerPositionComponent", () => {
  let component: ConsumerPositionComponent;
  let fixture: ComponentFixture<ConsumerPositionComponent>;
  let routerMock: any;
  let activatedRouteMock: any;
  let eventsSubject: Subject<any>;

  beforeEach(() => {
    eventsSubject = new Subject<any>();

    routerMock = {
      navigate: jasmine.createSpy("navigate"),
      events: eventsSubject.asObservable(),
    };

    activatedRouteMock = {
      firstChild: null,
    };

    TestBed.configureTestingModule({
      imports: [MatTabsModule],
      declarations: [ConsumerPositionComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    fixture = TestBed.createComponent(ConsumerPositionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should redirect to default tab if no child route on init", () => {
    activatedRouteMock.firstChild = null;
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [
        MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
          .GET_CONSUMER_POSITION.ROUTE_LABEL,
      ],
      { relativeTo: activatedRouteMock }
    );
  });

  it("should sync tab index from route on init if child exists", () => {
    activatedRouteMock.firstChild = {
      snapshot: {
        url: [
          {
            path: MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
              .GET_CONSUMER_POSITION.ROUTE_LABEL,
          },
        ],
      },
    };
    spyOn(component, "syncTabIndexFromRoute");
    component.ngOnInit();
    expect(component.syncTabIndexFromRoute).toHaveBeenCalled();
  });

  it("should update tab index to GET_CONSUMER_POSITION in syncTabIndexFromRoute", () => {
    activatedRouteMock.firstChild = {
      snapshot: {
        url: [
          {
            path: MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
              .GET_CONSUMER_POSITION.ROUTE_LABEL,
          },
        ],
      },
    };
    component.syncTabIndexFromRoute();
    expect(component.selectedTabIndex).toBe(
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.GET_CONSUMER_POSITION.ID
    );
  });

  it("should update tab index to CHANGE_CONSUMER_POSITION in syncTabIndexFromRoute", () => {
    activatedRouteMock.firstChild = {
      snapshot: {
        url: [
          {
            path: MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
              .CHANGE_CONSUMER_POSITION.ROUTE_LABEL,
          },
        ],
      },
    };
    component.syncTabIndexFromRoute();
    expect(component.selectedTabIndex).toBe(
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.CHANGE_CONSUMER_POSITION
        .ID
    );
  });

  it("should navigate to CHANGE_CONSUMER_POSITION route on tab change", () => {
    component.onSubTabChange(
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.CHANGE_CONSUMER_POSITION
        .ID
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [
        MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
          .CHANGE_CONSUMER_POSITION.ROUTE_LABEL,
      ],
      { relativeTo: activatedRouteMock }
    );
  });

  it("should navigate to GET_CONSUMER_POSITION route on tab change", () => {
    component.onSubTabChange(
      MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.GET_CONSUMER_POSITION.ID
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [
        MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS.GET_CONSUMER_POSITION
          .ROUTE_LABEL,
      ],
      { relativeTo: activatedRouteMock }
    );
  });

  it("should call syncTabIndexFromRoute on NavigationEnd event", () => {
    activatedRouteMock.firstChild = {
      snapshot: {
        url: [
          {
            path: MAIN_TAB_LABELS.CONSUMER_POSITION.SUB_TAB_LABELS
              .GET_CONSUMER_POSITION.ROUTE_LABEL,
          },
        ],
      },
    };
    spyOn(component, "syncTabIndexFromRoute");
    component.ngOnInit();
    eventsSubject.next(new NavigationEnd(1, "/test", "/test"));
    expect(component.syncTabIndexFromRoute).toHaveBeenCalled();
  });

  it("should complete destroy$ on ngOnDestroy", () => {
    const spy = spyOn(component.destroy$, "complete").and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
