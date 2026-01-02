import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigurationDetailsComponent } from './configuration-details.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigurationDetailsComponent', () => {
  let component: ConfigurationDetailsComponent;
  let fixture: ComponentFixture<ConfigurationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationDetailsComponent],
      imports: [MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
