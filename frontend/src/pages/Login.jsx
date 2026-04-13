import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LuxuryButton from "../components/luxury/LuxuryButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)] w-full items-center justify-center overflow-x-clip overflow-y-visible px-5 py-14 sm:px-8 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(193,154,95,0.22),transparent),linear-gradient(180deg,#fdfbf7_0%,#f3ebe0_45%,#ebe2d4_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-gold-300/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[440px] text-center">
        <Link
          to="/"
          className="mx-auto mb-10 inline-flex flex-col items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/70 bg-white shadow-panel">
            <span className="font-serif text-xl font-bold text-gold-700">EG</span>
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-elysium-ink">
            Elysium <span className="text-gold-600">Grand</span>
          </span>
        </Link>

        <div className="rounded-luxury-lg border border-gold-200/60 bg-white/90 px-8 py-9 shadow-panel backdrop-blur-md sm:px-10 sm:py-10">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-700">Guest access</p>
          <h1 className="heading-md mt-4 text-elysium-ink">Sign in</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-dark-600">
            Welcome back. Manage reservations and preferences in one place.
          </p>

          <form className="mx-auto mt-8 max-w-sm space-y-5 text-left" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-center text-sm text-rose-800">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field text-center sm:text-left"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field text-center sm:text-left"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-dark-600">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                />
                Remember me
              </label>
              <a href="#" className="text-sm font-medium text-gold-700 transition hover:text-gold-600">
                Forgot password?
              </a>
            </div>

            <LuxuryButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="mt-2 w-full justify-center py-3.5 shadow-glow disabled:opacity-60"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Sign in"
              )}
            </LuxuryButton>
          </form>
        </div>

        <p className="mt-10 text-sm text-dark-600">
          New to Elysium Grand?{" "}
          <Link to="/register" className="font-semibold text-gold-700 transition hover:text-gold-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
