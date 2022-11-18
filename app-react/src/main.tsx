import React from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import { Welcome } from "./pages/Wellcome";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
