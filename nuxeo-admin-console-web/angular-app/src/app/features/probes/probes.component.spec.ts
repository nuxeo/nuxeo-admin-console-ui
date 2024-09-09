import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProbesComponent } from './probes.component';
import { StoreModule } from '@ngrx/store';
import { ProbeReducer } from '../sub-features/probes-data/store/reducers';
import { ProbesDataComponent } from '../sub-features/probes-data/components/probe-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HyContentListModule } from '@hyland/ui/content-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// Mock PROBES and PROBES_LABELS for testing
const mockPROBES = [
  { name: "repositoryStatus", displayName: "Repository" },
  { name: "runtimeStatus", displayName: "Runtime" },
  { name: "elasticSearchStatus", displayName: "Elasticsearch" },
  { name: "streamStatus", displayName: "Stream" },
  { name: "ldapDirectories", displayName: "LDAP Directories" },
];

const mockPROBES_LABELS = {
  PROBE_TITLE: "Probes",
  NEVER_EXECUTED: "Never Executed",
  CHECK_AGAIN: "Check Again",
  NOT_RUN: 'N/A',
  COLUMN_HEADERS: {
    PROBE: "Probe",
    SUCCESS: "Success",
    LAST_EXECUTED: "Last Executed",
    INFORMATION: "Information",
    RUN: 'Run',
    SUCCESS_COUNT: 'Success Count',
    FAILURE_COUNT: 'Failure Count',
    TIME: 'Time',
    HISTORY: 'History',
    STATUS: 'Status'
  },
  SUCCESS_STATUS_ICONS: {
    TRUE: "assets/images/check.svg",
    UNKNOWN: "assets/images/question.svg",
    FALSE: "assets/images/error.svg",
  },
};

describe('ProbesComponent', () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent, ProbesDataComponent], // Declare child component as well
      imports: [
        StoreModule.forRoot({ probes: ProbeReducer }), // Add store module for testing store integration
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;

    // Set mock data for testing
    component.PROBES = mockPROBES;
    component.PROBES_LABELS = mockPROBES_LABELS;

    fixture.detectChanges();
  });

  it("should create the ProbesComponent", () => {
    expect(component).toBeTruthy();
  });

  

  it("should render the title in the template", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector("#page-title");
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain(mockPROBES_LABELS.PROBE_TITLE);
  });

  it("should include the ProbesDataComponent", () => {
    const probesDataElement = fixture.debugElement.query(
      By.directive(ProbesDataComponent)
    );
    expect(probesDataElement).toBeTruthy();
    const probesDataComponent = probesDataElement.componentInstance as ProbesDataComponent;
    expect(probesDataComponent.summary).toBe(false);
  });
});
