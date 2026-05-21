import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

type IconName = 'feed' | 'news' | 'perf' | 'live' | 'wallet' | 'profile' | 'message' | 'search' | 'club' | 'press';

const APP_URL = 'https://choosemeapp.gtsarlu.com/';
const LOGIN_URL = 'https://choosemeapp.gtsarlu.com/#/login';
const REDIRECT_PATH = '/redirection';

const navItems = [
  ['Accueil', 'accueil'],
  ['App', 'app'],
  ['Talents', 'talents'],
  ['Live', 'live'],
  ['Tarifs', 'tarifs'],
] as const;

const roles = [
  {
    icon: 'perf',
    title: 'Athletes',
    text: 'Publie tes performances, complete ton profil et montre ton niveau aux bonnes personnes.',
  },
  {
    icon: 'search',
    title: 'Recruteurs',
    text: 'Repere les talents par sport, poste, ville, video, statistiques et signaux de progression.',
  },
  {
    icon: 'club',
    title: 'Clubs',
    text: 'Organise tes recherches, compare les profils et transforme les coups de coeur en essais.',
  },
  {
    icon: 'press',
    title: 'Presse',
    text: 'Trouve des histoires sportives, des reportages et des moments forts prets a etre suivis.',
  },
] satisfies Array<{ icon: IconName; title: string; text: string }>;

const featureTabs = [
  {
    icon: 'feed',
    title: 'Feed',
    label: 'Videos verticales',
    text: 'Un fil court et direct pour regarder les performances, aimer, commenter, partager et ouvrir le profil.',
  },
  {
    icon: 'profile',
    title: 'Profil',
    label: 'Carte sportive',
    text: 'Photo, ville, sport, poste, taille, poids, statistiques, videos et informations utiles au meme endroit.',
  },
  {
    icon: 'live',
    title: 'Live',
    label: 'Matchs et pronostics',
    text: 'Calendrier, score, choix de pronostic, recompenses en points et suivi des matchs importants.',
  },
  {
    icon: 'search',
    title: 'Talents',
    label: 'Recherche recruteur',
    text: 'Filtres simples pour trouver un joueur, sauvegarder un profil et demarrer une conversation.',
  },
] satisfies Array<{ icon: IconName; title: string; label: string; text: string }>;

const pricing = [
  {
    name: 'Gratuit',
    price: '0 USD',
    period: '',
    items: ['Compte personnel', 'Acces au feed', 'Profil de base', 'Live et wallet'],
  },
  {
    name: 'Pro Athlete',
    price: '1 USD',
    period: '/mois',
    items: ['Videos illimitees', 'Statistiques avancees', 'Meilleure visibilite', 'Profil prioritaire'],
    featured: true,
  },
  {
    name: 'Recruteur Pro',
    price: '10 USD',
    period: '/trimestre',
    items: ['3 premiers mois gratuits', 'Recherche avancee', 'Favoris', 'Contact direct'],
  },
  {
    name: 'Club',
    price: '10 USD',
    period: '/trimestre',
    items: ['3 premiers mois gratuits', 'Pipeline de talents', 'Support prioritaire', 'Acces club'],
  },
  {
    name: 'Presse',
    price: '0 USD',
    period: '',
    items: ['Compte presse', 'Reportages', 'Explorer', 'Publication de contenu'],
  },
  {
    name: 'Visiteur',
    price: '0 USD',
    period: '',
    items: ['Decouverte du feed', 'Actus', 'Live public', 'Creation de compte possible'],
  },
];

function App() {
  const isRedirectPage = window.location.pathname === REDIRECT_PATH;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [pointer, setPointer] = useState({ x: 52, y: 22 });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPointer({
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100),
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.section, .live-section, .recruiter-section, .create-account, .faq-footer, .proof-card, .role-card, .journey-card, .price-card',
    );

    targets.forEach((target, index) => {
      target.classList.add('reveal');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const style = useMemo(
    () => ({ '--spot-x': `${pointer.x}%`, '--spot-y': `${pointer.y}%` }) as CSSProperties,
    [pointer],
  );

  return (
    <main className="site-shell" style={style}>
      {isRedirectPage ? (
        <RedirectPage />
      ) : (
        <>
          {showSplash && <SiteSplash onSkip={() => setShowSplash(false)} />}
          <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <Hero />
          <AppPreview activeTab={activeTab} setActiveTab={setActiveTab} />
          <Roles />
          <HowItWorks />
          <LiveWallet />
          <RecruiterSection />
          <Proof />
          <Pricing />
          <CreateAccount />
          <Faq />
        </>
      )}
    </main>
  );
}

function RedirectPage() {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    const redirect = window.setTimeout(() => {
      window.location.href = APP_URL;
    }, 3000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, []);

  return (
    <section className="redirect-page">
      <div className="redirect-card">
        <span className="splash-logo">
          <img src="/images/logo.png" alt="" />
        </span>
        <span className="eyebrow">Choose-Me</span>
        <h1>Ouverture de l'application</h1>
        <p>Tu vas etre redirige vers Choose-Me dans {seconds} seconde{seconds > 1 ? 's' : ''}.</p>
        <div className="redirect-progress">
          <i />
        </div>
        <a className="primary-button big" href={APP_URL}>
          Continuer maintenant <span>→</span>
        </a>
      </div>
    </section>
  );
}

function SiteSplash({ onSkip }: { onSkip: () => void }) {
  return (
    <button className="site-splash" onClick={onSkip} aria-label="Entrer sur le site">
      <span className="splash-logo">
        <img src="/images/logo.png" alt="" />
      </span>
      <strong>
        Choose<span>-Me</span>
      </strong>
      <small>Propulser les talents</small>
    </button>
  );
}

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="header">
      <a className="brand" href="#accueil" aria-label="Choose Me">
        <img src="/images/logo.png" alt="" />
        <span>
          Choose<b>-Me</b>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Navigation principale">
        {navItems.map(([label, id]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="login-link" href={LOGIN_URL}>
          Se connecter
        </a>
        <a className="primary-button" href={REDIRECT_PATH}>
          Commencer <span>→</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '×' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a className="primary-button" href={REDIRECT_PATH} onClick={() => setMenuOpen(false)}>
            Commencer <span>→</span>
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="accueil">
      <div className="hero-banner-image" aria-hidden="true">
        <img src="/images/football.jpg" alt="" />
      </div>
      <div className="hero-copy">
        <span className="eyebrow">Choose-Me</span>
        <h1>#1 reseau social sportif africain de decouverte des talents.</h1>
        <p>
          Publie tes performances, suis les matchs, gagne en visibilite et connecte-toi aux recruteurs, clubs et medias
          qui cherchent les talents de demain.
        </p>
      </div>

      <div className="hero-cta-zone">
        <div className="hero-actions">
          <a className="secondary-button" href={LOGIN_URL}>
            Se connecter
          </a>
          <a className="primary-button big" href={REDIRECT_PATH}>
            Commencer <span>→</span>
          </a>
        </div>
        <div className="hero-metrics" aria-label="Fonctions principales">
          <span><b>Feed</b> video</span>
          <span><b>Live</b> match</span>
          <span><b>Wallet</b> points</span>
        </div>
      </div>

      <div className="hero-visual" aria-label="Apercu de Choose Me">
        <IPhoneFeed />
        <div className="hero-card">
          <AppIcon name="perf" />
          <strong>Performance publiee</strong>
          <span>Visible dans le feed</span>
        </div>
      </div>
    </section>
  );
}

function AppPreview({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (index: number) => void;
}) {
  const active = featureTabs[activeTab];

  return (
    <section className="section app-preview" id="app">
      <div className="section-heading">
        <span className="eyebrow">Dans l'app</span>
        <h2>Chaque ecran sert une action claire.</h2>
        <p>Regarder une video, ouvrir un profil, pronostiquer, sauvegarder un talent ou envoyer un message.</p>
      </div>

      <div className="preview-grid">
        <div className="tab-list" role="tablist" aria-label="Apercus de l'application">
          {featureTabs.map((item, index) => (
            <button
              key={item.title}
              className={index === activeTab ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab(index)}
              role="tab"
              aria-selected={index === activeTab}
            >
              <AppIcon name={item.icon} />
              <span>
                <b>{item.title}</b>
                <small>{item.label}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="active-copy">
          <AppIcon name={active.icon} />
          <span>{active.label}</span>
          <h3>{active.title}</h3>
          <p>{active.text}</p>
        </div>

        <div className="phone-switcher">
          {activeTab === 0 && <IPhoneFeed />}
          {activeTab === 1 && <AndroidProfile />}
          {activeTab === 2 && <LivePhone />}
          {activeTab === 3 && <ScoutPhone />}
        </div>
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section className="section" id="talents">
      <div className="section-heading">
        <span className="eyebrow">Pour tout l'ecosysteme</span>
        <h2>Un espace different selon ton role.</h2>
      </div>
      <div className="role-grid">
        {roles.map((role) => (
          <article className="role-card" key={role.title}>
            <AppIcon name={role.icon} />
            <h3>{role.title}</h3>
            <p>{role.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section journey">
      <div className="section-heading">
        <span className="eyebrow">Parcours</span>
        <h2>Tu crees ton compte, tu choisis ton role, tu avances.</h2>
      </div>
      <div className="journey-grid">
        {[
          ['01', 'Choisis ton type de compte', 'Athlete, recruteur, club ou presse.'],
          ['02', 'Complete ton profil', 'Sport, poste, ville, photo, stats et videos.'],
          ['03', 'Entre dans le feed', 'Tes performances deviennent visibles.'],
          ['04', 'Connecte-toi', 'Messages, favoris, live, wallet et opportunites.'],
        ].map(([number, title, text]) => (
          <article className="journey-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LiveWallet() {
  return (
    <section className="live-section" id="live">
      <div className="live-copy">
        <span className="eyebrow">Live & wallet</span>
        <h2>Les matchs deviennent interactifs.</h2>
        <p>
          Suis les rencontres, fais tes pronostics, consulte tes points et garde une trace de tes resultats dans le
          wallet.
        </p>
        <div className="inline-stats">
          <span><b>1 280</b> points</span>
          <span><b>3</b> matchs actifs</span>
          <span><b>8</b> pronostics</span>
        </div>
      </div>
      <div className="live-phones">
        <LivePhone />
        <WalletPanel />
      </div>
    </section>
  );
}

function RecruiterSection() {
  return (
    <section className="recruiter-section">
      <div className="recruiter-visual">
        <ScoutPhone />
      </div>
      <div className="recruiter-copy">
        <span className="eyebrow">Recruteurs & clubs</span>
        <h2>Moins de bruit, plus de profils exploitables.</h2>
        <p>
          Un recruteur peut explorer les talents, lire les statistiques, ouvrir les videos, sauvegarder un profil et
          prendre contact sans perdre le fil.
        </p>
        <div className="check-list">
          {['Recherche par sport et poste', 'Profils publics detailles', 'Messages directs', 'Talents favoris'].map(
            (item) => (
              <span key={item}>
                <i>✓</i>
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="section proof">
      <div className="proof-card large">
        <span className="eyebrow">Feed</span>
        <h2>Le premier reflexe: regarder les performances.</h2>
        <p>
          Choose-Me met la video au centre, puis donne les bons chemins vers le profil, les messages, le live et les
          reportages.
        </p>
      </div>
      <div className="proof-card">
        <AppIcon name="message" />
        <strong>Contact direct</strong>
        <span>Un profil interesse un recruteur ? La conversation peut commencer.</span>
      </div>
      <div className="proof-card">
        <AppIcon name="news" />
        <strong>Explorer</strong>
        <span>Talents, actualites et reportages restent accessibles selon le role.</span>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section pricing" id="tarifs">
      <div className="section-heading">
        <span className="eyebrow">Tarifs</span>
        <h2>Commence gratuitement, evolue quand tu es pret.</h2>
      </div>
      <div className="pricing-grid">
        {pricing.map((plan) => (
          <article className={plan.featured ? 'price-card featured' : 'price-card'} key={plan.name}>
            <div>
              <h3>{plan.name}</h3>
              <strong>
                {plan.price}
                <small>{plan.period}</small>
              </strong>
            </div>
            <ul>
              {plan.items.map((item) => (
                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href={REDIRECT_PATH}>Choisir</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function CreateAccount() {
  return (
    <section className="create-account" id="creer-compte">
      <div className="create-copy">
        <span className="eyebrow">Creation de compte</span>
        <h2>Pas de demande d'acces. Tu t'inscris directement.</h2>
        <p>
          Lance l'app, choisis ton type de compte, complete ton profil et commence a publier ou explorer les talents.
        </p>
        <a className="primary-button big" href={REDIRECT_PATH}>
          Commencer <span>→</span>
        </a>
      </div>
      <SignupPhone />
    </section>
  );
}

function Faq() {
  return (
    <footer className="faq-footer">
      <div className="section-heading">
        <span className="eyebrow">Questions rapides</span>
        <h2>Avant d'entrer dans Choose-Me.</h2>
      </div>
      <div className="faq-grid">
        {[
          ['Qui peut creer un compte ?', 'Athletes, recruteurs, clubs, presse et visiteurs peuvent demarrer depuis l onboarding.'],
          ['Que publie un athlete ?', 'Des videos de performance, ses informations sportives et les elements utiles de son profil.'],
          ['A quoi sert le wallet ?', 'Il accompagne les pronostics et les points lies aux matchs live.'],
          ['Le site remplace-t-il l app ?', "Non. Il presente l experience et envoie vers la creation de compte."],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <div className="footer-line">
        <div>
          <span>Choose-Me</span>
          <p>Propulser les talents sportifs avec le feed, le live, le wallet et les profils publics.</p>
        </div>
        <div className="footer-links">
          <a href="#accueil">Accueil</a>
          <a href="#app">App</a>
          <a href="#tarifs">Tarifs</a>
          <a href={LOGIN_URL}>Se connecter</a>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© 2026 Choose-Me. Tous droits reserves.</small>
        <a href={REDIRECT_PATH}>Commencer</a>
      </div>
    </footer>
  );
}

function IPhoneFeed() {
  return (
    <div className="phone iphone">
      <div className="notch" />
      <div className="feed-screen">
        <img src="/images/football.jpg" alt="" />
        <div className="top-chip">Pour toi</div>
        <div className="side-actions">
          <button><AppIcon name="profile" /></button>
          <button><AppIcon name="message" /></button>
          <button><AppIcon name="news" /></button>
        </div>
        <div className="feed-caption">
          <strong>@junior.m</strong>
          <p>Acceleration, controle, frappe croisee.</p>
          <span>#Football #Attaquant #Kinshasa</span>
        </div>
        <BottomNavMock active="Feed" />
      </div>
    </div>
  );
}

function AndroidProfile() {
  return (
    <div className="phone android">
      <div className="android-status">
        <span>9:41</span>
        <i />
      </div>
      <div className="profile-screen">
        <div className="profile-cover">
          <img src="/images/athlete.jpg" alt="" />
        </div>
        <div className="profile-info">
          <img src="/images/athlete.jpg" alt="" />
          <div>
            <strong>Junior Mavula</strong>
            <span>Attaquant - Kinshasa</span>
          </div>
        </div>
        <div className="profile-stats">
          <span><b>34</b> videos</span>
          <span><b>14</b> matchs</span>
          <span><b>8</b> buts</span>
        </div>
        <div className="info-list">
          <p><b>Sport</b><span>Football</span></p>
          <p><b>Poste</b><span>Attaquant</span></p>
          <p><b>Taille</b><span>182 cm</span></p>
        </div>
        <BottomNavMock active="Profil" />
      </div>
    </div>
  );
}

function LivePhone() {
  return (
    <div className="phone live-phone">
      <div className="live-header">
        <AppIcon name="live" />
        <span>Match en direct</span>
      </div>
      <div className="score-card">
        <span>CM FC</span>
        <strong>2 : 1</strong>
        <span>Elite</span>
      </div>
      <div className="prediction-card">
        <p>Ton pronostic</p>
        <button>Victoire CM FC</button>
        <button>Nul</button>
        <button>Victoire Elite</button>
      </div>
      <div className="reward-card">
        <AppIcon name="wallet" />
        <div>
          <span>Recompense</span>
          <strong>+120 points</strong>
        </div>
      </div>
    </div>
  );
}

function WalletPanel() {
  return (
    <div className="wallet-panel">
      <AppIcon name="wallet" />
      <span>Wallet</span>
      <strong>1 280 pts</strong>
      <div className="wallet-bars">
        <i />
        <i />
        <i />
      </div>
      <p>Pronostics gagnes, points recus et historique des matchs.</p>
    </div>
  );
}

function ScoutPhone() {
  return (
    <div className="phone scout-phone">
      <div className="scout-search">
        <AppIcon name="search" />
        <span>Rechercher un talent</span>
      </div>
      <div className="filters">
        {['Football', 'Attaquant', '15-21', 'Kinshasa'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="talent-result">
        <img src="/images/football.jpg" alt="" />
        <div>
          <strong>Junior M.</strong>
          <span>Compatibilite 91%</span>
        </div>
        <button>Voir</button>
      </div>
      <div className="talent-result muted">
        <img src="/images/basketball.jpg" alt="" />
        <div>
          <strong>Sarah K.</strong>
          <span>Compatibilite 84%</span>
        </div>
        <button>Voir</button>
      </div>
      <BottomNavMock active="Talents" />
    </div>
  );
}

function SignupPhone() {
  return (
    <div className="phone signup-phone">
      <div className="signup-logo">
        <img src="/images/logo.png" alt="" />
        <strong>Choose-Me</strong>
        <span>Propulser les talents</span>
      </div>
      <div className="account-types">
        {[
          ['Athlete', 'Publier mes performances'],
          ['Recruteur', 'Trouver des talents'],
          ['Club', 'Suivre mes prospects'],
          ['Presse', 'Creer des reportages'],
        ].map(([title, text], index) => (
          <div className={index === 0 ? 'account-type active' : 'account-type'} key={title}>
            <span>{title}</span>
            <small>{text}</small>
          </div>
        ))}
      </div>
      <button>Continuer</button>
    </div>
  );
}

function BottomNavMock({ active }: { active: string }) {
  const items: Array<[IconName, string]> = [
    ['feed', 'Feed'],
    ['news', active === 'Talents' ? 'Talents' : 'Actu'],
    ['perf', 'Perfs'],
    ['live', 'Live'],
    ['wallet', 'Wallet'],
    ['profile', 'Profil'],
  ];

  return (
    <div className="bottom-nav-mock">
      {items.map(([icon, label]) => (
        <span className={active === label ? 'active' : ''} key={label}>
          <AppIcon name={icon} />
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}

function AppIcon({ name }: { name: IconName }) {
  return (
    <svg className={`app-icon icon-${name}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === 'feed' && (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <path d="M7 8h10M7 12h6" />
          <circle cx="9" cy="16" r="1.6" />
          <circle cx="15" cy="16" r="1.6" />
        </>
      )}
      {name === 'news' && (
        <>
          <rect x="4" y="4" width="10" height="16" rx="2" />
          <path d="M16 7h2.5A1.5 1.5 0 0 1 20 8.5V18a2 2 0 0 1-2 2H8M6.5 8.5h5M6.5 11.5h5M6.5 14.5h3" />
        </>
      )}
      {name === 'perf' && (
        <>
          <path d="M4 18v-3.5l3.5-3.5 3 3L17 8l3 3.5V18M4 18h16" />
          <circle cx="7.5" cy="7.5" r="2" />
          <circle cx="17" cy="6" r="1.4" />
        </>
      )}
      {name === 'live' && (
        <>
          <rect x="4" y="5" width="16" height="12" rx="3" />
          <path d="M10 16.5 9 19h6l-1-2.5" />
          <path d="M11 9 15 12 11 15Z" />
          <circle cx="7" cy="9" r="1" />
        </>
      )}
      {name === 'wallet' && (
        <>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 9h18M7 6V4h10v2" />
          <circle cx="16" cy="14" r="1.5" />
        </>
      )}
      {name === 'profile' && (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 19.5c.8-2.3 2.8-3.5 6-3.5s5.2 1.2 6 3.5" />
          <circle cx="18" cy="7" r="1.2" />
        </>
      )}
      {name === 'message' && (
        <>
          <path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9l-4.5 3V8A2 2 0 0 1 5 6Z" />
          <circle cx="9" cy="12" r="1.1" />
          <circle cx="13" cy="12" r="1.1" />
          <circle cx="17" cy="12" r="1.1" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4M8 11h6" />
        </>
      )}
      {name === 'club' && (
        <>
          <path d="M4 20V8l8-4 8 4v12M8 20v-7h8v7M8 9h.1M16 9h.1" />
        </>
      )}
      {name === 'press' && (
        <>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h8M8 14h5M7 6l5-3 5 3" />
        </>
      )}
    </svg>
  );
}

export default App;
