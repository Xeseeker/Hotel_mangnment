import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LuxuryButton from "../components/luxury/LuxuryButton";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-6xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-elysium-ink/90 via-elysium-ink/4 to-gold-900/20" />
          <div className="relative flex h-full flex-col justify-end p-12 text-white">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold-300/90">Join us</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">Your key to the Elysium experience.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Members enjoy seamless booking, tailored offers, and priority access to our most sought-after suites.
            </p>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <p className="section-kicker-dark">Create account</p>
            <h2 className="heading-md mt-4 text-elysium-ink">Become a guest</h2>
            <p className="mt-2 text-dark-600">Book stays and manage reservations in one refined place.</p>

            <div className="glass mt-10 rounded-luxury-lg border-gold-200/50 p-8 shadow-panel">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="input-label">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

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
                    className="input-field"
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
                    autoComplete="new-password"
                    required
                    className="input-field"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="input-label">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-field"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                  />
                </div>

                <LuxuryButton
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full justify-center py-3.5 disabled:opacity-60"
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
                    "Create account"
                  )}
                </LuxuryButton>
              </form>
            </div>

            <p className="mt-8 text-center text-sm text-dark-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-gold-700 transition hover:text-gold-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
