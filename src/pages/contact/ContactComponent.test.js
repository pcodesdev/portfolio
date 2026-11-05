import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Contact from "./ContactComponent";

jest.mock("../../components/motion/Reveal", () => ({
  Fade: ({ children }) => children,
}));
jest.mock("../../components/header/Header", () => () => null);
jest.mock("../../components/footer/Footer", () => () => null);
jest.mock("../../components/topButton/TopButton", () => () => null);
jest.mock("../../components/socialMedia/SocialMedia", () => () => null);

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
  dark: "#001c55",
};

let container;
let originalFetch;
let originalFormData;
let contactInstance;

function submit(form) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  act(() => form.dispatchEvent(event));
}

function fillForm(form) {
  form.querySelector("[name='name']").value = "Test Sender";
  form.querySelector("[name='email']").value = "test@example.com";
  form.querySelector("[name='_subject']").value = "Portfolio test";
  form.querySelector("[name='message']").value = "A test message body.";
}

beforeEach(() => {
  container = document.createElement("div");
  originalFetch = global.fetch;
  originalFormData = global.FormData;
  global.FormData = jest.fn(() => ({}));
  const contactRef = React.createRef();
  ReactDOM.render(<Contact ref={contactRef} theme={theme} />, container);
  contactInstance = contactRef.current;
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  if (originalFetch === undefined) delete global.fetch;
  else global.fetch = originalFetch;
  global.FormData = originalFormData;
});

test("required fields and email format are enforced before sending", () => {
  const form = container.querySelector("form");
  const button = form.querySelector("button[type='submit']");
  const email = form.querySelector("[name='email']");

  expect(
    ["name", "email", "_subject", "message"].every(
      (name) => form.querySelector(`[name='${name}']`).required
    )
  ).toBe(true);
  expect(email.type).toBe("email");
  email.value = "not-an-email";
  expect(email.checkValidity()).toBe(false);
  expect(button.textContent).toBe("Send Message");
});

test("shows loading, prevents duplicate submissions, and reports accepted provider response", async () => {
  fillForm(container.querySelector("form"));
  let resolveRequest;
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
  );
  const form = container.querySelector("form");
  jest.spyOn(form, "reportValidity").mockReturnValue(true);

  let pendingSubmission;
  act(() => {
    pendingSubmission = contactInstance.handleSubmit({
      preventDefault: jest.fn(),
      currentTarget: form,
    });
  });
  expect(container.querySelector("button[type='submit']").disabled).toBe(true);
  expect(container.querySelector("button[type='submit']").textContent).toBe(
    "Sending..."
  );
  act(() => {
    contactInstance.handleSubmit({
      preventDefault: jest.fn(),
      currentTarget: form,
    });
  });
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toContain("njugunapm23@gmail.com");

  await act(async () => {
    resolveRequest({ ok: true, json: async () => ({ success: "true" }) });
    await pendingSubmission;
  });
  expect(container.querySelector('[role="status"]').textContent).toContain(
    "accepted by the form provider"
  );
  expect(container.querySelector("button[type='submit']").disabled).toBe(false);
});

test("shows the email fallback when the provider request fails", async () => {
  fillForm(container.querySelector("form"));
  global.fetch = jest.fn().mockRejectedValue(new Error("network unavailable"));
  const form = container.querySelector("form");
  jest.spyOn(form, "reportValidity").mockReturnValue(true);

  await act(async () => {
    await contactInstance.handleSubmit({
      preventDefault: jest.fn(),
      currentTarget: form,
    });
  });
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    "Email Peter directly"
  );
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
