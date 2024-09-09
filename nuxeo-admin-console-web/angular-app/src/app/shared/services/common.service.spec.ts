import { CommonService } from "./common.service";
import { TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

describe("CommonService", () => {
  let service: CommonService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CommonService] });
    service = TestBed.inject(CommonService);
    router = TestBed.inject(Router);
  });

  it("should test if service is created", () => {
    expect(service).toBeTruthy();
  });

  it("should test if loadApp is initialised", () => {
    expect(service.loadApp).toBeInstanceOf(EventEmitter<boolean>);
  });

  describe("removeLeadingCharacters", () => {
    it("should remove leading and trailing single quotes", () => {
      const input = "'test string'";
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe("test string");
    });

    it("should remove leading and trailing double quotes", () => {
      const input = '"test string"';
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe("test string");
    });

    it("should remove only the leading single quote if no trailing quote", () => {
      const input = "'test string";
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe("test string");
    });

    it("should remove only the leading double quote if no trailing quote", () => {
      const input = '"test string';
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe("test string");
    });

    it("should return the original string if there are no leading quotes", () => {
      const input = "test string";
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe("test string");
    });

    it("should return the original string if there are mismatched quotes", () => {
      const input = "'test string\"";
      const result = service.removeLeadingCharacters(input);
      expect(result).toBe('test string"');
    });
  });

  describe("decodeAndReplaceSingleQuotes", () => {
    it("should replace all single quotes with %5C%27", () => {
      const input = "test'string";
      const expectedOutput = "test%5C%27string";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });

    it("should decode URI components and replace single quotes", () => {
      const input = "test%27string%27with%27quotes";
      const expectedOutput = "test%27string%27with%27quotes";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });

    it("should handle strings without single quotes", () => {
      const input = "testStringWithoutQuotes";
      const expectedOutput = "testStringWithoutQuotes";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });

    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });

    it("should handle strings with only single quotes", () => {
      const input = "''";
      const expectedOutput = "%5C%27%5C%27";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });

    it("should handle strings with encoded characters and single quotes", () => {
      const input = "%27encoded%27%20characters%27";
      const expectedOutput = "%27encoded%27%20characters%27";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });
  });

 
    it('should navigate to /bulk-action-monitoring with the correct commandId', () => {
      spyOn(router, 'navigate');
      const commandId = '12345';
      service.redirectToBulkActionMonitoring(commandId);
      expect(router.navigate).toHaveBeenCalledWith(['/bulk-action-monitoring', commandId]);
    });

 
    it('should navigate to /probes', () => {
      spyOn(router, 'navigate');
      service.redirectToProbesDetails();
      expect(router.navigate).toHaveBeenCalledWith(['/probes']);
    });
});