import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { describe, expect, it, vi } from "vitest";
import {
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { firstValueFrom, of } from "rxjs";
import { AuthInterceptorService } from "./auth-interceptor.service";

describe("AuthInterceptorService", () => {
  initializeTestBed();

  const interceptor = new AuthInterceptorService();

  it("should forward requests without injecting an authorization header", async () => {
    const request = new HttpRequest("GET", "/api/test", null, {
      headers: new HttpHeaders({
        "X-Test": "value",
      }),
    });
    const next = {
      handle: vi.fn((forwardedRequest: HttpRequest<unknown>) => {
        expect(forwardedRequest).toBe(request);
        expect(forwardedRequest.headers.get("Authorization")).toBeNull();
        expect(forwardedRequest.headers.get("X-Test")).toBe("value");

        return of(new HttpResponse({ status: 200 }));
      }),
    } as HttpHandler;

    await firstValueFrom(interceptor.intercept(request, next));

    expect(next.handle).toHaveBeenCalledOnce();
  });

  it("should preserve an existing authorization header", async () => {
    const request = new HttpRequest("GET", "/api/test", null, {
      headers: new HttpHeaders({
        Authorization: "******",
      }),
    });
    const next = {
      handle: vi.fn((forwardedRequest: HttpRequest<unknown>) => {
        expect(forwardedRequest).toBe(request);
        expect(forwardedRequest.headers.get("Authorization")).toBe(
          "******"
        );

        return of(new HttpResponse({ status: 200 }));
      }),
    } as HttpHandler;

    await firstValueFrom(interceptor.intercept(request, next));

    expect(next.handle).toHaveBeenCalledOnce();
  });
});
