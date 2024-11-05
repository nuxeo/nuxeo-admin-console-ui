import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProbesSummaryComponent } from './probes-summary.component';
import {  StoreModule } from '@ngrx/store';
import { ProbeDataReducer } from '../../../sub-features/probes-data/store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HyContentListModule } from '@hyland/ui/content-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ProbesDataComponent } from '../../../sub-features/probes-data/components/probes-data.component';

describe('ProbesSummaryComponent', () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;

  beforeEach(async () => {
    // const toastServiceSpy = jasmine.createSpyObj("HyToastService", [
    //   "success",
    //   "error",
    // ]);
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent, ProbesDataComponent], 
      imports: [
        StoreModule.forRoot({ probes: ProbeDataReducer }), 
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        HyContentListModule,
        BrowserAnimationsModule,
      ],
    //  providers: [{ provide: HyToastService, useValue: toastServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the ProbesSummaryComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should pass the 'summary' input as true to ProbesDataComponent", () => {
    const probesDataElement = fixture.debugElement.query(
      By.directive(ProbesDataComponent)
    );
    const probesDataComponent = probesDataElement.componentInstance as ProbesDataComponent;
    expect(probesDataComponent.summary).toBe(true);
  });
});
