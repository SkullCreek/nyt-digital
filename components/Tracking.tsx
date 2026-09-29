"use client";

// Loads the Meta Pixel and Whop Pixel only when ad measurement is allowed,
// and sends a page view on every client-side route change.
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { onConsentChange, readConsent } from "@/lib/consent";
import { READY_EVENT } from "@/lib/track";

const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const WHOP_ID = process.env.NEXT_PUBLIC_WHOP_ACCOUNT_ID;

export default function Tracking() {
  const [allowed, setAllowed] = useState(false);
  const loaded = useRef(false);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    setAllowed(readConsent().marketing);
    return onConsentChange((c) => {
      // Scripts can't be unloaded; a reload is the clean way to stop them after a revoke.
      if (!c.marketing && loaded.current) window.location.reload();
      setAllowed(c.marketing);
    });
  }, []);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false; // the init snippets send the first page view
      return;
    }
    window.fbq?.("track", "PageView");
    window.whop?.track("page");
  }, [pathname]);

  useEffect(() => {
    if (allowed) loaded.current = true;
  }, [allowed]);

  if (!allowed) return null;

  return (
    <>
      {META_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_ID}');fbq('track','PageView');window.dispatchEvent(new Event('${READY_EVENT}'));`}
        </Script>
      ) : null}
      {WHOP_ID ? (
        <Script id="whop-pixel" strategy="afterInteractive">
          {`!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("${WHOP_ID}");whop.track("page");window.dispatchEvent(new Event("${READY_EVENT}"));`}
        </Script>
      ) : null}
    </>
  );
}
