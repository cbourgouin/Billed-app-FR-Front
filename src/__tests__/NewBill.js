/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import store from "../app/Store";

jest.mock("../app/Store", () => mockStore);


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test("Then ...", () => {
    //   const html = NewBillUI()
    //   document.body.innerHTML = html
    //   //to-do write assertion
    // })

    test("Then class NewBills is defined", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      expect(newBill).toBeDefined();
    });

    test("Then the fonction handleChangeFile is called", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      const myMethod = jest.spyOn(newBill, 'handleChangeFile')
      newBill.handleChangeFile(new Event("click"))
      expect(myMethod).toHaveBeenCalled();
    });

    test("Then the fonction handleChangeFilechange file of the bill in the store", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      const notExpect = newBill.fileUrl;
      newBill.handleChangeFile(new Event("click"))
      expect(newBill.fileUrl).not.toEqual(notExpect);
    });

    test("Then the fonction handleSubmit is call", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      const myMethod = jest.spyOn(newBill, 'handleSubmit')
      newBill.handleSubmit(new Event("click"));
      expect(myMethod).toHaveBeenCalled();
    });

    test("Then the fonction handleSubmit change the value of \"onNavigate\"", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      newBill.handleSubmit(new Event("click"));
      expect(NewBill.onNaviguate).toEqual(ROUTES_PATH['Bills']);
    });

    test("Then the fonction updateBill is call", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document: document,
        onNavigate: ROUTES_PATH["NewBill"],
        store: store,
        localStorage: localStorageMock,
      });
      const myMethod = jest.spyOn(newBill, 'updateBill')
      newBill.updateBill(new Event("click"));
      expect(myMethod).toHaveBeenCalled();
    });
  })
})
