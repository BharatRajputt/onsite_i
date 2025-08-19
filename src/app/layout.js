"use client"; // kyunki Redux provider client side pe run hota hai

import { Provider } from "react-redux";
import { store } from "../app/store/index";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
