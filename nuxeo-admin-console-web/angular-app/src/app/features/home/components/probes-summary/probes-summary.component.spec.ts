import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProbesSummaryComponent } from './probes-summary.component';
import { Store, StoreModule } from '@ngrx/store';
import { ProbeReducer, ProbeState } from '../../../sub-features/probes-data/store/reducers';
import { ProbesDataComponent } from '../../../sub-features/probes-data/components/probe-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HyContentListModule } from '@hyland/ui/content-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';


describe('ProbesSummaryComponent', () => {
  let component: ProbesSummaryComponent;
  let fixture: ComponentFixture<ProbesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesSummaryComponent, ProbesDataComponent], 
      imports: [
        StoreModule.forRoot({ probes: ProbeReducer }), 
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
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
