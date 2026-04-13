import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { roomService } from "../services/roomService";
import RoomCard from "../components/common/RoomCard";
import Skeleton from "../components/ui/Skeleton";
import RevealSection from "../components/luxury/RevealSection";
import GlassPanel from "../components/luxury/GlassPanel";
import LuxuryButton from "../components/luxury/LuxuryButton";
import HeroSlider from "../components/landing/HeroSlider";

/** Consistent centered page gutter — fixes drift / missing horizontal padding */
const Section = ({ id, className = "", children, ...rest }) => (
  <section id={id} className={`w-full ${className}`.trim()} {...rest}>
    <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">{children}</div>
  </section>
);

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=85",
    alt: "Elysium Grand — resort pool and palm trees at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85",
    alt: "Elysium Grand — elegant suite interior",
  },
  {
    src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2400&q=85",
    alt: "Elysium Grand — lobby and lounge",
  },
  {
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=2400&q=85",
    alt: "Elysium Grand — luxury bedroom detail",
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85",
    alt: "Elysium Grand — exterior architecture",
  },
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1596394516093-501bf68a3ba6?auto=format&fit=crop&w=900&q=80", alt: "Atrium light" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80", alt: "Living space" },
  { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80", alt: "Bathroom detail" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80", alt: "Pool terrace" },
  { src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80", alt: "Suite sitting area" },
  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80", alt: "Dining salon" },
];

const experiences = [
  {
    title: "Private dining",
    desc: "Chef-led tasting menus in an intimate salon overlooking the terrace gardens.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Spa & wellness",
    desc: "Slow rituals, aromatherapy, and a thermal suite designed for deep restoration.",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Curated evenings",
    desc: "Jazz, rare spirits, and firelight in our library lounge until the last toast.",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  },
];

const testimonials = [
  {
    quote:
      "Quiet luxury in every detail — from the scent in the lobby to the silence of the suites.",
    name: "Alexandra M.",
    role: "Design director, London",
  },
  {
    quote: "The front desk anticipated every arrival. It felt less like a hotel and more like home.",
    name: "James Chen",
    role: "Frequent guest",
  },
  {
    quote: "We celebrated our anniversary here. The room, the light, the service — unforgettable.",
    name: "Sofia & Marco R.",
    role: "New York",
  },
];

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getAllRooms();
        setRooms(response.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  /** Break out of <main> horizontal padding so the hero stays edge-to-edge */
  const heroBleed =
    "-mx-4 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]";

  return (
    <div className="w-full min-w-0">
      {/* Hero — full width slider; copy centered with safe padding */}
      <div className={heroBleed}>
      <section className="relative isolate min-h-[92vh] w-full overflow-hidden">
        <HeroSlider slides={HERO_SLIDES} />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-elysium-ink/55 via-elysium-ink/35 to-elysium-ink/82" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center_top,rgba(193,154,95,0.12),transparent_55%)]" />

        <div className="relative z-[4] mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col items-center justify-center px-5 pb-36 pt-28 text-center sm:px-10 sm:pb-40 sm:pt-32 md:px-12">
          <p className="animate-fade-in text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-gold-300/95 motion-reduce:animate-none">
            Elysium Grand Hotel
          </p>
          <h1 className="animate-slide-up mt-6 max-w-4xl font-serif text-4xl font-bold leading-[1.12] tracking-tight text-white motion-reduce:animate-none md:text-6xl lg:text-7xl">
            Where stillness meets
            <span className="mt-1 block bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              understated grandeur
            </span>
          </h1>
          <p className="animate-slide-up mx-auto mt-8 max-w-2xl px-1 text-lg leading-relaxed text-white/88 motion-reduce:animate-none md:text-xl">
            A boutique five-star retreat of warm light, tailored service, and rooms composed like private residences.
          </p>

          <GlassPanel className="animate-float-in mx-auto mt-10 w-full max-w-xl border-white/20 bg-white/12 px-6 py-6 text-white motion-reduce:animate-none sm:px-8 sm:py-7">
            <p className="text-sm font-light leading-relaxed text-white/90">
              Reserve a signature suite, slip into our spa, and let the city fall away — one unhurried moment at a time.
            </p>
          </GlassPanel>

          <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center sm:gap-5">
            <LuxuryButton
              to="/rooms"
              variant="primary"
              className="min-h-[48px] justify-center px-8 py-3.5 text-base shadow-glow sm:min-w-[200px] sm:px-10 sm:py-4"
            >
              Explore rooms
            </LuxuryButton>
            <LuxuryButton
              to="/register"
              variant="secondary"
              className="min-h-[48px] justify-center border-white/40 bg-white/15 px-8 py-3.5 text-base text-white backdrop-blur-md hover:bg-white/25 sm:min-w-[200px] sm:px-10 sm:py-4"
            >
              Book your stay
            </LuxuryButton>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-6 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/65 transition hover:text-gold-300 sm:bottom-8"
        >
          Discover
          <span className="block h-8 w-px bg-gradient-to-b from-gold-400/80 to-transparent motion-reduce:animate-none" />
        </a>
      </section>
      </div>

      {/* About */}
      <Section id="about" className="py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealSection className="min-w-0 text-center lg:text-left">
            <p className="section-kicker-dark mx-auto lg:mx-0">About the hotel</p>
            <h2 className="heading-lg mx-auto mt-6 max-w-xl text-elysium-ink lg:mx-0 lg:max-w-none">
              Composed for the modern grand tourer
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dark-600 lg:mx-0 lg:max-w-none">
              Elysium Grand is a rare balance of intimacy and scale — just forty keys, a sun-filled atrium, and a team
              devoted to the poetry of small gestures. Every corridor is softened with natural stone, brass, and the
              scent of bergamot.
            </p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-dark-600 lg:mx-0 lg:max-w-none">
              Our house style is calm efficiency: anticipatory service without intrusion, and spaces that breathe from
              morning light through candlelit nightcaps.
            </p>
          </RevealSection>
          <RevealSection className="relative min-w-0 pb-8 lg:pb-0">
            <div className="overflow-hidden rounded-luxury-lg shadow-panel">
              <img
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85"
                alt="Elysium Grand interior"
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105 lg:aspect-auto lg:min-h-[320px]"
              />
            </div>
            <div className="relative mx-auto mt-6 max-w-xs rounded-luxury border border-gold-200/80 bg-white/95 p-5 shadow-panel sm:p-6 lg:absolute lg:-bottom-4 lg:left-4 lg:mx-0 lg:mt-0">
              <p className="font-serif text-2xl font-semibold text-gold-600">5★</p>
              <p className="mt-2 text-sm leading-snug text-dark-600">Forbes-recommended boutique · 2024</p>
            </div>
          </RevealSection>
        </div>
      </Section>

      {/* Signature rooms */}
      <Section
        id="rooms"
        className="border-y border-gold-200/40 bg-gradient-to-b from-cream-50/80 to-white py-20 sm:py-28"
      >
        <RevealSection className="mx-auto max-w-3xl text-center">
          <p className="section-kicker-dark">Signature rooms</p>
          <h2 className="heading-lg mt-6 text-elysium-ink">Residences above the city</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-dark-600">
            Hand-finished materials, freestanding baths, and bedding woven for the deepest sleep.
          </p>
        </RevealSection>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden rounded-luxury">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="space-y-4 p-5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </div>
              ))
            : rooms.slice(0, 6).map((room) => <RoomCard key={room.id} room={room} />)}
        </div>

        {!loading && rooms.length > 6 && (
          <div className="mt-12 flex justify-center sm:mt-14">
            <LuxuryButton to="/rooms" variant="secondary" className="px-10 py-3.5">
              View all rooms
            </LuxuryButton>
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <p className="mt-12 text-center text-dark-600">No rooms available at the moment.</p>
        )}
      </Section>

      {/* Gallery */}
      <Section id="gallery" className="py-20 sm:py-28">
        <RevealSection className="mx-auto max-w-3xl text-center">
          <p className="section-kicker-dark">Gallery</p>
          <h2 className="heading-lg mt-6 text-elysium-ink">A portrait of the property</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-dark-600">
            Light, texture, and calm — moments captured across our halls, suites, and gardens.
          </p>
        </RevealSection>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {GALLERY_IMAGES.map((g) => (
            <div
              key={g.src}
              className="min-w-0 overflow-hidden rounded-luxury border border-gold-100/80 shadow-soft"
            >
              <img
                src={g.src}
                alt={g.alt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Meeting hall & events */}
      <Section
        id="meeting-hall"
        className="border-y border-gold-200/40 bg-gradient-to-b from-white to-cream-50/90 py-20 sm:py-28"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealSection className="order-2 min-w-0 lg:order-1">
            <p className="section-kicker-dark mx-auto text-center lg:mx-0 lg:text-left">Meetings &amp; events</p>
            <h2 className="heading-lg mx-auto mt-6 max-w-xl text-center text-elysium-ink lg:mx-0 lg:max-w-none lg:text-left">
              The Gramercy Hall &amp; boardrooms
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center leading-relaxed text-dark-600 lg:mx-0 lg:max-w-none lg:text-left">
              Host board retreats, product launches, or intimate celebrations in our pillarless ballroom with natural
              daylight, acoustic treatment, and a private catering kitchen. Smaller salons seat 12–40 with hybrid A/V
              ready on arrival.
            </p>
            <ul className="mx-auto mt-8 max-w-xl list-disc space-y-3 pl-5 text-left text-sm text-dark-700 marker:text-gold-600 lg:mx-0 lg:max-w-none">
              <li>
                <strong className="text-elysium-ink">Gramercy Hall</strong> — up to 180 guests reception, 120 seated
                dinner
              </li>
              <li>
                <strong className="text-elysium-ink">Salon I &amp; II</strong> — configurable breakout and private dining
              </li>
              <li>Dedicated events concierge, floral, and bespoke menus by our culinary team</li>
            </ul>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/meeting-room"
                className="btn-primary px-8 py-3 text-center sm:min-w-[200px]"
              >
                Meeting spaces &amp; packages
              </Link>
              <a
                href="mailto:events@elysiumgrand.example"
                className="btn-secondary px-8 py-3 text-center sm:min-w-[200px]"
              >
                Email events team
              </a>
            </div>
          </RevealSection>
          <RevealSection className="order-1 min-w-0 lg:order-2">
            <div className="overflow-hidden rounded-luxury-lg border border-gold-200/60 shadow-panel">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85"
                alt="Elysium Grand meeting hall and conference space"
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4] lg:min-h-[360px]"
              />
            </div>
          </RevealSection>
        </div>
      </Section>

      {/* Experiences */}
      <Section className="py-20 sm:py-28">
        <RevealSection className="mx-auto max-w-2xl text-center">
          <p className="section-kicker-dark">Experiences</p>
          <h2 className="heading-lg mt-6 text-elysium-ink">Evenings written for you</h2>
          <p className="mt-4 leading-relaxed text-dark-600">
            Slow, sensory, and never rushed — the Elysium way of unwinding.
          </p>
        </RevealSection>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {experiences.map((ex) => (
            <RevealSection key={ex.title} className="min-w-0">
              <article className="group flex h-full flex-col overflow-hidden rounded-luxury-lg border border-gold-100/80 bg-white shadow-panel transition duration-500 hover:-translate-y-2 hover:shadow-panel-hover">
                <div className="aspect-[5/4] shrink-0 overflow-hidden">
                  <img
                    src={ex.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-semibold text-elysium-ink">{ex.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-600">{ex.desc}</p>
                </div>
              </article>
            </RevealSection>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <section className="w-full border-t border-gold-200/50 bg-gradient-to-br from-[#2a241c] via-elysium-ink to-[#1a1510] py-20 text-white sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="section-kicker border-gold-500/30 bg-gold-500/10 text-gold-200/90">Testimonials</p>
            <h2 className="heading-lg mx-auto mt-6 max-w-2xl text-white">Whispers from our guests</h2>
          </RevealSection>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <RevealSection key={t.name} className="min-w-0">
                <blockquote className="glass flex h-full flex-col rounded-luxury-lg border-gold-400/20 p-6 transition duration-500 hover:border-gold-400/40 hover:shadow-glow sm:p-8">
                  <p className="font-serif text-base font-normal leading-relaxed text-white/90 sm:text-lg">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-auto border-t border-white/10 pt-6">
                    <p className="font-semibold text-gold-300">{t.name}</p>
                    <p className="mt-1 text-sm text-white/55">{t.role}</p>
                  </footer>
                </blockquote>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <Section id="location" className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <RevealSection className="min-w-0 text-center lg:text-left">
            <p className="section-kicker-dark mx-auto lg:mx-0">Location</p>
            <h2 className="heading-lg mx-auto mt-6 max-w-xl text-elysium-ink lg:mx-0 lg:max-w-none">
              Gramercy calm, Manhattan pulse
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-dark-600 lg:mx-0 lg:max-w-none">
              Tucked on a tree-lined terrace, Elysium Grand is minutes from the park, galleries, and the quiet side of
              downtown — yet worlds away from the noise.
            </p>
            <address className="mx-auto mt-8 max-w-xl not-italic text-dark-700 lg:mx-0 lg:max-w-none">
              <p className="font-serif text-xl text-elysium-ink">108 Gramercy Terrace</p>
              <p className="mt-2">New York, NY 10010</p>
              <p className="mt-4">
                <a href="tel:+12125550148" className="text-gold-700 transition hover:text-gold-600">
                  +1 (212) 555-0148
                </a>
              </p>
              <p className="mt-2">
                <a href="mailto:concierge@elysiumgrand.example" className="text-gold-700 transition hover:text-gold-600">
                  concierge@elysiumgrand.example
                </a>
              </p>
            </address>
            <div className="mx-auto mt-10 flex max-w-xl flex-col items-stretch justify-center gap-4 sm:flex-row lg:mx-0 lg:max-w-none lg:justify-start">
              <LuxuryButton to="/rooms" variant="primary" className="justify-center px-8">
                Explore rooms
              </LuxuryButton>
              <LuxuryButton to="/register" variant="secondary" className="justify-center px-8">
                Book your stay
              </LuxuryButton>
            </div>
          </RevealSection>
          <RevealSection className="min-h-[300px] min-w-0 overflow-hidden rounded-luxury-lg border border-gold-200/60 shadow-panel sm:min-h-[360px] lg:min-h-[420px]">
            <iframe
              title="Elysium Grand Hotel map"
              className="h-full min-h-[300px] w-full grayscale-[20%] contrast-[1.05] sm:min-h-[360px] lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-73.996%2C40.730%2C-73.978%2C40.742&layer=mapnik&marker=40.736%2C-73.987"
            />
          </RevealSection>
        </div>
      </Section>
    </div>
  );
};

export default Home;
