import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FetchConsumerPositionComponent } from "./fetch-consumer-position.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { SharedMethodsService } from "../../../../../shared/services/shared-methods.service";
import { of } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from "@angular/material/select";
import * as StreamActions from "../../../store/actions";

describe("FetchConsumerPositionComponent", () => {
  let component: FetchConsumerPositionComponent;
  let fixture: ComponentFixture<FetchConsumerPositionComponent>;
  let storeSpy: any;
  let dialogSpy: any;
  let sharedMethodsSpy: any;

  beforeEach(() => {
    storeSpy = {
      pipe: jasmine.createSpy().and.returnValue(of([])),
      select: jasmine.createSpy().and.returnValue(of(true)),
      dispatch: jasmine.createSpy(),
    };
    dialogSpy = {};
    sharedMethodsSpy = {
      showActionErrorModal: jasmine.createSpy().and.returnValue(of({})),
    };

    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        CommonModule,
        BrowserAnimationsModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
      declarations: [FetchConsumerPositionComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SharedMethodsService, useValue: sharedMethodsSpy },
        FormBuilder,
      ],
    });
    fixture = TestBed.createComponent(FetchConsumerPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize fetchConsumerForm with required controls", () => {
    expect(component.fetchConsumerForm.contains("stream")).toBeTrue();
    expect(component.fetchConsumerForm.contains("consumer")).toBeTrue();
    expect(component.fetchConsumerForm.get("stream")?.validator).toBeTruthy();
    expect(component.fetchConsumerForm.get("consumer")?.validator).toBeTruthy();
  });

  it("should call store.dispatch on fetchConsumerPositionDetails", () => {
    component.fetchConsumerForm.patchValue({
      stream: "stream1",
      consumer: "consumer1",
    });
    component.fetchConsumerPositionDetails();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should call store.dispatch on clearRecords", () => {
    component.clearRecords();
    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(component.getConsumerPositionData).toEqual([]);
  });

  it("should call store.dispatch on ngOnDestroy", () => {
    component.ngOnDestroy();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should patch form and dispatch fetchConsumers on onStreamChange", () => {
    component.onStreamChange("stream2");
    expect(component.fetchConsumerForm.get("stream")?.value).toBe("stream2");
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("isValidData should return false for null or empty object", () => {
    expect(component.isValidData(null)).toBeFalse();
    expect(component.isValidData({})).toBeFalse();
  });

  it("isValidData should return true for non-empty object", () => {
    expect(component.isValidData({ a: 1 })).toBeTrue();
  });

  it("should set isFetchConsumerPositionBtnDisabled to true if fetchStreamsError$ emits error", () => {
    storeSpy.pipe.and.callFake((...args: any[]) => {
      if (args[0].name === "select") return of(new Error("error"));
      return of([]);
    });
    component.ngOnInit();
    expect(component.isFetchConsumerPositionBtnDisabled).toBeTrue();
  });

  it("should handle fetchStreamsSuccess with data", () => {
    const mockStreams = [{ name: "mockStream1" }, { name: "mockStream2" }];
    component.fetchStreamsSuccess$ = of(mockStreams);
    component.ngOnInit();
    expect(component.streams).toEqual(mockStreams);
    expect(component.fetchConsumerForm.get("stream")?.value).toBe(
      "mockStream1"
    );
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchConsumers({
        params: { stream: "mockStream1" },
      })
    );
  });

  it("should dispatch fetchStreams action when streams data is not loaded", () => {
    storeSpy.select.and.returnValue(of(false));
    storeSpy.pipe.and.returnValue(of(false));
    component.ngOnInit();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchStreams()
    );
  });

  it("should not dispatch fetchStreams action when streams data is already loaded", () => {
    storeSpy.select.and.returnValue(of(true));
    storeSpy.pipe.and.returnValue(of(true));
    component.ngOnInit();
    expect(storeSpy.dispatch).not.toHaveBeenCalledWith(
      StreamActions.fetchStreams()
    );
  });

  it("should set consumers and selectedConsumer on fetchConsumersSuccess$", () => {
    const consumersData = [
      { stream: "mock/stream", consumer: "mock/consumer" },
    ];
    component.fetchConsumersSuccess$ = of(consumersData);
    component.ngOnInit();
    expect(component.consumers).toEqual(consumersData);
    expect(component.selectedConsumer).toBe("mock/consumer");
  });
});
