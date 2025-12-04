import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export type Employee = {
  id: number;
  full_name: string;
  position: string;
  hire_date: string;
};

export type Goal = {
  id: number;
  employee_id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
};

export type Review = {
  id: number;
  employee_id: number;
  goal_id?: number | null;
  score: number;
  comment?: string | null;
  created_at: string;
};

type EmployeeDetails = Employee & {
  goals: Goal[];
  reviews: Review[];
};

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    position: "",
    hire_date: "",
  });

  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [reviewForm, setReviewForm] = useState({
    score: 3,
    comment: "",
  });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Employee[]>(`${API_BASE}/employees`);
      setEmployees(res.data);
    } catch {
      setError("Не удалось загрузить сотрудников");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGoalForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "score" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.post(`${API_BASE}/employees`, form);
      setForm({ full_name: "", position: "", hire_date: "" });
      await loadEmployees();
    } catch {
      setError("Не удалось создать сотрудника");
    }
  };

  const loadEmployeeDetails = async (id: number) => {
    try {
      setError(null);
      const res = await axios.get<EmployeeDetails>(`${API_BASE}/employees/${id}`);
      setSelected(res.data);
    } catch {
      setError("Не удалось загрузить данные сотрудника");
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    void loadEmployeeDetails(employee.id);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      setError(null);
      await axios.post(`${API_BASE}/goals`, {
        employee_id: selected.id,
        ...goalForm,
        due_date: goalForm.due_date || null,
      });
      setGoalForm({ title: "", description: "", due_date: "" });
      await loadEmployeeDetails(selected.id);
    } catch {
      setError("Не удалось создать цель");
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      setError(null);
      await axios.post(`${API_BASE}/reviews`, {
        employee_id: selected.id,
        score: reviewForm.score,
        comment: reviewForm.comment || null,
        goal_id: null,
      });
      setReviewForm({ score: 3, comment: "" });
      await loadEmployeeDetails(selected.id);
    } catch {
      setError("Не удалось создать оценку");
    }
  };

  const avgScore =
    selected && selected.reviews.length
      ? (
          selected.reviews.reduce((acc, r) => acc + r.score, 0) /
          selected.reviews.length
        ).toFixed(1)
      : null;

  return (
    <main className="content">
      <section className="card">
        <h2>Добавить сотрудника</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>ФИО</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          <div className="field">
            <label>Должность</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Менеджер по продажам"
              required
            />
          </div>
          <div className="field">
            <label>Дата найма</label>
            <input
              type="date"
              name="hire_date"
              value={form.hire_date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Создать
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Сотрудники и оценки</h2>
        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && employees.length === 0 && <p>Пока нет сотрудников</p>}
        <div className="split">
          <div className="split-left">
            <ul className="table">
              {employees.map((e) => (
                <li
                  key={e.id}
                  className={`table-row clickable ${
                    selected?.id === e.id ? "row-active" : ""
                  }`}
                  onClick={() => handleSelectEmployee(e)}
                >
                  <div className="table-cell">
                    <strong>{e.full_name}</strong>
                    <span className="muted">{e.position}</span>
                  </div>
                  <div className="table-cell">
                    <span>
                      Нанят: {new Date(e.hire_date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="split-right">
            {!selected && (
              <p className="muted">
                Выберите сотрудника, чтобы увидеть цели и оценки
              </p>
            )}
            {selected && (
              <>
                <div className="detail-header">
                  <h3>{selected.full_name}</h3>
                  <p className="muted">
                    {selected.position} · Нанят{" "}
                    {new Date(selected.hire_date).toLocaleDateString()}
                  </p>
                  {avgScore && (
                    <p>
                      Средняя оценка: <strong>{avgScore}</strong> / 5
                    </p>
                  )}
                </div>

                <div className="detail-grid">
                  <div>
                    <h4>Цели</h4>
                    <form
                      className="form detail-form"
                      onSubmit={handleCreateGoal}
                    >
                      <input
                        name="title"
                        value={goalForm.title}
                        onChange={handleGoalChange}
                        placeholder="Название цели"
                        required
                      />
                      <textarea
                        name="description"
                        value={goalForm.description}
                        onChange={handleGoalChange}
                        placeholder="Описание (необязательно)"
                        rows={3}
                      />
                      <input
                        type="date"
                        name="due_date"
                        value={goalForm.due_date}
                        onChange={handleGoalChange}
                      />
                      <button type="submit" className="btn-primary">
                        Добавить цель
                      </button>
                    </form>
                    <ul className="small-list">
                      {selected.goals.map((g) => (
                        <li key={g.id}>
                          <strong>
                            <Link to={`/goals/${g.id}`}>{g.title}</Link>
                          </strong>
                          {g.due_date && (
                            <span className="muted">
                              {" "}
                              · до{" "}
                              {new Date(g.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {g.description && (
                            <div className="muted">{g.description}</div>
                          )}
                        </li>
                      ))}
                      {selected.goals.length === 0 && (
                        <li className="muted">Пока нет целей</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4>Оценки</h4>
                    <form
                      className="form detail-form"
                      onSubmit={handleCreateReview}
                    >
                      <input
                        type="number"
                        name="score"
                        min={1}
                        max={5}
                        value={reviewForm.score}
                        onChange={handleReviewChange}
                        required
                      />
                      <textarea
                        name="comment"
                        value={reviewForm.comment}
                        onChange={handleReviewChange}
                        placeholder="Подробный комментарий по эффективности"
                        rows={3}
                      />
                      <button type="submit" className="btn-primary">
                        Добавить оценку
                      </button>
                    </form>
                    <ul className="small-list">
                      {selected.reviews.map((r) => (
                        <li key={r.id}>
                          <strong>Оценка {r.score} / 5</strong>{" "}
                          <span className="muted">
                            от {new Date(r.created_at).toLocaleDateString()}
                          </span>
                          {r.comment && (
                            <div className="muted">{r.comment}</div>
                          )}
                        </li>
                      ))}
                      {selected.reviews.length === 0 && (
                        <li className="muted">Пока нет оценок</li>
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default EmployeesPage;



