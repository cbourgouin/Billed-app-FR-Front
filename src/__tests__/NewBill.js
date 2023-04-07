/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import store from "../app/Store";

jest.mock("../app/Store", () => mockStore);

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
  });

  //test d'integrations
  describe("When I am on the new bill page");
  test("Then the fonction updateBill is call", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ type: "employee", email: "emloyee@test.tld" })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);
    await waitFor(() => screen.getByText("Justificatif"));
    screen.getAllByTestId("icon-eye")[0].click();
    const modal = await screen.getByTestId("modaleFile");
    expect(modal).toBeVisible();
  });
});
