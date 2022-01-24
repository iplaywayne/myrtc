import ReactDOM from "react-dom";
import { render, screen } from '@testing-library/react'
// import Index from './index'
import { renderDOM } from "./index";
// import App from './App'


jest.mock('socket.io-client')

describe("test ReactDOM.render", () => {
  const originalRender = ReactDOM.render;
  const originalGetElement = global.document.getElementById;
  beforeEach(() => {
    global.document.getElementById = jest.fn().mockImplementation(() => true);
    ReactDOM.render = jest.fn();
  });
  afterAll(() => {
    global.document.getElementById = originalGetElement;
    ReactDOM.render = originalRender;
    jest.clearAllMocks()
  });
  it("should call ReactDOM.render", () => {
    renderDOM()
    expect(ReactDOM.render).toHaveBeenCalled();
  });
});