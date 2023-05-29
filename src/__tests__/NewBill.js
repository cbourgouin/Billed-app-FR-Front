/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import store from "../app/Store";
import router from "../app/Router";

jest.mock("../app/Store", () => mockStore);

// we have to mock navigation to test it
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

describe("Given I am connected as an employee", () => {
  //test Unitaire
  describe("When I am on NewBill Page", () => {
    test("Then class NewBills is defined", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      expect(newBill).toBeDefined();
    });

    //test d'integrations
    describe("When I change the fill in input file", () => {
      test("Then file in input is change", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        await waitFor(() => screen.getAllByTestId("form-new-bill"));
        const file = new File(["hello"], "hello.txt", { type: "text/plain" });
        const fileInput = screen.getAllByTestId("file");
        const notExpected = fileInput[0].files;
        fireEvent.change(fileInput[0], { target: { files: [file] } });
        expect(fileInput[0].files[0]).toBe(file);
      });
    });

    // Test d'integrations POST
    describe("When i click on the submit button", () => {
      test("fetches newBill from mock API POST", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
        document.body.innerHTML = NewBillUI();
        await waitFor(() => screen.getByText(`Envoyer`));
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        const handleSubmitMock = jest.fn((e) => newBill.handleSubmit(e));
        screen
          .getByTestId("form-new-bill")
          .addEventListener("submit", handleSubmitMock);
        screen.getByTestId("datepicker").value = "2023-04-21";
        screen.getByTestId("amount").value = "348";
        screen.getByTestId("pct").value = "20";
        const file = new File(["hello"], "hello.txt", { type: "text/plain" });
        const fileInput = screen.getAllByTestId("file");
        fireEvent.change(fileInput[0], { target: { files: [file] } });
        const submit = screen.getByText("Envoyer");
        submit.click();
        expect(handleSubmitMock).toHaveBeenCalled();
      });
    });
  });
});
