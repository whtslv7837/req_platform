import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

type GoalDetails = {
  id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  employee_id: number;
  employee_full_name: string;
  employee_position: string;
  reviews: {
    id: number;
    score: number;
    comment?: string | null;
    created_at: string;
  }[];
};

function GoalPage() {
  const { id } = useParams();
  const [goal, setGoal] = useState<GoalDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoal = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<GoalDetails>(`${API_BASE}/goals/${id}`);
        setGoal(res.data);
      } catch {
        setError("Не удалось загрузить цель");
      } finally {
        setLoading(false);
      }
    };
    void loadGoal();
  }, [id]);

  return (
    <main className="content single-page">
      <section className="card wide-card">
        <header className="goal-header">
          <div>
            <h2>{goal ? goal.title : "Цель"}</h2>
            {goal && (
              <p className="muted">
                Сотрудник:{" "}
                <Link to="/employees">
                  {goal.employee_full_name} ({goal.employee_position})
                </Link>
              </p>
            )}
          </div>
          <div>
            <Link to="/employees" className="link-back">
              ← Назад к сотрудникам
            </Link>
          </div>
        </header>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {goal && (
          <>
            <section className="goal-section">
              <h3>Описание цели</h3>
              <div className="goal-description">
                {goal.description ? (
                  <p>{goal.description}</p>
                ) : (
                  <p className="muted">Описание не задано</p>
                )}
                {goal.due_date && (
                  <p className="muted">
                    Срок выполнения:{" "}
                    {new Date(goal.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </section>

            <section className="goal-section">
              <h3>Оценки по этой цели</h3>
              <ul className="small-list">
                {goal.reviews.map((r) => (
                  <li key={r.id}>
                    <strong>Оценка {r.score} / 5</strong>{" "}
                    <span className="muted">
                      от {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    {r.comment && <div className="muted">{r.comment}</div>}
                  </li>
                ))}
                {goal.reviews.length === 0 && (
                  <li className="muted">
                    По этой цели ещё нет оценок. Задайте их на странице
                    сотрудника.
                  </li>
                )}
              </ul>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default GoalPage;




