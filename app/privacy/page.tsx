import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT, LEGAL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What ${SITE.name} collects, why, who we share it with, and how to get your data deleted.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary={
        <p>
          In short: we collect your email only if you ask for the free prompt, we use ad cookies only as described below,
          payments are handled by Whop, and you can ask us to delete your data at any time by emailing{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      }
    >
      <h2 id="who">Who we are</h2>
      <p>
        {SITE.name} ({SITE.url.replace("https://", "")}) is run by {LEGAL.entity}, {LEGAL.address} (&quot;we&quot;, &quot;us&quot;).
        We are responsible for the personal data described in this policy.
      </p>

      <h2 id="collect">What we collect and why</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Data</th><th>When</th><th>Why</th><th>Legal basis</th></tr>
          </thead>
          <tbody>
            <tr><td>Email address</td><td>You ask for the free prompt</td><td>To send the prompt and occasional emails about our kits</td><td>Your consent</td></tr>
            <tr><td>Page views, referrer, device type, country</td><td>Every visit</td><td>To see which pages work, without cookies or identifying you</td><td>Legitimate interest</td></tr>
            <tr><td>Ad cookies and click IDs (Meta Pixel, Whop Pixel)</td><td>Only as described under Cookies</td><td>To see which ads bring visitors and sales</td><td>Consent (or your right to opt out, depending on where you live)</td></tr>
            <tr><td>Name, email, payment and order details</td><td>You buy on Whop</td><td>To take payment and deliver your files. Whop processes these; we see order details</td><td>Contract</td></tr>
            <tr><td>Messages you send us</td><td>You email or WhatsApp us</td><td>To reply to you</td><td>Legitimate interest</td></tr>
          </tbody>
        </table>
      </div>
      <p>We never see or store your card details.</p>

      <h2 id="cookies">Cookies</h2>
      <ul>
        <li><b>Essential:</b> we store your cookie choice in your browser, and a short-lived cookie with your country so we know which choice to offer. These are always on.</li>
        <li><b>Ad measurement:</b> the Meta Pixel (cookies such as <code>_fbp</code>) and the Whop Pixel measure which ads lead to visits and purchases.</li>
      </ul>
      <p>
        If you are in the EU, EEA, UK or Switzerland, ad measurement stays off until you click Accept. Everywhere else it is on by default and you can turn it off.
        You can change your choice at any time with &quot;Cookie settings&quot; at the bottom of every page.
      </p>
      <p>Our site analytics (Vercel Web Analytics) uses no cookies.</p>

      <h2 id="share">Who we share it with</h2>
      <p>We don&apos;t sell your data. We use these service providers, who process it for us:</p>
      <ul>
        <li><b>Vercel</b> (USA): hosts the site and provides cookieless analytics.</li>
        <li><b>Whop</b> (USA): checkout, payment and file delivery. Whop&apos;s own privacy policy also applies when you buy.</li>
        <li><b>Brevo</b> (France): stores the email list and sends our emails.</li>
        <li><b>Cloudflare</b> (USA): Turnstile checks that form submissions come from people, not bots.</li>
        <li><b>Meta</b> (USA/Ireland): ad measurement, only as described under Cookies.</li>
      </ul>
      <p>Some of these providers store data outside India or your country. We rely on their contractual safeguards for these transfers.</p>

      <h2 id="keep">How long we keep it</h2>
      <ul>
        <li>Email list: until you unsubscribe or ask us to delete it.</li>
        <li>Order records: as long as tax and accounting law requires.</li>
        <li>Messages: up to 2 years after our last conversation.</li>
      </ul>

      <h2 id="rights">Your rights</h2>
      <p>
        Depending on where you live (including under India&apos;s Digital Personal Data Protection Act, 2023 and the EU/UK GDPR), you can ask us to:
        access your data, correct it, delete it, or stop using it for marketing. You can withdraw consent at any time; every email has an unsubscribe link.
        EU/UK residents can also complain to their data protection authority.
      </p>
      <p>We reply within 30 days. We may ask you to confirm your identity first.</p>

      <h2 id="grievance">Grievances and contact</h2>
      <p>
        For any privacy question or complaint, contact our grievance officer at{" "}
        <a href={`mailto:${LEGAL.grievanceEmail}`}>{LEGAL.grievanceEmail}</a>, or write to {LEGAL.entity}, {LEGAL.address}.
      </p>

      <h2 id="children">Children</h2>
      <p>This site and our products are for adults. We don&apos;t knowingly collect data from anyone under 18.</p>

      <h2 id="changes">Changes</h2>
      <p>
        If we change this policy, we&apos;ll update the date at the top. Significant changes will also be announced on this page.
        See also our <Link href="/terms">Terms</Link> and <Link href="/refunds">Refund Policy</Link>.
      </p>
    </LegalPage>
  );
}
