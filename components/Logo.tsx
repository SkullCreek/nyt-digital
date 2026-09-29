// Daylight twin of the agency badge: same spark, paper badge instead of night sky.
import Link from "next/link";

export function BadgeMark() {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true">
      <rect x="-96" y="-96" width="192" height="192" rx="46" fill="#FFFFFF" stroke="#0F1A3C" strokeWidth="8" />
      <path d="M0 -70 C0 -22 17 0 58 0 C17 0 0 22 0 70 C0 22 -17 0 -58 0 C-17 0 0 -22 0 -70Z" fill="#2346D0" />
      <path d="M52 -64 C52 -55 55 -51 62 -51 C55 -51 52 -47 52 -38 C52 -47 49 -51 42 -51 C49 -51 52 -55 52 -64Z" fill="#B08A3E" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="NYT Digital, home">
      <BadgeMark />
      <span className="word" translate="no">
        <b>NYT</b>
        <small>DIGITAL</small>
      </span>
    </Link>
  );
}
