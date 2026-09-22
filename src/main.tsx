import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { initGA4 } from "./lib/analytics";

initGA4();

createRoot(document.getElementById("root")!).render(<App />);
