import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationDetailsComponent } from './configuration-details.component';

describe('ConfigurationDetailsComponent', () => {
  let component: ConfigurationDetailsComponent;
  let fixture: ComponentFixture<ConfigurationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
