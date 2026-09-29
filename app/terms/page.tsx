import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT, LEGAL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms for buying and using digital products from ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      summary={
        <p>
          In short: you buy a licence to use our prompts and guides in your own work and your clients&apos; work. You can&apos;t resell or share the files.
          Results depend on third-party AI tools we don&apos;t control, and all sales are final (see the <Link href="/refunds">Refund Policy</Link>).
        </p>
      }
    >
      <h2 id="about">1. About these terms</h2>
      <p>
        These terms apply when you use {SITE.url.replace("https://", "")} or buy a product we sell. The seller is {LEGAL.entity}, {LEGAL.address},
        trading as NYT Studios (“we”, “us”). By buying or using a product, you agree to these terms.
      </p>

      <h2 id="products">2. Our products</h2>
      <p>
        We sell digital products: prompt kits, guides, worksheets and similar files. Each product page describes what&apos;s included.
        Products are delivered as downloads; nothing physical is shipped.
      </p>

      <h2 id="buying">3. Buying</h2>
      <ul>
        <li>Checkout, payment, receipts and file delivery are handled by Whop. Whop&apos;s terms also apply to your purchase.</li>
        <li>Prices are shown in US dollars. Taxes may be added at checkout depending on where you live.</li>
        <li>A crossed-out price shows the product&apos;s regular price. Launch prices can change at any time; your price is the one shown at checkout.</li>
        <li>You get access to the files immediately after payment.</li>
      </ul>

      <h2 id="licence">4. Your licence</h2>
      <p>When you buy a product, you get a personal, non-exclusive, non-transferable licence to:</p>
      <ul>
        <li>use the prompts and guides to make content for yourself, your business, and your clients;</li>
        <li>edit the prompts to fit your projects;</li>
        <li>keep and use the videos, images and other outputs you make with them, commercially or otherwise.</li>
      </ul>
      <p>You may not:</p>
      <ul>
        <li>resell, share, give away or publish the product files or prompts, in whole or in large part, including in other prompt packs, courses or templates;</li>
        <li>share your download access with people outside your business;</li>
        <li>remove our name or claim the product as your own.</li>
      </ul>

      <h2 id="ai">5. AI tools and results</h2>
      <ul>
        <li>Our products are written for specific third-party AI tools (for example Seedance, Nano Banana, ChatGPT, Midjourney and CapCut). Those tools are not included, are paid separately, and are governed by their own terms.</li>
        <li>AI models change, and they can produce unexpected, inaccurate or unusable results. We don&apos;t guarantee any particular output, quality, number of generations, cost, or business result such as bookings or sales.</li>
        <li>You are responsible for what you create and publish, including checking outputs before use and following the AI tools&apos; content rules.</li>
      </ul>

      <h2 id="your-content">6. Your photos and permissions</h2>
      <p>
        You must have the right to use any photos, designs or likenesses you upload into AI tools, including your clients&apos; homes and your photographers&apos; images.
        Guidance in our products about permissions is practical advice, not legal advice.
      </p>

      <h2 id="refunds">7. Refunds</h2>
      <p>All sales are final. The only exceptions are set out in our <Link href="/refunds">Refund Policy</Link>.</p>

      <h2 id="ip">8. Our intellectual property</h2>
      <p>The products, this website, and the NYT Studios name and logo belong to us. Apart from the licence in section 4, no rights are transferred to you.</p>

      <h2 id="liability">9. Liability</h2>
      <p>
        Products are provided “as is”. To the extent the law allows, we are not liable for indirect or consequential losses, lost profits,
        or problems caused by third-party tools. Our total liability for any claim about a product is limited to the amount you paid for it.
        Nothing in these terms limits rights you have under consumer law that can&apos;t be excluded.
      </p>

      <h2 id="ending">10. Ending your licence</h2>
      <p>If you break section 4, your licence ends and you must delete the files. We may also refuse future purchases.</p>

      <h2 id="law">11. Law and disputes</h2>
      <p>
        These terms are governed by the laws of India. Disputes will be handled by the courts of {LEGAL.jurisdiction}, unless the consumer law of your country gives you the right to use your local courts.
      </p>

      <h2 id="changes">12. Changes</h2>
      <p>We may update these terms. The version shown when you buy applies to that purchase.</p>

      <h2 id="contact">13. Contact</h2>
      <p>
        Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or write to {LEGAL.entity}, {LEGAL.address}.
      </p>
    </LegalPage>
  );
}
