"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  AlignCenter,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleCheck,
  Clock3,
  Heart,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  MoveUpRight,
  Plus,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { clinic, contactTopics, faqs, priceGroups, team, treatments } from "@/lib/content";

function Mark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-mark${light ? " brand-mark--light" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" role="presentation">
        <path d="M24 8c-4.9-4.5-13-3.8-15.1 3.4-2.4 8.1 3.7 14.6 6 23.1 1.1 4.2 2 6.4 4.7 6.4 2.7 0 2.9-2.7 4.4-7.7 1.5 5 1.7 7.7 4.4 7.7 2.7 0 3.6-2.2 4.7-6.4 2.3-8.5 8.4-15 6-23.1C37 4.2 28.9 3.5 24 8Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 8c-2.3 2.1-4.5 3.1-7.8 3.3" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand${light ? " brand--light" : ""}`} aria-label="LUMA Dental Studio — strona główna">
      <Mark light={light} />
      <span className="brand-words"><strong>LUMA</strong><small>DENTAL STUDIO</small></span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, text, centered = false }: { eyebrow: string; title: ReactNode; text?: string; centered?: boolean }) {
  return (
    <div className={`section-heading${centered ? " section-heading--center" : ""}`}>
      <div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

const treatmentIcons = {
  tooth: HeartPulse,
  sparkles: Sparkles,
  braces: AlignCenter,
  shield: ShieldCheck
} as const;

type FormFields = { name: string; email: string; service: string; message: string };
const initialForm: FormFields = { name: "", email: "", service: "", message: "" };

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePrice, setActivePrice] = useState<string>(priceGroups[0].id);
  const [form, setForm] = useState<FormFields>(initialForm);
  const [website, setWebsite] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [formError, setFormError] = useState("");
  const currentPrice = priceGroups.find((group) => group.id === activePrice) ?? priceGroups[0];

  const closeMenu = () => setMenuOpen(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === "sending") return;

    setFormError("");
    setFormStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website })
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Nie udało się wysłać wiadomości. Spróbuj ponownie.");
      }
      setForm({ ...initialForm });
      setWebsite("");
      setFormStatus("success");
    } catch (error) {
      setFormStatus("idle");
      setFormError(error instanceof Error ? error.message : "Nie udało się wysłać wiadomości. Spróbuj później.");
    }
  };

  return (
    <>
      <div id="top" className="site-top-anchor" />
      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <nav id="primary-nav" className={`nav${menuOpen ? " nav--open" : ""}`} aria-label="Nawigacja główna">
            <a href="#o-nas" onClick={closeMenu}>O nas</a>
            <a href="#uslugi" onClick={closeMenu}>Usługi</a>
            <a href="#zespol" onClick={closeMenu}>Nasz zespół</a>
            <a href="#cennik" onClick={closeMenu}>Cennik</a>
            <a href="#kontakt" onClick={closeMenu}>Kontakt</a>
            <a href="#kontakt" className="mobile-nav-cta" onClick={closeMenu}>Umów konsultację <ArrowUpRight size={17}/></a>
          </nav>
          <a className="button button--dark header-cta" href="#kontakt">Umów konsultację <ArrowUpRight size={17} strokeWidth={1.8} /></a>
          <button className="mobile-toggle" type="button" aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"} aria-controls="primary-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen((x) => !x)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero__grid">
            <div className="hero__copy">
              <div className="hero__eyebrow"><span className="asterisk">✳</span> NOWY WYMIAR STOMATOLOGII</div>
              <h1 id="hero-heading">Uśmiech, który <em>jest naprawdę</em> Twój.</h1>
              <p className="hero__lead">Nowoczesna stomatologia w miejscu, w którym liczy się nie tylko efekt, ale też Twoje samopoczucie. Bez pośpiechu. Z uważnością. Dla Ciebie.</p>
              <div className="hero__actions">
                <a href="#kontakt" className="button button--cream">Umów pierwszą wizytę <ArrowUpRight size={18} strokeWidth={1.8} /></a>
                <a href="#uslugi" className="text-link text-link--light">Poznaj nasze usługi <ArrowRight size={18} strokeWidth={1.7} /></a>
              </div>
              <div className="hero__note"><div className="hero__note-icon"><Heart size={18} strokeWidth={1.5} /></div><p>Twoje zdrowie.<br /><strong>Nasza wspólna troska.</strong></p></div>
            </div>
            <div className="hero__visual">
              <div className="hero__image-wrap">
                <Image className="cover-image hero__image" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1300&q=85" alt="Jasne, nowoczesne wnętrze gabinetu stomatologicznego" fill priority sizes="(max-width: 900px) 100vw, 48vw" unoptimized />
              </div>
              <div className="hero__floating"><span className="floating-icon"><Sparkles size={23} strokeWidth={1.4} /></span><span>Więcej niż wizyta.<br /><strong>Dobre doświadczenie.</strong></span></div>
              <div className="hero__image-label">STWORZENI DO TWOJEGO UŚMIECHU <span>01 / 03</span></div>
            </div>
          </div>
          <div className="hero__bottom container"><span>POZNAŃ · JEŻYCE</span><a href="#o-nas">ODKRYJ NASZ ŚWIAT <ArrowDown size={14}/></a><span>STOMATOLOGIA Z UWAŻNOŚCIĄ</span></div>
        </section>

        <section className="intro section-pad" id="o-nas">
          <div className="container intro__grid">
            <div className="intro__left"><span className="eyebrow"><span className="eyebrow-line" /> KILKA SŁÓW O NAS</span><div className="intro__deco">✳</div></div>
            <div className="intro__right">
              <h2>Wierzymy, że dobre leczenie zaczyna się od <em>dobrego podejścia.</em></h2>
              <div className="intro__bottom"><p>W LUMA łączymy doświadczenie, nowoczesne rozwiązania i prawdziwą uważność na człowieka. Bo piękny uśmiech to coś więcej niż zdrowe zęby — to swoboda bycia sobą.</p><a href="#zespol" className="circle-arrow" aria-label="Poznaj nasz zespół"><ArrowUpRight size={23} strokeWidth={1.5}/></a></div>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="uslugi">
          <div className="container">
            <div className="services__heading-row">
              <SectionHeading eyebrow="JAK MOŻEMY POMÓC" title={<>Wszystko, czego potrzebuje <em>Twój uśmiech.</em></>} text="Kompleksowa opieka w jednym miejscu. Poznaj nasze obszary specjalizacji." />
              <a className="text-link" href="#cennik">Sprawdź cennik <ArrowUpRight size={19} strokeWidth={1.7}/></a>
            </div>
            <div className="service-grid">
              {treatments.map((service) => {
                const Icon = treatmentIcons[service.icon];
                return <a key={service.number} href={service.href} className="service-card">
                  <div className="service-card__top"><span>{service.number} / 04</span><MoveUpRight size={18} strokeWidth={1.6}/></div>
                  <span className="service-card__icon"><Icon size={31} strokeWidth={1.25}/></span>
                  <div className="service-card__body"><span className="service-card__subtitle">{service.subtitle}</span><h3>{service.title}</h3><p>{service.description}</p></div>
                  <span className="service-card__bottom">Dowiedz się więcej <ArrowRight size={17}/></span>
                </a>;
              })}
            </div>
          </div>
        </section>

        <section className="approach" aria-labelledby="approach-heading">
          <div className="approach__photo">
            <Image className="cover-image" src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1250&q=85" alt="Stomatolog podczas konsultacji z pacjentem" fill sizes="(max-width: 860px) 100vw, 50vw" unoptimized />
            <div className="approach__photo-tag">TROSKA W KAŻDYM DETALU <span>↗</span></div>
          </div>
          <div className="approach__content">
            <div className="approach__content-inner">
              <div className="eyebrow"><span className="eyebrow-line" /> NASZA FILOZOFIA</div>
              <h2 id="approach-heading">Mniej stresu.<br /><em>Więcej uśmiechu.</em></h2>
              <p>Wiemy, że wizyta u dentysty może budzić emocje. Dlatego stworzyliśmy przestrzeń, w której możesz poczuć się swobodnie, zadawać pytania i podejmować świadome decyzje.</p>
              <div className="benefit-list">
                <div><CircleCheck size={20} strokeWidth={1.6}/><span>Indywidualny plan leczenia</span></div>
                <div><CircleCheck size={20} strokeWidth={1.6}/><span>Jasna komunikacja na każdym etapie</span></div>
                <div><CircleCheck size={20} strokeWidth={1.6}/><span>Nowoczesna diagnostyka i technologie</span></div>
              </div>
              <a className="button button--dark" href="#kontakt">Poznaj nas bliżej <ArrowUpRight size={18}/></a>
            </div>
          </div>
        </section>

        <section className="team section-pad" id="zespol">
          <div className="container">
            <div className="team__heading-row"><SectionHeading eyebrow="LUDZIE ZA TWOIM UŚMIECHEM" title={<>Profesjonaliści z <em>sercem.</em></>} text="Nie tylko leczymy zęby. Słuchamy, wyjaśniamy i budujemy relacje oparte na zaufaniu." /><div className="team__side-note">POZNAJ LUDZI,<br />KTÓRZY TWORZĄ LUMA <span>↗</span></div></div>
            <div className="team-grid">
              {team.map((doctor, idx) => <article className="team-card" key={doctor.name}>
                <div className="team-card__image-wrap"><Image className="cover-image team-card__image" src={doctor.image} alt={`Zdjęcie ilustracyjne lekarza — profil ${doctor.name}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{objectPosition: doctor.position}} unoptimized /><div className="team-card__number">0{idx + 1} / 03</div></div>
                <div className="team-card__details"><span>{doctor.role}</span><h3>{doctor.name}</h3><p>{doctor.description}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="pricing section-pad" id="cennik">
          <div className="container">
            <div className="pricing__heading-row"><SectionHeading eyebrow="PRZEJRZYSTE ZASADY" title={<>Twój uśmiech, <em>jasne warunki.</em></>} text="Poznaj orientacyjne ceny wybranych zabiegów. Dokładny koszt leczenia ustalamy podczas konsultacji." /><div className="pricing__sticker">DOBRZE WIEDZIEĆ <span>✳</span></div></div>
            <div className="pricing__layout">
              <div className="pricing__tabs" role="tablist" aria-label="Kategorie cennika">
                {priceGroups.map((group, index) => <button key={group.id} type="button" id={`tab-${group.id}`} role="tab" aria-selected={activePrice === group.id} aria-controls="pricing-panel" className={`pricing__tab${activePrice === group.id ? " pricing__tab--active" : ""}`} onClick={() => setActivePrice(group.id)}><span>0{index + 1}</span>{group.label}<ArrowUpRight size={18}/></button>)}
                <div className="pricing__tabs-note"><Sparkles size={22} strokeWidth={1.5}/><p>Nie wiesz, od czego zacząć?<br /><strong>Chętnie Ci doradzimy.</strong></p><a href="#kontakt">Skontaktuj się <ArrowRight size={16}/></a></div>
              </div>
              <div className="pricing__panel" role="tabpanel" id="pricing-panel" aria-labelledby={`tab-${currentPrice.id}`} key={currentPrice.id}>
                <div className="pricing__panel-heading"><span>OFERTA / {currentPrice.label.toUpperCase()}</span><h3>{currentPrice.label}</h3><p>{currentPrice.description}</p></div>
                <div className="price-list">{currentPrice.items.map((item) => <div className="price-row" key={item.name}><div><h4>{item.name}</h4><p>{item.note}</p></div><strong>{item.price}</strong></div>)}</div>
                <p className="pricing__fineprint">* Ostateczny koszt leczenia jest ustalany indywidualnie podczas konsultacji.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey section-pad">
          <div className="container journey__grid"><div><div className="eyebrow"><span className="eyebrow-line" /> PROSTO I SPOKOJNIE</div><h2>Do pięknego uśmiechu<br />dzielą Cię <em>trzy kroki.</em></h2></div><div className="journey__steps"><div><span>01</span><div><h3>Porozmawiajmy</h3><p>Wybierz dogodny termin pierwszej konsultacji.</p></div></div><div><span>02</span><div><h3>Stwórzmy plan</h3><p>Poznamy Twoje potrzeby i zaproponujemy rozwiązania.</p></div></div><div><span>03</span><div><h3>Uśmiechnij się</h3><p>Zadbamy o leczenie i komfort na każdym etapie.</p></div></div></div></div>
        </section>

        <section className="faq section-pad" id="faq">
          <div className="container faq__grid"><div><SectionHeading eyebrow="DOBRZE WIEDZIEĆ" title={<>Odpowiedzi na <em>Twoje pytania.</em></>} text="Przygotowaliśmy odpowiedzi na pytania, które najczęściej pojawiają się przed pierwszą wizytą." /><a href="#kontakt" className="text-link">Masz inne pytanie? Napisz do nas <ArrowUpRight size={18}/></a></div><div className="faq__list">{faqs.map((faq, i) => <details className="faq__item" key={faq.question} open={i===0}><summary><span>{faq.question}</span><Plus className="faq__plus" size={21} strokeWidth={1.4}/></summary><p>{faq.answer}</p></details>)}</div></div>
        </section>

        <section className="contact" id="kontakt">
          <div className="container contact__grid">
            <div className="contact__info"><div className="eyebrow eyebrow--light"><span className="eyebrow-line" /> JESTEŚMY DLA CIEBIE</div><h2>Zrób pierwszy krok <em>do swojego uśmiechu.</em></h2><p className="contact__lead">Masz pytanie lub chcesz umówić pierwszą konsultację? Napisz do nas — chętnie porozmawiamy o Twoich potrzebach.</p><div className="contact__details"><div><span className="contact__detail-icon"><MapPin size={20}/></span><div><small>LOKALIZACJA</small><strong>{clinic.city}, {clinic.neighborhood}</strong></div></div><div><span className="contact__detail-icon"><Mail size={20}/></span><div><small>ADRES E-MAIL</small><strong>{clinic.emailDisplay}</strong></div></div><div><span className="contact__detail-icon"><Clock3 size={20}/></span><div><small>GODZINY OTWARCIA</small><strong>Pon. – pt. 08:00 – 20:00</strong></div></div></div></div>
            <div className="contact__form-wrap">
              <div className="contact__form-heading"><span>FORMULARZ KONTAKTOWY</span><h3>Porozmawiajmy.</h3><p>Wybierz temat i opisz, w czym możemy Ci pomóc.</p></div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div aria-hidden="true" className="form-honeypot">
                  <label>Strona internetowa (pozostaw puste)
                    <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="form-row">
                  <label>Imię i nazwisko
                    <input autoComplete="name" name="name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Jan Kowalski" required minLength={2} maxLength={100} />
                  </label>
                  <label>Adres e-mail
                    <input autoComplete="email" type="email" name="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} placeholder="jan@email.pl" required maxLength={150} />
                  </label>
                </div>
                <label>W czym możemy pomóc?
                  <span className="select-wrap"><select name="service" value={form.service} onChange={(e) => setForm({...form,service:e.target.value})} required>
                    <option value="" disabled>Wybierz temat</option>
                    {contactTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                  </select><ChevronDown size={18}/></span>
                </label>
                <label>Twoja wiadomość
                  <textarea name="message" value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} placeholder="Napisz nam kilka słów..." rows={3} minLength={10} maxLength={2000} required />
                </label>
                <p className="form-disclaimer">Nie przesyłaj informacji o stanie zdrowia ani dokumentacji medycznej. Użyj formularza do ogólnych pytań i próśb o kontakt.</p>
                <button className="button button--dark form-submit" type="submit" disabled={formStatus === "sending"}>
                  {formStatus === "sending" ? "Wysyłanie..." : "Wyślij zapytanie"} <ArrowUpRight size={19}/>
                </button>
                {formError && <p className="form-status form-status--error" role="alert">{formError}</p>}
                {formStatus === "success" && <p className="form-status form-status--success" role="status">Wiadomość została wysłana. Dziękujemy za kontakt!</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="container"><div className="footer__top"><div className="footer__about"><Brand light/><p>Stomatologia, w której najważniejszy jest człowiek. Z troską o zdrowie i piękno Twojego uśmiechu.</p></div><div className="footer__links"><span>ODKRYWAJ</span><a href="#o-nas">O nas</a><a href="#uslugi">Usługi</a><a href="#zespol">Zespół</a><a href="#cennik">Cennik</a></div><div className="footer__links"><span>INFORMACJE</span><a href="#kontakt">Kontakt</a><a href="#faq">Najczęstsze pytania</a><a href="#kontakt">Godziny otwarcia</a></div><div className="footer__closing"><span>POZOSTAŃMY W KONTAKCIE</span><h3>Uśmiechaj się <em>częściej.</em></h3><a href="#kontakt" className="footer__circle" aria-label="Przejdź do formularza kontaktowego"><ArrowUpRight size={26}/></a></div></div><div className="footer__bottom"><p>© {new Date().getFullYear()} LUMA Dental Studio. Wszelkie prawa zastrzeżone.</p><a href="#top">WRÓĆ NA GÓRĘ ↑</a></div></div></footer>
    </>
  );
}