"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./result.css";

function ScoreSummary() {
  const params = useSearchParams();
  const points = params.get("score");
  const total = params.get("total");

  const getFeedback = () => {
    if (!points || !total) return "";
    const ratio = (parseInt(points) / parseInt(total)) * 100;
    if (ratio >= 80) return "Master Class! 🚀";
    if (ratio >= 50) return "Solid Performance! 👍";
    return "Keep Grinding! 💡";
  };

  return (
    <div className="result-view">
      <div className="result-shell">
        <h1 className="result-head">Assessment Result</h1>
        {points && total ? (
          <>
            <div className="score-display">
              <span className="score-num">{points}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{total}</span>
            </div>
            <p className="feedback-text">{getFeedback()}</p>
            <Link href="/" className="retry-action">Return to Dashboard</Link>
          </>
        ) : (
          <p className="error-notice">No session data found. Please complete a quiz first.</p>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="result-view">Calculating...</div>}>
      <ScoreSummary />
    </Suspense>
  );
}