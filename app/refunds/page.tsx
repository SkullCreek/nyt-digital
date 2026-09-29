import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `${SITE.name} sells instant digital downloads. All sales are final, except when files don't arrive or won't open.`,
  alternates: { canonical: "/refunds" },
};

export default function Refunds() {
  return (
    <LegalPage
      title="Refund Policy"
      summary={
        <p>
          All sales are final. Our products are instant digital downloads, and the results depend on third-party AI models we don&apos;t control.
          If your files don&apos;t arrive or won&apos;t open, we&apos;ll fix it.
        </p>
      }
    >
      <h2 id="final">No refunds on digital products</h2>
      <p>You get the full files the moment you pay, and they can&apos;t be returned. So we don&apos;t offer refunds for:</p>
      <ul>
        <li>changing your mind after buying;</li>
        <li>results from AI tools, including outputs that look wrong, change your room, or take more generations than expected;</li>
        <li>price or feature changes in third-party tools such as Seedance, Higgsfield, Midjourney or CapCut;</li>
        <li>not having the tools, time or skills described on the product page.</li>
      </ul>
      <p>Please read the product page, the sample prompt and the FAQ before you buy. If you&apos;re unsure, try the free prompt first.</p>

      <h2 id="exceptions">When we do help</h2>
      <ul>
        <li><b>Files never arrived:</b> we&apos;ll resend them.</li>
        <li><b>Files are damaged or won&apos;t open:</b> we&apos;ll send a working copy.</li>
        <li><b>Charged twice for the same product:</b> we&apos;ll refund the duplicate.</li>
      </ul>
      <p>If we can&apos;t deliver working files within 7 days of your request, we&apos;ll refund you in full.</p>

      <h2 id="how">How to ask</h2>
      <p>
        Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> within 14 days of your purchase, with the email you used on Whop, your order ID and what went wrong.
        We reply within 2 working days.
      </p>

      <h2 id="chargebacks">Chargebacks</h2>
      <p>
        Please contact us before opening a dispute with your bank. Most delivery problems are fixed within a day.
        See also our <Link href="/terms">Terms</Link>.
      </p>
    </LegalPage>
  );
}
