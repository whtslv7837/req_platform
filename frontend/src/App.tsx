import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";
import GoalPage from "./pages/GoalPage";

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <header className="header">
          <h1>Учебная платформа оценки эффективности</h1>
          <p>Сотрудники, их цели и подробные оценки</p>
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/goals/:id" element={<GoalPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


