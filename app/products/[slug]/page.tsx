import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS, productPath } from "@/lib/products";
import { Footer, Nav } from "@/components/Chrome";
import BuyLink from "@/components/BuyLink";
import CopyPrompt from "@/components/CopyPrompt";
import StickyBuy from "@/components/StickyBuy";
import SubscribeForm from "@/components/SubscribeForm";
import Viewfinder from "@/components/Viewfinder";
import { Check, Cross, Spark } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.tagline} ${p.altNames[0]}: $${p.price.amount}, instant download.`,
    alternates: { canonical: productPath(p) },
  };
}

const NAV = [
  { href: "#inside", label: "What's inside" },
  { href: "#sample", label: "Sample prompt" },
  { href: "#faq", label: "FAQ" },
];

export default async function ProductPage({ params }: Props) {
  const p = find((await params).slug);
  if (!p) notFound();

  return (
    <>
      <Nav links={NAV} />
      <main id="main">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="kicker"><Spark />{p.altNames[0]}, for {p.audience.toLowerCase()}</p>
              <h1>{p.name}</h1>
              <p className="lead">{p.tagline}</p>
              <div className="buyrow">
                <BuyLink product={p} id="hero-buy" />
                <p className="fine">Instant download from Whop.<br />Digital product, no refunds.</p>
              </div>
              <dl className="spec">
                {p.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.value}</dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {p.video ? <Viewfinder video={p.video} /> : null}
          </div>
        </section>

        <section className="section problem" aria-labelledby="flop">
          <div className="wrap">
            <div className="section-head">
              <h2 id="flop">You&apos;ve tried it. The room melted.</h2>
              <p className="lead">Typing &quot;video of a living room&quot; into an AI tool gets you one of two results, and neither belongs on your feed.</p>
            </div>
            <div className="walls">
              <div className="wall">
                <h3>It looks fake</h3>
                <p>Plastic light, walls that bend, a sofa that dissolves into the rug. Clients scroll straight past, or worse, they notice.</p>
              </div>
              <div className="wall">
                <h3>It isn&apos;t your room anymore</h3>
                <p>AI loves to &quot;improve&quot; things: a bigger window, an extra lamp, a door that wasn&apos;t there. That&apos;s not a portfolio, it&apos;s a problem.</p>
              </div>
            </div>
            <div className="lockline">
              <div>
                <h3>Animate the camera. Never change the room.</h3>
                <p className="muted" style={{ marginTop: 12 }}>Every prompt ends with a lock line that keeps your walls, windows and furniture exactly as you designed them. Only the camera, the light and small details move.</p>
              </div>
              <code>
                <b>Walls, windows, doors, ceiling, floor and furniture stay exactly as in @Image 1.</b> Nothing is added, removed or resized.
              </code>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="ten">
          <div className="wrap">
            <div className="section-head">
              <h2 id="ten">10 ad stories, 10 shots each</h2>
              <p className="lead">Pick the one that fits the project you already have. Each chapter walks you through every shot.</p>
            </div>
            <ol className="ads">
              {p.ads.map((a) => (
                <li className="ad" key={a.n}>
                  <Image src={a.img.src} alt={a.img.alt} width={a.img.width} height={a.img.height} sizes="(max-width:640px) 72vw, (max-width:1000px) 30vw, 220px" />
                  <span className="n">Chapter {a.n}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </li>
              ))}
            </ol>
            <p className="note">Images are AI-generated illustrations of each ad type.</p>
          </div>
        </section>

        <section className="section problem" id="inside" aria-labelledby="inside-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="inside-h">Three books. One job: your next ad.</h2>
              <p className="lead">Delivered as one ZIP: the {p.altNames[1]} guide, a prompt library you copy from, and worksheets you plan on.</p>
            </div>
            <div className="inside">
              <Image src={p.cover.src} alt={p.cover.alt} width={p.cover.width} height={p.cover.height} sizes="(max-width:880px) 92vw, 620px" />
              <div className="books">
                {p.includes.map((b) => (
                  <div className="book" key={b.title}>
                    <header><h3>{b.title}</h3><span>{b.meta}</span></header>
                    <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="sample" aria-labelledby="sample-h">
          <div className="wrap">
            <div className="night">
              <div>
                <h2 id="sample-h">Read a real prompt before you buy</h2>
                <p className="lead" style={{ marginTop: 14 }}>Shot 5 of 100: the reveal from Chapter 1, The Swipe. Every prompt is written the same way, so the AI knows the space, the camera, the timing and the sound.</p>
                <ul>
                  <li><Check />Exact lens and camera move, one per shot</li>
                  <li><Check />Second-by-second action timing</li>
                  <li><Check />A lock line so your room never changes</li>
                  <li><Check />Sound effects only: you add music and text in CapCut</li>
                </ul>
              </div>
              <div className="prompt">
                <div className="prompt-head">
                  <span>{p.samplePrompt.label}</span>
                  <CopyPrompt text={p.samplePrompt.text} />
                </div>
                <pre tabIndex={0} aria-label="Sample prompt text">{p.samplePrompt.text}</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="how">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how">Your first ad takes an afternoon. Your third, about an hour.</h2>
            </div>
            <ol className="steps">
              {p.steps.map((s) => (
                <li className="step" key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section problem" aria-labelledby="fit-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="fit-h">Made for designers with work to show</h2>
            </div>
            <div className="fit">
              <div className="yes">
                <h3>A great fit if you</h3>
                <ul>{p.fitFor.map((t) => <li key={t}><Check />{t}</li>)}</ul>
              </div>
              <div className="no">
                <h3>Not for you if you</h3>
                <ul>{p.notFor.map((t) => <li key={t}><Cross />{t}</li>)}</ul>
              </div>
              <div>
                <h3>What you&apos;ll need</h3>
                <ul className="tools">
                  {p.tools.map((t) => (
                    <li key={t.role}><small>{t.role}</small><b>{t.name}</b><span className="muted">{t.note}</span></li>
                  ))}
                </ul>
                <p className="aside">AI tools aren&apos;t included and are paid separately. Plan on a few dollars of credits per ad.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="free" aria-labelledby="free-h">
          <div className="wrap">
            <div className="free">
              <div>
                <h2 id="free-h">Not sure yet? Try a prompt free.</h2>
                <p className="lead" style={{ marginTop: 14 }}>We&apos;ll email you one prompt from the kit. Make one clip and see how your room looks before you spend $9.</p>
              </div>
              <SubscribeForm source={p.slug} />
            </div>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-h" style={{ paddingTop: 0 }}>
          <div className="wrap faq">
            <div>
              <h2 id="faq-h">Before you buy</h2>
              <p className="lead" style={{ marginTop: 14 }}>Something else? Email <a className="textlink" href="mailto:info@nyt-studios.com">info@nyt-studios.com</a>.</p>
            </div>
            <div>
              {p.faq.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap final">
            <h2>Your rooms are ready to move.</h2>
            <BuyLink product={p} />
            <p className="fine">Instant download from Whop. Digital product, no refunds.</p>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBuy product={p} watchId="hero-buy" />
    </>
  );
}
