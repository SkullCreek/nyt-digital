// Site nav and footer (server components).
import Link from "next/link";
import { INTERIOR_PROMPTS, buyInfo, productPath } from "@/lib/products";
import { CONTACT, LEGAL, SITE } from "@/lib/site";
import { Logo } from "./Logo";
import BuyLink from "./BuyLink";
import { CookieSettingsButton } from "./ConsentBanner";

export function Nav({ links }: { links: { href: string; label: string }[] }) {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <BuyLink product={buyInfo(INTERIOR_PROMPTS)} size="small" label="Get the prompts" />
      </div>
    </header>
  );
}

export function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="about">
            <Logo />
            <p>Prompt kits and tools from the team at NYT Studios, an AI video ad studio.</p>
          </div>
          <div>
            <h2>Shop</h2>
            <ul>
              <li><Link href={productPath(INTERIOR_PROMPTS)}>Interior design prompts</Link></li>
              <li><Link href="/#free">Try a prompt free</Link></li>
            </ul>
          </div>
          <div>
            <h2>Help</h2>
            <ul>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a href={`https://wa.me/${CONTACT.whatsapp}`} rel="noopener">WhatsApp {CONTACT.whatsappDisplay}</a></li>
              <li><a href={CONTACT.instagram} rel="noopener">Instagram {CONTACT.instagramHandle}</a></li>
            </ul>
          </div>
          <div>
            <h2>Policies</h2>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/refunds">Refunds</Link></li>
              <li><CookieSettingsButton /></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {year} {LEGAL.entity}. {SITE.name} is a brand of NYT Studios.</span>
          <a href={SITE.agencyUrl}>Need the ads made for you? Visit NYT Studios</a>
        </div>
      </div>
    </footer>
  );
}
