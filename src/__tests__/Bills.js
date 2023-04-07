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
  
//test d'integration
  describe("When i am on Bills Page and i click on the icon eye of the first element", () => {
    test("Then the document appears", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "employee", email: "emloyee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Hôtel et logement"))
      screen.getAllByTestId('icon-eye')[0].click();
      const modal = await screen.getByTestId("modaleFile")
      expect(modal).toBeVisible()
    });
  });

  describe("When i am on Bills Page and i click on the new Bill button", () => {
    test("Then the page http://127.0.0.1:5500/#employee/bill/new appeard", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "employee", email: "emloyee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      screen.getByTestId('btn-new-bill').click();
      expect(window.location.href).toBe('http://127.0.0.1:5500/#employee/bill/new');
    });
  });
});

// test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When i am on Bills Page", () => {
    test('fetches bills from mock API GET', async () => {
      localStorage.setItem("user", JSON.stringify({ type: "employee", email: "emloyee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Hôtel et logement"))
      const contentRefused = await screen.getByText("Refused")
      expect(contentRefused).toBeTruthy()
      const contentAccepte = await screen.getByText("Accepté")
      expect(contentAccepte).toBeTruthy()
      const contentPending = await screen.getByText("En attente")
      expect(contentPending).toBeTruthy()
    });
  });

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: "Employee",
        email: "emloyee@test.tld"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    });

    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    });

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    });
  });
});
