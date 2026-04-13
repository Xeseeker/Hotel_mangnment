import React, { useState } from "react";
import RevealSection from "../components/luxury/RevealSection";
import LuxuryButton from "../components/luxury/LuxuryButton";
import {
  MEETING_HERO,
  MEETING_STATS,
  MEETING_SPACES,
  MEETING_PACKAGES,
  MEETING_AMENITIES,
  MEETING_FAQ,
  MEETING_TESTIMONIAL,
} from "../data/mockData";
import { useToaster } from "../components/ui/Toaster";

const MeetingRoom = () => {
  const { addToast } = useToaster();
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    guests: "",
    message: "",
  });

  const handleInquiryChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    addToast(
      "Demo: inquiry captured — connect this form to your events API.",
      "success",
    );
    setInquiry({
      name: "",
      email: "",
      company: "",
      date: "",
      guests: "",
      message: "",
    });
  };

  const heroBleed =
    "-mx-4 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]";

  return (
    <div className="w-full min-w-0 pb-24">
      {/* Hero */}
      <div className={heroBleed}>
        <section className="relative isolate min-h-[55vh] w-full overflow-hidden sm:min-h-[60vh]">
          <img
            src={MEETING_HERO.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-elysium-ink/88 via-elysium-ink/55 to-elysium-ink/35" />
          <div className="relative z-10 mx-auto flex min-h-[55vh] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[60vh] sm:px-10 md:px-12">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold-300/95">
              Events
            </p>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {MEETING_HERO.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              {MEETING_HERO.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
              <a
                href="#inquiry"
                className="btn-primary min-h-[48px] justify-center px-10 py-3.5 text-center"
              >
                Request proposal
              </a>
              <LuxuryButton
                to="/rooms"
                variant="secondary"
                className="justify-center border-white/35 bg-white/12 px-10 py-3.5 text-white hover:bg-white/20"
              >
                View guest rooms
              </LuxuryButton>
            </div>
          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="border-b border-gold-200/40 bg-cream-50/90 py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-3 text-center sm:grid-cols-3 sm:gap-8 sm:px-5 lg:px-6">
          {MEETING_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-luxury border border-gold-100/80 bg-white/90 px-6 py-8 shadow-soft"
            >
              <p className="font-serif text-3xl font-semibold text-gold-700 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-dark-500">
                {s.label}
              </p>
              <p className="mt-1 text-sm text-dark-600">{s.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spaces */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <RevealSection className="mx-auto max-w-2xl text-center">
            <p className="section-kicker-dark">Spaces</p>
            <h2 className="heading-lg mt-5 text-elysium-ink">
              Rooms that adapt to your agenda
            </h2>
            <p className="mt-4 text-dark-600">
              Mock floor plan — swap with live inventory from your backend.
            </p>
          </RevealSection>

          <div className="mt-14 space-y-16">
            {MEETING_SPACES.map((space, idx) => (
              <RevealSection key={space.id}>
                <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                  <div
                    className={`min-w-0 order-1 overflow-hidden rounded-luxury-lg border border-gold-100/80 shadow-panel lg:order-none ${
                      idx % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <img
                      src={space.image}
                      alt=""
                      className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
                    />
                  </div>
                  <div
                    className={`order-2 min-w-0 px-4 py-3 text-center sm:px-6 sm:py-4 lg:order-none lg:px-2 lg:py-0 lg:text-left ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <h3 className="font-serif text-2xl font-semibold text-elysium-ink sm:text-3xl">
                      {space.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-gold-700">
                      {space.capacity}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-dark-500">
                      {space.size}
                    </p>
                    <p className="mx-auto mt-6 max-w-xl leading-relaxed text-dark-600 lg:mx-0">
                      {space.description}
                    </p>
                    <ul className="mx-auto mt-6 flex flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start">
                      {space.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-full border border-gold-200/80 bg-gold-50/80 px-3 py-1 text-xs font-medium text-gold-900"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-y border-gold-200/40 bg-gradient-to-b from-white to-cream-50/80 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <RevealSection className="mx-auto max-w-2xl text-center">
            <p className="section-kicker-dark">Packages</p>
            <h2 className="heading-lg mt-5 text-elysium-ink">
              Catering &amp; service tiers
            </h2>
            <p className="mt-4 text-dark-600">
              Demo pricing — wire to your banquet menu API.
            </p>
          </RevealSection>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {MEETING_PACKAGES.map((pkg) => (
              <RevealSection key={pkg.name}>
                <div className="flex h-full flex-col rounded-luxury-lg border border-gold-100/90 bg-white/95 p-8 text-center shadow-panel">
                  <h3 className="font-serif text-xl font-semibold text-elysium-ink">
                    {pkg.name}
                  </h3>
                  <p className="mt-4 font-serif text-3xl text-gold-700">
                    {pkg.price}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-dark-500">
                    {pkg.unit}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3 text-left text-sm text-dark-600">
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <RevealSection className="mx-auto max-w-2xl text-center">
            <p className="section-kicker-dark">Amenities</p>
            <h2 className="heading-lg mt-5 text-elysium-ink">
              Everything on one contract
            </h2>
          </RevealSection>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {MEETING_AMENITIES.map((a) => (
              <RevealSection key={a.title}>
                <div className="rounded-luxury border border-gold-100/80 bg-white/90 p-6 text-center shadow-soft sm:p-8 sm:text-left">
                  <h3 className="font-serif text-lg font-semibold text-elysium-ink">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-600">
                    {a.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial + FAQ */}
      <section className="border-t border-gold-200/50 bg-elysium-ink py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="section-kicker border-gold-500/30 bg-gold-500/10 text-gold-200/90">
              Client voice
            </p>
            <blockquote className="mt-8 font-serif text-xl font-normal leading-relaxed text-white/90 sm:text-2xl">
              &ldquo;{MEETING_TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <footer className="mt-8 text-gold-300">
              <p className="font-semibold">{MEETING_TESTIMONIAL.name}</p>
              <p className="text-sm text-white/55">
                {MEETING_TESTIMONIAL.role}
              </p>
            </footer>
          </RevealSection>

          <div className="mx-auto mt-16 max-w-3xl space-y-6">
            <h3 className="text-center font-serif text-2xl text-white">FAQ</h3>
            {MEETING_FAQ.map((item) => (
              <RevealSection key={item.q}>
                <div className="rounded-luxury border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="font-semibold text-gold-200">{item.q}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {item.a}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form — mock submit */}
      <section id="inquiry" className="py-16 sm:py-24">
        <div className="mx-auto max-w-lg px-5 sm:px-8 lg:px-10">
          <RevealSection className="text-center">
            <p className="section-kicker-dark">Inquiry</p>
            <h2 className="heading-lg mt-5 text-elysium-ink">
              Plan your event
            </h2>
            <p className="mt-4 text-dark-600">
              Demo form — fields map 1:1 to your future events endpoint.
            </p>
          </RevealSection>

          <form
            onSubmit={handleInquirySubmit}
            className="glass mt-10 space-y-5 rounded-luxury-lg border border-gold-200/50 p-6 shadow-panel sm:p-8"
          >
            <div>
              <label className="input-label">Name</label>
              <input
                name="name"
                value={inquiry.name}
                onChange={handleInquiryChange}
                className="input-field"
                required
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input
                name="email"
                type="email"
                value={inquiry.email}
                onChange={handleInquiryChange}
                className="input-field"
                required
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="input-label">Company</label>
              <input
                name="company"
                value={inquiry.company}
                onChange={handleInquiryChange}
                className="input-field"
                placeholder="Organization"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="input-label">Event date</label>
                <input
                  name="date"
                  type="date"
                  value={inquiry.date}
                  onChange={handleInquiryChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Guests</label>
                <input
                  name="guests"
                  type="number"
                  min={1}
                  value={inquiry.guests}
                  onChange={handleInquiryChange}
                  className="input-field"
                  placeholder="Approx."
                />
              </div>
            </div>
            <div>
              <label className="input-label">Notes</label>
              <textarea
                name="message"
                rows={4}
                value={inquiry.message}
                onChange={handleInquiryChange}
                className="input-field resize-y"
                placeholder="Agenda, dietary needs, A/V requirements…"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full justify-center py-3.5"
            >
              Send inquiry (demo)
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default MeetingRoom;
