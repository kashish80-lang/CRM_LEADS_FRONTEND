import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LeadsPage from "./pages/LeadsPage";

import BoardPage from "./pages/BoardPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Redirect Home */}
        <Route
          path="/"
          element={<Navigate to="/leads" />}
        />

        {/* Leads Page */}
        <Route
          path="/leads"
          element={<LeadsPage />}
        />

        {/* Kanban Board */}
        <Route
          path="/board"
          element={<BoardPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;