import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamRecordsStatusComponent } from './stream-records-status.component';
import { By } from '@angular/platform-browser';

describe('StreamRecordsStatusComponent', () => {
  let component: StreamRecordsStatusComponent;
  let fixture: ComponentFixture<StreamRecordsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamRecordsStatusComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamRecordsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update recordsFetchedStatusText when input changes', () => {
    const newStatus = 'Records Fetched';
    component.recordsFetchedStatusText = newStatus;
    fixture.detectChanges();

    expect(component.recordsFetchedStatusText).toBe(newStatus);

    const statusElement: HTMLElement = fixture.nativeElement.querySelector('.stream-records-status span:last-child');
    expect(statusElement.textContent).toContain(newStatus);
  });

  it('should display the correct initial recordsFetchedStatusText value', () => {
    component.recordsFetchedStatusText = 'Initial Status';
    fixture.detectChanges();

    const statusElement: HTMLElement = fixture.nativeElement.querySelector('.stream-records-status span:last-child');
    expect(statusElement.textContent).toContain('Initial Status');
  });

  it('should display red dot when fetching records and green dot when records are fetched', () => {
    component.isFetchingRecords = true;
    fixture.detectChanges();

    let redDot = fixture.debugElement.query(By.css('.dot.red-dot'));
    let greenDot = fixture.debugElement.query(By.css('.dot.green-dot'));

    expect(redDot).toBeTruthy();
    expect(greenDot).toBeFalsy();

    component.isFetchingRecords = false;
    fixture.detectChanges();

    redDot = fixture.debugElement.query(By.css('.dot.red-dot'));
    greenDot = fixture.debugElement.query(By.css('.dot.green-dot'));

    expect(redDot).toBeFalsy();
    expect(greenDot).toBeTruthy();
  });
});
