import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

/**
 * SYSTEM LOCKDOWN / EMERGENCY DISABLE MODE
 * All application routes are mapped directly to 404 Not Found.
 */
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
