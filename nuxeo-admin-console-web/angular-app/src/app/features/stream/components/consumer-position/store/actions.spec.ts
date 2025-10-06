import * as Actions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

describe("Change Consumer Position Actions", () => {
  it("should create onChangeConsumerPosition action", () => {
    const consumerPosition = "latest";
    const params = { stream: "test-stream", consumer: "test-consumer" };
    const action = Actions.onChangeConsumerPosition({
      consumerPosition,
      params,
    });
    expect(action.type).toBe(
      "[Change Consumer Position] Change Consumer Position"
    );
    expect(action.consumerPosition).toBe(consumerPosition);
    expect(action.params).toEqual(params);
  });

  it("should create onChangeConsumerPositionSuccess action", () => {
    const data = { result: "success" };
    const action = Actions.onChangeConsumerPositionSuccess(data);
    expect(action.type).toBe(
      "[Change Consumer Position] Change Consumer Position Success"
    );
    expect(action.data).toEqual(data);
  });

  it("should create onChangeConsumerPositionFailure action", () => {
    const error = new HttpErrorResponse({ error: "error", status: 400 });
    const action = Actions.onChangeConsumerPositionFailure({ error });
    expect(action.type).toBe(
      "[Change Consumer Position] Change Consumer Position Failure"
    );
    expect(action.error).toBe(error);
  });

  it("should create resetConsumerPositionData action", () => {
    const action = Actions.resetConsumerPositionData();
    expect(action.type).toBe(
      "[Change Consumer Position] Reset Consumer Position Data"
    );
  });
});
