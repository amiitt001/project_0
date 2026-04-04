import { useState, useEffect } from "react";
import anime from "animejs/lib/anime.es.js";
import ThreeBackdrop from "./components/ThreeBackdrop";
import AnimateUI from "./components/AnimateUI";
import LoadingScreen from "./components/LoadingScreen";

const stats = [
  { value: "Individual", label: "Participation" },
  { value: "₹200", label: "Registration" },
  { value: "₹60K", label: "Prize Pool" },
  { value: "BYOL", label: "Bring Your Own Laptop" }
];

const challengeTracks = [
  { name: "Knockout Stages", level: "Elimination", desc: "Multi-round knockout format. In each round, approx. 50% of participants advance. Rounds last 45 minutes with a focus on logic and speed.", tags: ["45 Min Rounds", "50% Advance"] },
{ name: "Core Problems", level: "Structure", desc: "Each round includes 3 problems: Data Structures & Algorithms, Logical Reasoning, and Implementation. No room for error.", tags: ["DSA", "Logic"] },
{ name: "Final Showdown", level: "GPL Champion", desc: "Finalists compete in a high-stakes final round. The last remaining participant will be crowned the GPL 1.0 Champion.", tags: ["Finale", "Champion"] }
];

const rules = [
  "Eligibility: Open to all undergraduate students (Individual Participation).",
  "Setup: Participants must bring their own laptops. internet restricted to competition platform.",
  "Knockout: Approx. 50% participants advance per round until a single champion remains.",
  "Scoring: Based on problems solved, time taken, and penalty for incorrect submissions.",
  "Strictly Prohibited: AI tools, online forums, code sharing, or external resources.",
  "Conduct: Plagiarism or disruptive behavior leads to immediate disqualification."
];

const memories = [
  "/DSC01346-2.jpg",
  "/DSC01370.jpg",
  "/DSC01669.JPG",
  "/DSC01899 (1).JPG",
  "/DSC01922.JPG",
  "/DSC02016.JPG",
  "/DSC02034.JPG",
  "/DSC02073.JPG",
  "/IMG_1218.jpg",
  "/IMG_1237.jpg",
  "/IMG_1290.jpg",
  "/IMG_20250509_122820.jpg",
  "/IMG_20250509_203001.jpg",
  "/IMG_20250510_134216.jpg",
  "/IMG_20250510_134304.jpg",
  "/IMG_20250510_134706.jpg",
  "/IMG_20250510_140035.jpg",
  "/IMG_20250510_141340.jpg",
  "/IMG_20250510_141405.jpg",
  "/IMG_20250510_192056.jpg"
];

const timeline = [
  { date: "06 Apr | 12:00 AM", title: "Registration Deadline", desc: "Final call for entries. Secure your spot before the league closes." },
  { date: "Event Day | 09:00 AM", title: "Reporting & Setup", desc: "Late arrivals lead to disqualification. Bring your own laptops." },
  { date: "Event Day | 45m/Stage", title: "Knockout Rounds", desc: "Continuous 45-minute rounds with approx. 50% elimination each phase." },
  { date: "Event Day | Finale", title: "Grand Ceremony", desc: "Finalists compete for the crown and total prizes worth ₹60,000." }
];

const faqCategories = [
  {
    title: "General",
    faqs: [
      { q: "Who can participate in GPL 1.0?", a: "GPL is open to all undergraduate students." },
      { q: "Is prior competitive programming experience required?", a: "No, the event is designed for both beginners and experts to test their logic and speed." },
      { q: "Is the contest individual or team-based?", a: "This is for individual participation only; no teams are allowed." }
    ]
  },
  {
    title: "Technical",
    faqs: [
      { q: "What programming languages are supported?", a: "The online judge platform supports all major competitive programming languages." },
      { q: "Which platform will be used for the contest?", a: "We use an online judge system with automated evaluation for correctness and efficiency." },
      { q: "How will the contest be evaluated?", a: "Evaluation is based on problems solved, execution time, and correctness." },
      { q: "What is the penalty system?", a: "Incorrect submissions result in a time penalty to ensure accuracy." }
    ]
  },
  {
    title: "Rounds & Format",
    faqs: [
      { q: "How many rounds are there?", a: "GPL 1.0 follows a multi-round knockout format until a champion is crowned." },
      { q: "How do I qualify for the final round?", a: "Excel in the top 50% of participants in each successive elimination phase." },
      { q: "What is the difficulty level of the contest?", a: "Problems cover DSA, Logical Reasoning, and Implementation across various complexities." }
    ]
  },
  {
    title: "Registration",
    faqs: [
      { q: "What is the registration fee?", a: "The registration fee for GPL 1.0 is ₹200." },
      { q: "How can I register?", a: "Follow the registration link provided on our Unstop event page." },
      { q: "What details are required during registration?", a: "Name, Student ID, Branch/Year, Phone Number, and Programming handles." }
    ]
  },
  {
    title: "Prizes",
    faqs: [
      { q: "What are the prizes?", a: "Total prize pool is ₹60,000 with ₹35K for the Winner and ₹25K for the Runner-up." },
      { q: "Are there any additional benefits?", a: "Top 10 participants receive exclusive Tech Jerseys, plus medals and certificates." }
    ]
  },
  {
    title: "Rules",
    faqs: [
      { q: "Is plagiarism allowed?", a: "Any form of plagiarism or code sharing results in immediate disqualification." },
      { q: "Can I use external resources during the contest?", a: "AI tools, online forums, and external resources are strictly prohibited." }
    ]
  },
  {
    title: "Logistics",
    faqs: [
      { q: "Where will the final round be conducted?", a: "The event is held offline at Galgotias College of Engineering & Technology (GCET), Greater Noida." },
      { q: "Do I need to bring my own laptop?", a: "Yes, all participants must bring their own laptops for the competition." }
    ]
  }
];

const getCountdownTarget = () => {
  const target = new Date(`2026-04-06T00:00:00+05:30`);
  return target;
};

const formatCountdown = (distance) => {
  if (distance <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  return {
    days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((distance / 1000) % 60)).padStart(2, "0")
  };
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroImg, setHeroImg] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [countdown, setCountdown] = useState(() => {
    const target = getCountdownTarget();
    return formatCountdown(target.getTime() - Date.now());
  });

  // Initial glowing animation and set CSS reset for scroll elements
  useEffect(() => {
    const glowAnim = anime({
      targets: ".hero-glow",
      opacity: [0.2, 0.6],
      scale: [0.92, 1.03],
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      duration: 3200
    });

    anime.set(".track-card, .stat-card, [data-animate]", { opacity: 0, translateY: 30 });
    anime.set(".timeline-card, .timeline-node", { opacity: 0 });
    anime.set(".timeline-rail", { scaleY: 0 });
    anime.set(".gallery-3d-card", { opacity: 0, scale: 0.5 });

    return () => glowAnim.pause();
  }, []);

  // Intersection observer for scroll entrance animations
  useEffect(() => {
    if (loading) return; // Do not observe elements until loading has finished!

    const animations = [];
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.removeAttribute("data-animate");
          target.setAttribute("data-animated", "true");
          if (target.classList.contains("track-card") || target.classList.contains("stat-card")) {
            animations.push(anime({ targets: target, translateY: [30, 0], opacity: [0, 1], duration: 800, easing: "easeOutExpo" }));
          } else if (target.classList.contains("timeline-shell")) {
            animations.push(anime({ targets: ".timeline-rail", scaleY: [0, 1], duration: 1300, easing: "easeOutExpo" }));
            animations.push(anime({ targets: ".timeline-card", opacity: [0, 1], translateY: [32, 0], delay: anime.stagger(130), duration: 900, easing: "easeOutExpo" }));
            animations.push(anime({ targets: ".timeline-node", scale: [0.5, 1], opacity: [0, 1], delay: anime.stagger(130), duration: 700, easing: "easeOutBack" }));
            animations.push(anime({ targets: ".timeline-node", boxShadow: ["0 0 0 4px rgba(0,255,136,0.08), 0 0 14px rgba(0,255,136,0.55)", "0 0 0 8px rgba(0,255,136,0.02), 0 0 28px rgba(0,255,136,0.95)"], direction: "alternate", loop: true, easing: "easeInOutSine", duration: 1800, delay: anime.stagger(170) }));
          } else if (target.classList.contains("gallery-3d-section")) {
            animations.push(anime({ targets: target, opacity: [0, 1], translateY: [30, 0], duration: 900, easing: "easeOutExpo" }));
            animations.push(anime({ targets: ".gallery-3d-card", opacity: [0, 1], scale: [0.5, 1], delay: anime.stagger(50, { start: 200 }), duration: 800, easing: "easeOutBack" }));
          } else {
            animations.push(anime({ targets: target, opacity: [0, 1], translateY: [30, 0], duration: 900, easing: "easeOutExpo" }));
          }
          scrollObserver.unobserve(target);
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll("[data-animate], .track-card, .stat-card, .timeline-shell");
    elements.forEach(el => scrollObserver.observe(el));

    return () => {
      scrollObserver.disconnect();
      animations.forEach((instance) => instance.pause());
    };
  }, [loading]);

  useEffect(() => {
    const target = getCountdownTarget();
    const updateCountdown = () => setCountdown(formatCountdown(target.getTime() - Date.now()));
    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Cycle hero images
  useEffect(() => {
    const id = setInterval(() => setHeroImg(prev => (prev + 1) % 3), 3000);
    return () => clearInterval(id);
  }, []);

  // Close mobile menu on scroll & Toggle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const countdownItems = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds }
  ];

  return (
    <main className={`relative min-h-screen bg-void text-white selection:bg-neon/25 selection:text-white ${loading ? "h-screen overflow-hidden" : "overflow-x-hidden"}`}>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <ThreeBackdrop />

      <div className="scanline-overlay pointer-events-none fixed inset-0 z-0" />
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0" />
      <div className="scanline-moving pointer-events-none fixed inset-0 z-10 hidden md:block" />

      <AnimateUI className="relative z-10 flex flex-col w-full">
        <header data-animate className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-black/30 px-4 py-3 backdrop-blur-md md:px-10 md:py-4">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <a href="#hero" className="flex items-center gap-2 sm:gap-3">
              <img src="/eventlogo.png" alt="GPL Logo" className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 object-contain" />
              <span className="font-semibold tracking-[0.2em] text-neon text-sm md:text-base">GPL 1.0</span>
            </a>
            <nav className="hidden gap-6 text-[10px] items-center uppercase tracking-[0.15em] text-slate-300 lg:flex lg:gap-8">
              <a href="#about" className="transition hover:text-neon">About</a>
              <a href="#challenges" className="transition hover:text-neon">Challenges</a>
              <a href="#timeline" className="transition hover:text-neon">Timeline</a>
              <a href="#rules" className="transition hover:text-neon">Rules</a>
              <a href="#prizes" className="transition hover:text-neon">Prizes</a>
              <a href="#memories" className="transition hover:text-neon">Memories</a>
              <a href="#faq" className="transition hover:text-neon">FAQ</a>
              <a href="https://unstop.com/o/eqZSOMm" target="_blank" className="ml-2 rounded border border-neon/50 bg-neon/5 px-3 py-1.5 text-neon transition hover:bg-neon hover:text-black">Register</a>
            </nav>
            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-neon md:flex">
              <span className="status-dot" /> Registrations Open
            </div>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className={`block h-[2px] w-5 bg-neon transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] w-5 bg-neon transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-5 bg-neon transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
          {/* Mobile dropdown */}
          <nav className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-3 pb-3 border-t border-slate-800/50 pt-3">
              {["about", "challenges", "timeline", "rules", "prizes", "memories", "faq", "register"].map(item => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:text-neon py-1.5 px-2"
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-neon px-2 pt-1">
                <span className="status-dot" /> Registrations Open
              </div>
            </div>
          </nav>
        </header>

        {/* ── Hero ──────────────────────────────────── */}
        <section id="hero" data-animate className="relative w-full py-20 bg-transparent min-h-screen flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            <div className="lg:w-3/5 relative z-10">
              <div className="hero-glow absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
              <p className="text-xs uppercase tracking-[0.3em] text-neon">Competitive Programming Tournament</p>
              <h1 className="mt-4 font-sans text-4xl font-bold leading-[0.95] sm:text-5xl md:text-8xl">
                <span className="glitch-text" data-text="GALGOTIAS">GALGOTIAS</span>
                <span className="mt-2 block text-[#00ff88] opacity-90">PROGRAMMING LEAGUE_</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                <span className="typing-wrapper block mb-3 font-mono text-sm uppercase tracking-widest text-neon">
                  &gt; INITIALIZING TOURNAMENT ROUTINE_
                </span>
                <span className="block hover-glitch">
                  Solve algorithms. Optimize your code. Climb the ranks. The flagship competitive programming tournament aimed at fostering coding excellence and logic building.
                </span>
              </p>
              <div id="register" className="mt-10 flex flex-wrap gap-4">
                <a href="https://unstop.com/o/eqZSOMm" target="_blank" rel="noreferrer" className="hover-glitch rounded border border-neon bg-neon/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-neon transition hover:bg-neon hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                  Register Now
                </a>
                <a href="#challenges" className="rounded border border-slate-700 bg-black/20 backdrop-blur-sm px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500 hover:text-white">
                  View Challenges
                </a>
              </div>

              <div className="mt-14 sm:mt-20 w-full sm:w-fit">
                <div className="flex justify-between gap-4 sm:gap-8 md:gap-16">
                  {countdownItems.map((item) => (
                    <article key={item.label} className="text-center sm:text-left">
                      <p className="font-mono text-2xl font-bold text-neon sm:text-5xl md:text-6xl" style={{ textShadow: '0 0 24px rgba(0,255,136,0.4)' }}>{item.value}</p>
                      <p className="mt-1 sm:mt-2 text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">{item.label}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-2/5 flex justify-center lg:justify-end relative z-10 mt-12 lg:mt-0 w-full">
              <div className="hero-roll-container relative w-80 sm:w-96 md:w-[32rem] lg:w-[42rem] aspect-square">
                {[
                  { src: "/eventlogo.png", alt: "GPL Event Logo" },
                  { src: "/mascot.png", alt: "GPL Mascot" },
                ].map((img, i) => {
                  let stateClass = 'hero-roll-enter';
                  if (i === heroImg) stateClass = 'hero-roll-active';
                  else if (i === (heroImg === 0 ? 2 : heroImg - 1)) stateClass = 'hero-roll-exit';

                  return (
                    <div key={img.src} className={`absolute inset-0 w-full h-full hero-roll-wrapper ${stateClass}`}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-contain animate-float drop-shadow-[0_0_30px_rgba(0,255,136,0.5)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────── */}
        <section data-animate className="w-full bg-transparent border-y border-slate-800/30 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-8 px-6 py-12 md:px-10">
            {stats.map((item) => (
              <article key={item.label} className="stat-card flex-1 min-w-[200px] text-center">
                <p className="font-sans text-5xl font-bold text-neon">{item.value}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── About ─────────────────────────────────── */}
        <section id="about" data-animate className="w-full bg-transparent py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-24 md:px-10 items-center">
            <article>
              <p className="text-xs uppercase tracking-[0.3em] text-neon">What is this</p>
              <h2 className="mt-4 font-sans text-4xl font-bold leading-tight text-white md:text-6xl hover-glitch">Only the Best Advance</h2>
              <p className="mt-8 text-lg leading-relaxed text-slate-300">Galgotias Programming League (GPL) 1.0 is a high-intensity competitive programming tournament.</p>
              <p className="mt-8 text-lg leading-relaxed text-slate-300">Galgotias Programming League (GPL) 1.0 is a high-intensity competitive programming tournament organized by LOOP – The Technical Club of Galgotias University.</p>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">The event is designed to test participants’ problem-solving ability, coding speed, and algorithmic thinking under pressure through structured elimination rounds. Think Fast. Code Faster.</p>
            </article>
            <article className="rounded-2xl border border-slate-700/40 bg-black/40 backdrop-blur-md p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-auto text-xs uppercase tracking-[0.15em] text-slate-500 font-mono">gpl_compile.sh</span>
              </div>
              <div className="space-y-4 font-mono text-sm leading-relaxed text-slate-300">
                <p><span className="text-neon">$</span> g++ solution.cpp -O2 -std=c++17</p>
                <p><span className="text-neon">[OK]</span> Compilation successful. Running test cases...</p>
                <p><span className="text-neon">$</span> run_tests --all</p>
                <p><span className="text-neon">Test 1:</span> <span className="text-green-400">Passed [0.012s]</span></p>
                <p><span className="text-neon">Test 2:</span> <span className="text-green-400">Passed [0.045s]</span></p>
                <p><span className="text-emerald-400 font-bold">[ACCEPTED]</span> All test cases passed. +100pts</p>
              </div>
            </article>
          </div>
        </section>

        {/* ── Challenges ────────────────────────────── */}
        <section id="challenges" data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <p className="text-xs uppercase tracking-[0.3em] text-neon text-center">Round Structure</p>
            <h2 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch text-center">Progression Levels</h2>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challengeTracks.map((track) => (
                <article key={track.name} className="track-card rounded-2xl border border-slate-700/30 bg-black/20 backdrop-blur-sm p-8 transition hover:border-neon/50 hover:bg-black/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-neon">{track.level}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{track.name}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">{track.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {track.tags.map((tag) => (
                      <span key={tag} className="rounded border border-slate-700/50 bg-slate-900/50 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-slate-300">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ────────────────────────────────── */}
        <section id="timeline" data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Event Timeline</p>
            <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Key Dates</h3>
          </div>
          <div className="mx-auto w-full max-w-4xl px-4 md:px-10 mt-16 md:mt-24">
            <div className="timeline-shell pl-6 md:pl-0">
              <div className="timeline-rail" />
              {timeline.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={item.title} className={`timeline-row ${isLeft ? "timeline-row-left" : "timeline-row-right"}`}>
                    <article className="timeline-card rounded-2xl border border-slate-700/30 bg-black/30 backdrop-blur-md p-8 shadow-xl">
                      <p className="text-sm font-semibold tracking-[0.1em] text-neon md:text-base">{item.date}</p>
                      <h4 className="mt-3 font-sans text-2xl font-bold text-white md:text-3xl">{item.title}</h4>
                      <p className="mt-3 text-base leading-relaxed text-slate-400">{item.desc}</p>
                    </article>
                    <span className="timeline-node" />
                    <div aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Rules ───────────────────────────────────── */}
        <section id="rules" data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-4xl px-6 md:px-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Simplified Handbook</p>
            <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Rules of Play</h3>
            <div className="mt-16 text-left space-y-6 rounded-2xl border border-slate-700/30 bg-black/20 backdrop-blur-md p-8 md:p-12 shadow-2xl">
              {rules.map((rule, index) => (
                <div key={rule} className="flex gap-5 border-b border-slate-800/50 pb-6 text-lg text-slate-300 last:border-0 last:pb-0">
                  <span className="font-mono text-neon font-bold">{String(index + 1).padStart(2, "0")}</span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Prizes ────────────────────────────────── */}
        <section id="prizes" data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Rewards</p>
            <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Recognition and Rewards</h3>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-neon/40 bg-emerald-950/20 backdrop-blur-md p-10 transform md:-translate-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-neon font-bold">Winner</p>
                <h4 className="mt-4 font-sans text-5xl font-black text-neon">₹35,000</h4>
                <p className="mt-4 text-base text-slate-300 leading-relaxed font-bold">Trophy + Swag + Tech Jersey + Certificate</p>
              </article>
              <article className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md p-10">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-bold">Runner Up</p>
                <h4 className="mt-4 font-sans text-4xl font-black text-cyan-300">₹25,000</h4>
                <p className="mt-4 text-base text-slate-300 leading-relaxed font-bold">Trophy + Swag + Tech Jersey + Certificate</p>
              </article>
              <article className="rounded-2xl border border-slate-700/30 bg-black/40 backdrop-blur-md p-10 mt-6 md:mt-0">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold">All Participants</p>
                <h4 className="mt-4 font-sans text-3xl font-black text-white/80 tracking-tight leading-none uppercase">Certified</h4>
                <p className="mt-4 text-base text-slate-400 leading-relaxed">Participation Certificate for every student</p>
              </article>
            </div>
          </div>
        </section>

        {/* ── 3D Gallery (full-width) ───────────────── */}
        <section id="memories" data-animate className="gallery-3d-section w-full py-24 md:py-32 border-t border-slate-800/30 perspective-1400 overflow-visible">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10 mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Gallery</p>
            <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Event Memories</h3>
          </div>
          <div className="gallery-3d-wrapper">
            <div className="gallery-3d-row gallery-3d-row--top">
              <div className="gallery-3d-track gallery-3d-track--left">
                {[...memories.slice(0, Math.ceil(memories.length / 2)), ...memories.slice(0, Math.ceil(memories.length / 2))].map((src, idx) => (
                  <div key={`top-${idx}`} className="gallery-3d-card group">
                    <div className="gallery-3d-glow" />
                    <img src={src} alt={`Memory ${idx}`} className="gallery-3d-img" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <div className="gallery-3d-row gallery-3d-row--bottom">
              <div className="gallery-3d-track gallery-3d-track--right">
                {[...memories.slice(Math.ceil(memories.length / 2)), ...memories.slice(Math.ceil(memories.length / 2))].map((src, idx) => (
                  <div key={`bot-${idx}`} className="gallery-3d-card group">
                    <div className="gallery-3d-glow" />
                    <img src={src} alt={`Memory ${idx + Math.ceil(memories.length / 2)}`} className="gallery-3d-img" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────────── */}
        {/* <section data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">The Team</p>
            <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Organized by LOOP</h3>
            <div className="mt-12 grid gap-6 md:max-w-3xl mx-auto md:grid-cols-2">
              <article className="rounded-2xl border border-slate-700/40 bg-black/20 backdrop-blur-md p-8">
                <p className="text-xl font-bold text-white">LOOP</p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Organizing Body</p>
              </article>
              <article className="rounded-2xl border border-slate-700/40 bg-black/20 backdrop-blur-md p-8">
                <p className="text-xl font-bold text-white">Problem Setters</p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Technical Team</p>
              </article>
            </div>
          </div>
        </section> */}

        {/* ── FAQ ─────────────────────────────────────── */}
        <section id="faq" data-animate className="w-full bg-transparent py-24 md:py-32 border-t border-slate-800/30">
          <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-neon">Support</p>
              <h3 className="mt-4 font-sans text-4xl font-bold text-white md:text-6xl hover-glitch">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-12">
              {faqCategories.map((category, catIndex) => (
                <div key={category.title}>
                  <h4 className="text-xl font-bold text-neon mb-6 border-b border-slate-800 pb-3">{category.title}</h4>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const uniqueIndex = `${catIndex}-${faqIndex}`;
                      const isActive = activeFaq === uniqueIndex;
                      return (
                        <article key={uniqueIndex} className="rounded-2xl border border-slate-700/40 bg-black/20 backdrop-blur-md overflow-hidden transition-all duration-300">
                          <button
                            onClick={() => setActiveFaq(isActive ? null : uniqueIndex)}
                            className="flex w-full items-center justify-between p-6 md:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neon/50"
                          >
                            <span className={`font-sans text-xl md:text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-neon' : 'text-white'}`}>
                              {faq.q}
                            </span>
                            <span className={`ml-6 flex-shrink-0 text-3xl font-light transition-transform duration-300 ${isActive ? 'rotate-45 text-neon' : 'text-slate-500'}`}>
                              +
                            </span>
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                          >
                            <p className="px-6 pb-6 md:px-8 md:pb-8 text-base leading-relaxed text-slate-300">
                              {faq.a}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────── */}
        <footer data-animate className="w-full border-t border-slate-800/60 bg-black/20 backdrop-blur-sm pb-12 pt-20">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 md:flex-row md:justify-between lg:gap-24 md:px-10">
            <div className="flex flex-col gap-6 md:w-1/3">
              <div className="flex items-center gap-3 mb-2">
                <img src="/eventlogo.png" alt="GPL Logo" className="h-8 w-8 object-contain" />
                <p className="text-2xl font-bold tracking-[0.2em] text-neon">GPL 1.0</p>
              </div>
              <div className="flex items-center gap-2 text-sm leading-relaxed text-slate-400">
                <span>Designed by</span>
                <img src="/loop.png" alt="LOOP Logo" className="h-5 w-5 object-contain" />
                <strong className="text-white tracking-widest">CLUB LOOP</strong>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">A flagship competitive programming tournament focused on algorithmic thinking, coding excellence, and logic building.</p>
              <div className="mt-2 flex gap-6">
                <a href="https://www.instagram.com/gcetloop" target="_blank" rel="noreferrer" className="text-sm font-bold uppercase tracking-widest text-slate-400 transition hover:text-neon">Instagram</a>
                <a href="https://www.linkedin.com/company/loopgcet" target="_blank" rel="noreferrer" className="text-sm font-bold uppercase tracking-widest text-slate-400 transition hover:text-neon">LinkedIn</a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-16 md:w-2/3">
              <div>
                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Navigation</h3>
                <ul className="space-y-4 text-sm">
                  <li><a href="#about" className="text-slate-400 transition hover:text-white">About</a></li>
                  <li><a href="#challenges" className="text-slate-400 transition hover:text-white">Challenges</a></li>
                  <li><a href="#rules" className="text-slate-400 transition hover:text-white">Timeline</a></li>
                  <li><a href="#prizes" className="text-slate-400 transition hover:text-white">Prizes</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Resources</h3>
                <ul className="space-y-4 text-sm">
                  <li><a href="#rules" className="text-slate-400 transition hover:text-white">Rules &amp; Regulations</a></li>
                  <li><a href="#" className="text-slate-400 transition hover:text-white">Platform Guide</a></li>
                  <li><a href="#" className="text-slate-400 transition hover:text-white">Previous Problems</a></li>
                  <li><a href="#" className="text-slate-400 transition hover:text-white">Sponsorships</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Contact</h3>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><a href="mailto:loop.galgotias@gmail.com" className="transition hover:text-white hover:text-neon">loop.galgotias@gmail.com</a></li>
                  <li className="leading-relaxed">Galgotias College of Engineering and Technology, Greater Noida</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-20 flex w-full max-w-7xl flex-col items-center justify-between border-t border-slate-800/60 pt-8 px-6 gap-6 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 md:flex-row md:px-10 md:gap-0">
            <div className="flex items-center gap-3">
              <img src="/eventlogo.png" alt="GPL Logo" className="h-5 w-5 object-contain opacity-60" />
              <p>© {new Date().getFullYear()} GALGOTIAS PROGRAMMING LEAGUE</p>
            </div>
            <div className="flex items-center gap-2">
              <span>DESIGNED BY</span>
              <img src="/loop.png" alt="LOOP" className="h-4 w-4 object-contain opacity-80" />
              <span className="text-white font-bold">CLUB LOOP</span>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <a
          href="#hero"
          className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-neon/50 bg-black/60 text-neon backdrop-blur-md transition-all duration-300 hover:bg-neon hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </a>
      </AnimateUI>
    </main>
  );
}
