import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamRecordsComponent } from './stream-records.component';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('StreamRecordsComponent', () => {
    let component: StreamRecordsComponent;
    let fixture: ComponentFixture<StreamRecordsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StreamRecordsComponent],
            imports: [MatCardModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamRecordsComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have default clearSearch value as false', () => {
        expect(component.clearSearch).toBe(false);
    });

    it('should accept clearSearch input property', () => {
        component.clearSearch = true;
        fixture.detectChanges();
        expect(component.clearSearch).toBe(true);
    });

    it('should render json viewer with clearSearch binding', () => {
        component.records = [{ type: 'record' }];
        component.clearSearch = true;
        fixture.detectChanges();
        
        const jsonViewer = fixture.debugElement.nativeElement.querySelector('custom-nuxeo-json-viewer');
        expect(jsonViewer).toBeTruthy();
    });
});
