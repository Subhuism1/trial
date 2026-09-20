import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CreateLinks from "./CreateLinks.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CreateLinks />
  </StrictMode>
);
