import Image from "next/image";
import Link from "next/link";
import { INTERIOR_PROMPTS as p, productPath } from "@/lib/products";
import { SITE } from "@/lib/site";
import { Footer, Nav } from "@/components/Chrome";
import BuyLink from "@/components/BuyLink";
import SubscribeForm from "@/components/SubscribeForm";
import { Spark } from "@/components/icons";

const NAV = [
  { href: productPath(p), label: "Prompt kit" },
  { href: "#free", label: "Free prompt" },
  { href: SITE.agencyUrl, label: "Ad studio" },
];

export default function Home() {
  return (
    <>
      <Nav links={NAV} />
      <main id="main">
        <section className="home-hero">
          <div className="wrap">
            <p className="kicker"><Spark />From the NYT Studios ad team</p>
            <h1>Make the AI ads yourself.</h1>
            <p className="lead">We make AI video ads for brands. Here we package what works into prompt kits you can use on your own projects, starting with interior design.</p>
          </div>
        </section>

        <section className="wrap" aria-labelledby="kit-h">
          <article className="feature">
            <Image src={p.cover.src} alt={p.cover.alt} width={p.cover.width} height={p.cover.height} sizes="(max-width:880px) 92vw, 680px" priority />
            <div className="body">
              <span className="tag">For {p.audience.toLowerCase()}</span>
              <h2 id="kit-h">{p.name}</h2>
              <p className="muted">{p.tagline}</p>
              <div className="links">
                <BuyLink product={p} />
                <Link className="textlink" href={productPath(p)}>See what&apos;s inside</Link>
              </div>
            </div>
          </article>
        </section>

        <section className="section" id="free" aria-labelledby="free-h">
          <div className="wrap">
            <div className="free">
              <div>
                <h2 id="free-h">More kits are in production.</h2>
                <p className="lead" style={{ marginTop: 14 }}>Try one interior design prompt free now, and get an email when the next kit is out.</p>
              </div>
              <SubscribeForm source="home" />
            </div>
          </div>
        </section>

        <section className="wrap" style={{ paddingBottom: "clamp(64px,9vw,120px)" }}>
          <div className="studio">
            <div>
              <h2>Rather have the ad made for you?</h2>
              <p>NYT Studios, our ad studio, makes realistic AI video ads for real estate, interiors, pharma and more.</p>
            </div>
            <a className="ghost" href={SITE.agencyUrl}>Visit NYT Studios</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
