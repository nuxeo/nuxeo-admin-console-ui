import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NuxeoStreamProcessorInfoComponent } from './nuxeo-stream-processor-info.component';
import { StreamService } from '../../services/stream.service';
import { SharedMethodsService } from '../../../../shared/services/shared-methods.service';
import { ERROR_TYPES } from '../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants';

describe('NuxeoStreamProcessorInfoComponent', () => {
  let component: NuxeoStreamProcessorInfoComponent;
  let fixture: ComponentFixture<NuxeoStreamProcessorInfoComponent>;
  let mockStreamService: jasmine.SpyObj<StreamService>;
  let mockSharedService: jasmine.SpyObj<SharedMethodsService>;

  beforeEach(() => {
    mockStreamService = jasmine.createSpyObj('StreamService', ['getStreamProcessorInfo']);
    mockSharedService = jasmine.createSpyObj('SharedMethodsService', ['showActionErrorModal']);

    TestBed.configureTestingModule({
      declarations: [NuxeoStreamProcessorInfoComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        CommonModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: StreamService, useValue: mockStreamService },
        { provide: SharedMethodsService, useValue: mockSharedService }
      ]
    });
    fixture = TestBed.createComponent(NuxeoStreamProcessorInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isDataLoaded).toBe(false);
    expect(component.isError).toBe(false);
    expect(component.streamProcessorJsonData).toBeUndefined();
    expect(component.destroy$).toBeDefined();
    expect(component.NUXEO_STREAM_PROCESSOR_INFO_LABELS).toBeDefined();
    expect(component.GENERIC_API_LABELS).toBeDefined();
  });

  it('should call loadJsonData on ngOnInit', () => {
    spyOn(component, 'loadJsonData');
    component.ngOnInit();
    expect(component.loadJsonData).toHaveBeenCalled();
  });

  it('should load JSON data successfully when streamProcessorJsonData is null', () => {
    const mockData = { key: 'value', processors: ['proc1', 'proc2'] };
    mockStreamService.getStreamProcessorInfo.and.returnValue(of(mockData));
    component.streamProcessorJsonData = null;
    component.loadJsonData();
        expect(component.streamProcessorJsonData).toEqual(mockData);
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(false);
  });

  it('should handle error when loading JSON data fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { status: 500, message: 'Internal Server Error' }
    });
    mockStreamService.getStreamProcessorInfo.and.returnValue(throwError(() => errorResponse));
    component.streamProcessorJsonData = null;
    spyOn(component, 'showErrorMessage');
    component.loadJsonData();
    expect(component.isDataLoaded).toBe(true);
    expect(component.isError).toBe(true);
    expect(component.showErrorMessage).toHaveBeenCalledWith(errorResponse.error);
  });

  it('should show error message correctly', () => {
    const errorResponse = new HttpErrorResponse({
      error: { status: 404, message: 'Resource not found' }
    });
    component.showErrorMessage(errorResponse);
    expect(mockSharedService.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: errorResponse.status,
        message: errorResponse.message
      }
    });
  });

  describe('isValidData', () => {
    it('should return false for null data', () => {
      expect(component.isValidData(null)).toBe(false);
    });

    it('should return false for undefined data', () => {
      expect(component.isValidData(undefined)).toBe(false);
    });

    it('should return false for empty object', () => {
      expect(component.isValidData({})).toBe(false);
    });

    it('should return true for non-empty object', () => {
      expect(component.isValidData({ key: 'value' })).toBe(true);
    });

    it('should return true for object with multiple properties', () => {
      expect(component.isValidData({ prop1: 'value1', prop2: 'value2' })).toBe(true);
    });
  });

  it('should call destroy$ subject on ngOnDestroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  it('should have correct constant values', () => {
    expect(component.NUXEO_STREAM_PROCESSOR_INFO_LABELS).toBeDefined();
    expect(component.GENERIC_API_LABELS).toBeDefined();
  });

  it('should set isError to false when loading data successfully', () => {
    component.streamProcessorJsonData = null;
    component.isError = true;
    mockStreamService.getStreamProcessorInfo.and.returnValue(of({}));
    component.loadJsonData();
    expect(component.isError).toBe(false);
  });

  it('should set isDataLoaded to true after loading data', () => {
    component.streamProcessorJsonData = null;
    component.isDataLoaded = false;
    mockStreamService.getStreamProcessorInfo.and.returnValue(of({}));
    component.loadJsonData();
    expect(component.isDataLoaded).toBe(true);
  });

  it('should handle undefined data in isValidData', () => {
    expect(component.isValidData(undefined)).toBe(false);
  });

  it('should handle falsy values in isValidData', () => {
    expect(component.isValidData(0)).toBe(false);
    expect(component.isValidData('')).toBe(false);
    expect(component.isValidData(false)).toBe(false);
  });

  it('should reset flags correctly when reloading data after error', () => {
    component.streamProcessorJsonData = null;
    component.isError = true;
    component.isDataLoaded = true;
    const mockData = { test: 'data' };
    mockStreamService.getStreamProcessorInfo.and.returnValue(of(mockData));
    component.loadJsonData();
    expect(component.isError).toBe(false);
    expect(component.isDataLoaded).toBe(true);
    expect(component.streamProcessorJsonData).toEqual(mockData);
  });

  it('should handle error with null status and message', () => {
    const errorResponse = new HttpErrorResponse({
      error: { status: 0, message: '' }
    });
    
    component.showErrorMessage(errorResponse);
    
    expect(mockSharedService.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: 0,
        message: errorResponse.message
      }
    });
  });

  it('should complete destroy$ subject and call next on ngOnDestroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalledWith();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
