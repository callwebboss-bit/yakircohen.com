import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createEscapeStack,
  type EscapeEventLike,
} from "@/hooks/useEscapeLayer";

type FakeEvent = EscapeEventLike & { target: EventTarget | null };

function keyEvent(
  init: Partial<Pick<FakeEvent, "key" | "isComposing" | "repeat">> & {
    prevented?: boolean;
    target?: EventTarget | null;
  } = {},
): FakeEvent {
  const event: FakeEvent = {
    key: init.key ?? "Escape",
    isComposing: init.isComposing ?? false,
    repeat: init.repeat ?? false,
    defaultPrevented: init.prevented ?? false,
    target: init.target ?? null,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };
  return event;
}

function makeEnv(opts: { modalOpen?: boolean; editable?: boolean } = {}) {
  const deferred: Array<() => void> = [];
  const state = {
    modalOpen: opts.modalOpen ?? false,
    editable: opts.editable ?? false,
    nonEmpty: 0,
    empty: 0,
  };
  const stack = createEscapeStack<FakeEvent>({
    defer: (fn) => deferred.push(fn),
    modalOpen: () => state.modalOpen,
    isEditable: () => state.editable,
    onNonEmpty: () => {
      state.nonEmpty += 1;
    },
    onEmpty: () => {
      state.empty += 1;
    },
  });
  const flush = () => {
    while (deferred.length > 0) deferred.shift()?.();
  };
  return { stack, state, flush };
}

describe("createEscapeStack: interactive layers", () => {
  it("only the top layer consumes Escape, and marks the event as handled", () => {
    const { stack } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("drawer") });
    stack.push({ handler: () => calls.push("search") });

    const first = keyEvent();
    stack.dispatch(first);
    assert.deepEqual(calls, ["search"]);
    assert.equal(first.defaultPrevented, true);
  });

  it("after the top layer is removed the next one gets the key", () => {
    const { stack } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("drawer") });
    const releaseSearch = stack.push({ handler: () => calls.push("search") });

    stack.dispatch(keyEvent());
    releaseSearch();
    stack.dispatch(keyEvent());
    assert.deepEqual(calls, ["search", "drawer"]);
  });

  it("ignores other keys, repeats, IME composition and events someone else already handled", () => {
    const { stack } = makeEnv();
    let calls = 0;
    stack.push({ handler: () => (calls += 1) });

    stack.dispatch(keyEvent({ key: "Tab" }));
    stack.dispatch(keyEvent({ key: "Enter" }));
    stack.dispatch(keyEvent({ repeat: true }));
    stack.dispatch(keyEvent({ isComposing: true }));
    stack.dispatch(keyEvent({ prevented: true }));
    assert.equal(calls, 0);

    stack.dispatch(keyEvent());
    assert.equal(calls, 1);
  });

  it("an empty stack does nothing and leaves the event alone", () => {
    const { stack } = makeEnv();
    const event = keyEvent();
    stack.dispatch(event);
    assert.equal(event.defaultPrevented, false);
  });

  it("release is safe to call twice", () => {
    const { stack, state } = makeEnv();
    const release = stack.push({ handler: () => {} });
    release();
    release();
    assert.equal(stack.size(), 0);
    assert.equal(state.empty, 1);
  });

  it("reports the first push and the last removal (listener attach and detach)", () => {
    const { stack, state } = makeEnv();
    const releaseA = stack.push({ handler: () => {} });
    const releaseB = stack.push({ handler: () => {} });
    assert.equal(state.nonEmpty, 1);
    releaseA();
    assert.equal(state.empty, 0);
    releaseB();
    assert.equal(state.empty, 1);
    stack.push({ handler: () => {} });
    assert.equal(state.nonEmpty, 2);
  });
});

describe("createEscapeStack: ambient (self-opening popup) layers", () => {
  it("an ambient layer sits below an interactive one even when it registered later", () => {
    const { stack, flush } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("chat") });
    stack.push({ handler: () => calls.push("gift"), ambient: true });

    stack.dispatch(keyEvent());
    flush();
    assert.deepEqual(calls, ["chat"]);
  });

  it("with no interactive layer open, the ambient layer closes after the event finished", () => {
    const { stack, flush } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("gift"), ambient: true });

    const event = keyEvent();
    stack.dispatch(event);
    assert.equal(calls.length, 0, "must wait for the other listeners first");
    flush();
    assert.deepEqual(calls, ["gift"]);
    assert.equal(event.defaultPrevented, false, "ambient layers never mark the key as consumed");
  });

  it("yields when another listener (Radix, a legacy handler) prevented the event meanwhile", () => {
    const { stack, flush } = makeEnv();
    let calls = 0;
    stack.push({ handler: () => (calls += 1), ambient: true });

    const event = keyEvent();
    stack.dispatch(event);
    event.preventDefault();
    flush();
    assert.equal(calls, 0);
  });

  it("yields while a modal dialog is open", () => {
    const { stack, state, flush } = makeEnv({ modalOpen: true });
    let calls = 0;
    stack.push({ handler: () => (calls += 1), ambient: true });

    stack.dispatch(keyEvent());
    flush();
    assert.equal(calls, 0);

    state.modalOpen = false;
    stack.dispatch(keyEvent());
    flush();
    assert.equal(calls, 1);
  });

  it("yields when the modal that consumed the Escape closed before the deferred check", () => {
    const { stack, state, flush } = makeEnv({ modalOpen: true });
    let calls = 0;
    stack.push({ handler: () => (calls += 1), ambient: true });

    stack.dispatch(keyEvent());
    // המודאל נסגר מה-Escape עצמו, לפני שה-defer רץ
    state.modalOpen = false;
    flush();
    assert.equal(calls, 0);
  });

  it("yields when focus is in a text field, unless the layer allows it", () => {
    const { stack, flush } = makeEnv({ editable: true });
    const calls: string[] = [];
    const releaseGift = stack.push({ handler: () => calls.push("gift"), ambient: true });

    stack.dispatch(keyEvent());
    flush();
    assert.equal(calls.length, 0);

    releaseGift();
    stack.push({
      handler: () => calls.push("idle-help"),
      ambient: true,
      allowInFields: true,
    });
    stack.dispatch(keyEvent());
    flush();
    assert.deepEqual(calls, ["idle-help"]);
  });

  it("only the newest ambient layer handles one Escape, the next press reaches the older one", () => {
    const { stack, flush } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("pwa"), ambient: true });
    const releaseGift = stack.push({ handler: () => calls.push("gift"), ambient: true });

    stack.dispatch(keyEvent());
    flush();
    assert.deepEqual(calls, ["gift"]);

    releaseGift();
    stack.dispatch(keyEvent());
    flush();
    assert.deepEqual(calls, ["gift", "pwa"]);
  });

  it("does nothing when the layer was removed before the deferred check ran", () => {
    const { stack, flush } = makeEnv();
    let calls = 0;
    const release = stack.push({ handler: () => (calls += 1), ambient: true });

    stack.dispatch(keyEvent());
    release();
    flush();
    assert.equal(calls, 0);
  });

  it("does nothing when an interactive layer opened before the deferred check ran", () => {
    const { stack, flush } = makeEnv();
    const calls: string[] = [];
    stack.push({ handler: () => calls.push("gift"), ambient: true });

    stack.dispatch(keyEvent());
    stack.push({ handler: () => calls.push("menu") });
    flush();
    assert.equal(calls.length, 0);
  });
});
