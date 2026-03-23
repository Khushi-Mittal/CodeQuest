"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/config";
import "./quiz.css";

function SessionManager() {
  const query = useSearchParams();
  const router = useRouter();
  const slug = decodeURIComponent(query.get("lang") || "Python");

  const [pool, setPool] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [validation, setValidation] = useState<boolean | null>(null);
  const [fail, setFail] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user");
    if (!session) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setFail(false);
    fetch(`${BASE_URL}/quiz/${encodeURIComponent(slug)}`)
      .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
      })
      .then(data => setPool(data))
      .catch(() => setFail(true));
  }, [slug]);

  const onForward = () => {
    if (step + 1 < pool.length) {
      setStep(prev => prev + 1);
      setPick(null);
      setLocked(false);
      setValidation(null);
    } else {
      router.push(`/result?score=${points}&total=${pool.length}`);
    }
  };

  const onAnswer = async (opt: string) => {
    if (locked) return;
    setPick(opt);
    setLocked(true);
    
    try {
      const res = await fetch(`${BASE_URL}/quiz/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: slug, qId: pool[step].id, answer: opt })
      });
      const result = await res.json();
      
      if (result.correct) {
          setPoints(p => p + 1);
          setValidation(true);
      } else {
          setValidation(false);
      }
    } catch (err) {
      console.error("Verification sequence failed");
    }
  };

  if (fail) return (
    <div className="status-screen">
      <h2 className="error-text">Engine Offline</h2>
      <p>Connection to database failed. Verify backend status.</p>
      <button onClick={() => window.location.reload()} className="retry-btn">Reconnect</button>
    </div>
  );

  if (pool.length === 0) return (
    <div className="status-screen">
      <h2>Initializing {slug}...</h2>
      <p className="muted-text">Fetching assessment modules.</p>
    </div>
  );

  const currentUnit = pool[step];
  const progressVal = ((step + 1) / pool.length) * 100;

  return (
    <div className="session-wrapper">
      <div className="progress-bar-shell">
        <div className="progress-fill" style={{ width: `${progressVal}%` }}></div>
      </div>

      <div className="glass-card quiz-card">
        <p className="unit-label">Module {step + 1} of {pool.length}</p>
        <h2 className="statement-text">{currentUnit.question}</h2>

        <div className="choices-stack">
          {currentUnit.options.map((opt: string, i: number) => {
            let statusClass = "";
            if (pick === opt) statusClass = validation ? "correct-pick" : "wrong-pick";

            return (
              <button key={i} onClick={() => onAnswer(opt)} className={`choice-btn ${statusClass}`}>
                {opt}
                {pick === opt && (validation ? " ✅" : " ❌")}
              </button>
            );
          })}
        </div>

        {locked && (
          <button onClick={onForward} className="next-action-btn">
            {step + 1 === pool.length ? "Finalize Score" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizInterface() {
    return (
        <Suspense fallback={<div className="status-screen">Loading Environment...</div>}>
            <SessionManager />
        </Suspense>
    );
}