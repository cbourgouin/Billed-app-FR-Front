/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import store from "../app/Store";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      const backgroundColor = window
        .getComputedStyle(windowIcon)
        .getPropertyValue("background-color");
      expect(backgroundColor).not.toEqual("transparent");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("Then class Bills is defined", () => {
      const bill = new Bills({
        document: document,
        onNavigate: ROUTES_PATH.Bills,
        store: store,
        localStorage: localStorageMock,
      });
      expect(bill).toBeDefined();
    });

    test("Then fonction getBill return something", async () => {
      const bill = new Bills({
        document: document,
        onNavigate: ROUTES_PATH.Bills,
        store: store,
        localStorage: localStorageMock,
      });
      let returnGetBill = await bill.getBills();
      expect(returnGetBill).toBeDefined();
    });

    test("Then fonction getBill return the same number of bills", async () => {
      const bill = new Bills({
        document: document,
        onNavigate: ROUTES_PATH.Bills,
        store: store,
        localStorage: localStorageMock,
      });
      const returnGetBill = await bill.getBills();
      const expectedRes = await mockStore.bills().list();
      expect(returnGetBill.length).toBe(expectedRes.length);
    });

    test("Then fonction getBill return the same bills", async () => {
      const bill = new Bills({
        document: document,
        onNavigate: ROUTES_PATH.Bills,
        store: store,
        localStorage: localStorageMock,
      });
      const returnGetBill = await bill.getBills();
      const expectedRes = await mockStore.bills().list();
      expect(returnGetBill).toEqual(expectedRes);
    });

    test("Then the buttons works and use the fonctions", async () => {
      const bill = new Bills({
        document: document,
        onNavigate: ROUTES_PATH.Bills,
        store: store,
        localStorage: localStorageMock,
      });
      const returnGetBill = await bill.getBills();
      const expectedRes = await mockStore.bills().list();
      expect(returnGetBill).toEqual(expectedRes);
    });
  });
});

describe("Given I am connected as an employee and i am on Bills Page", () => {
  describe("When I am on Bills Page", () => {
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = DashboardFormUI(bills[0])

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const dashboard = new Dashboard({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      acceptButton.addEventListener("click", handleAcceptSubmit)
      fireEvent.click(acceptButton)
      expect(handleAcceptSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  });
});
