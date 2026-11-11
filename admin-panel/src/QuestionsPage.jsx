import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";




export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const [answerText, setAnswerText] = useState("");
  const [answeredBy, setAnsweredBy] = useState("NexoraMart Support");
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);




  async function loadQuestions() {
    try {
      const response = await api.get(
        "/questions/admin/all"
      );



      setQuestions(response.data || []);
      setError("");
    } catch (loadError) {
      setError(
        loadError.response?.data?.detail ||
          "Could not load questions"
      );
    } finally {
      setLoading(false);
    }
  }




  useEffect(() => {
    loadQuestions();
  }, []);




  async function handleAnswerSubmit(event, questionId) {
    event.preventDefault();



    setSuccess("");
    setError("");
    setAnswerLoading(true);



    try {
      await api.post(
        `/questions/admin/${questionId}/answers`,
        {
          answered_by: answeredBy,
          answer_text: answerText,
        }
      );



      setAnswerText("");
      setActiveQuestionId(null);
      setSuccess("Answer submitted successfully.");



      await loadQuestions();
    } catch (answerError) {
      setError(
        answerError.response?.data?.detail ||
          "Could not submit answer"
      );
    } finally {
      setAnswerLoading(false);
    }
  }




  async function handleHideQuestion(questionId) {
    try {
      await api.patch(
        `/questions/admin/${questionId}/hide`
      );



      setSuccess("Question hidden successfully.");
      await loadQuestions();
    } catch (hideError) {
      setError(
        hideError.response?.data?.detail ||
          "Could not hide question"
      );
    }
  }




  async function handleDeleteQuestion(questionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );



    if (!confirmed) return;



    try {
      await api.delete(
        `/questions/admin/${questionId}`
      );



      setSuccess("Question deleted successfully.");
      await loadQuestions();
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.detail ||
          "Could not delete question"
      );
    }
  }




  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading questions...
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/admin"
            className="text-2xl font-black"
          >
            NexoraMart Admin
          </Link>


          <Link
            to="/admin"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>




      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-4xl font-black text-transparent">
          Customer Questions
        </h1>



        <p className="mt-3 text-slate-400">
          Answer customer questions. Answered questions become publicly
          visible on the product page.
        </p>



        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}



        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {success}
          </div>
        )}



        {questions.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-xl font-bold text-white">
              No customer questions yet
            </p>


            <p className="mt-3 text-slate-400">
              Questions submitted from product pages will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-1 text-xs font-bold ${
                          question.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : question.status === "answered"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {question.status.toUpperCase()}
                      </span>


                      <span className="text-sm text-slate-500">
                        {new Date(
                          question.created_at
                        ).toLocaleString()}
                      </span>
                    </div>


                    <p className="mt-4 text-lg font-bold text-white">
                      {question.customer_name}
                    </p>


                    <p className="mt-2 text-slate-300">
                      {question.question_text}
                    </p>
                  </div>



                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuestionId(
                          activeQuestionId === question.id
                            ? null
                            : question.id
                        );
                        setAnswerText("");
                      }}
                      className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 font-bold text-white transition hover:scale-105"
                    >
                      Answer
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleHideQuestion(question.id)
                      }
                      className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20"
                    >
                      Hide
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteQuestion(question.id)
                      }
                      className="rounded-xl bg-red-600/20 px-5 py-3 font-bold text-red-300 transition hover:bg-red-600/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>



                {(question.answers || []).length > 0 && (
                  <div className="mt-6 space-y-4">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                      >
                        <p className="font-bold text-emerald-300">
                          {answer.answered_by}
                        </p>


                        <p className="mt-2 text-slate-300">
                          {answer.answer_text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}



                {activeQuestionId === question.id && (
                  <form
                    onSubmit={(event) =>
                      handleAnswerSubmit(event, question.id)
                    }
                    className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <input
                      value={answeredBy}
                      onChange={(event) =>
                        setAnsweredBy(event.target.value)
                      }
                      placeholder="Answered by"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      required
                    />


                    <textarea
                      value={answerText}
                      onChange={(event) =>
                        setAnswerText(event.target.value)
                      }
                      placeholder="Write your answer"
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      required
                    />


                    <button
                      type="submit"
                      disabled={answerLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
                    >
                      {answerLoading
                        ? "Submitting..."
                        : "Submit Answer"}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
