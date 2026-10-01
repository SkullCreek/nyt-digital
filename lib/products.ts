// Product catalog. Adding a product = adding one object to PRODUCTS.
// Pages, sitemap and structured data are all generated from this file.

export type Img = { src: string; alt: string; width: number; height: number };

export type Product = {
  slug: string;
  name: string; // main name: H1, <title>, schema
  shortName: string; // mobile buy bar and tight spaces
  altNames: string[]; // subheads and search variants
  tagline: string;
  metaDescription: string; // search snippet, 155 characters max
  audience: string;
  price: { amount: number; currency: "USD"; compareAt?: number };
  whopUrl: string;
  cover: Img;
  video?: { src: string; captions: string; poster: string; duration: string; uploadDate: string; width: number; height: number; caption: string };
  stats: { value: string; label: string }[];
  includes: { title: string; meta: string; items: string[] }[];
  ads: { n: string; title: string; text: string; img: Img }[];
  steps: { title: string; text: string }[];
  samplePrompt: {
    label: string;
    text: string;
    input?: Img; // the photo uploaded as @Image 1
    output?: { src: string; width: number; height: number; note: string }; // the clip it produced
  };
  tools: { role: string; name: string; note: string }[];
  fitFor: string[];
  notFor: string[];
  faq: { q: string; a: string }[];
};

const ad = (file: string, alt: string): Img => ({ src: `/images/${file}.jpg`, alt, width: 640, height: 477 });

export const INTERIOR_PROMPTS: Product = {
  slug: "ai-video-prompts-interior-design-reels",
  name: "100 AI Video Prompts for Interior Design Reels",
  shortName: "100 prompts for interior design reels",
  altNames: ["Scroll-Stopping Rooms", "Rooms in Motion"],
  tagline: "Turn your finished projects into 20-second video ads that book clients. No videographer, and no faked walls.",
  metaDescription: "100 copy-paste Seedance 2.5 prompts that turn your interior design photos into 20-second video ads. No videographer, no faked walls. $1.99.",
  audience: "Interior designers",
  price: { amount: 1.99, currency: "USD", compareAt: 15 },
  whopUrl: "https://whop.com/nyt-studios/ai-video-prompts-for-interior-design-reels/",
  cover: {
    src: "/images/kit-cover.jpg",
    alt: "The kit: a cobalt-blue hardcover guide titled 100 AI Video Prompts, with the Prompt Library and Worksheets books beside it",
    width: 1500,
    height: 837,
  },
  video: {
    src: "/video/ugc-ad-interior-prompts.mp4",
    captions: "/video/ugc-ad-interior-prompts.vtt",
    poster: "/images/ugc-ad-poster.webp",
    duration: "PT20S",
    uploadDate: "2026-09-29T00:00:00+05:30", // full date-time with timezone: Google rejects a bare date
    width: 478,
    height: 850,
    caption: "Nobody stops for a photo. One photo, one prompt: before-afters, walkthroughs, day to night and sketch to space, none of it filmed.",
  },
  stats: [
    { value: "100", label: "copy-paste Seedance 2.5 video prompts" },
    { value: "10", label: "ad stories, each told in 10 shots" },
    { value: "16", label: "printable worksheets" },
    { value: "0", label: "videographers or editing skills needed" },
  ],
  includes: [
    {
      title: "The guide",
      meta: "120 pages",
      items: [
        "100 AI video prompts",
        "10 ad types, each with a 10-shot story",
        "Image prompts for your start frames",
        "CapCut edit, captions and 3 hooks per ad",
        "Fix-it page, 30-day plan, glossary",
      ],
    },
    {
      title: "Prompt Library",
      meta: "Word + text files",
      items: [
        "Every prompt in its own clean box",
        "Placeholders highlighted so none slip through",
        "Which images to upload for each shot",
        "Opens in Word or Google Docs",
      ],
    },
    {
      title: "Worksheets",
      meta: "16 printable sheets",
      items: [
        "Room Brief and Permissions Check",
        "A shot sheet for every ad",
        "Clip Check Grid before you post",
        "Results Tracker for what works",
      ],
    },
  ],
  ads: [
    { n: "01", title: "The Swipe", text: "Before and after, same walls, one satisfying reveal.", img: ad("ad-01-the-swipe", "A bright living room with a cream sofa, round oak coffee table and a fiddle-leaf fig by the window") },
    { n: "02", title: "Come In", text: "A walkthrough from the front door to the best chair.", img: ad("ad-02-come-in", "A cobalt-blue front door open at dusk onto a warmly lit hallway with a round mirror") },
    { n: "03", title: "6 AM to 11 PM", text: "One room through a whole day of light.", img: ad("ad-03-6am-to-11pm", "A reading corner with a linen armchair and side table in low morning sunlight") },
    { n: "04", title: "Touch Test", text: "Marble, oak, linen and brass, sound on.", img: ad("ad-04-touch-test", "Close-up of white marble, oak, a brass handle, linen and a glossy cobalt tile") },
    { n: "05", title: "From Pin to Room", text: "Your mood board comes alive, swatch by swatch.", img: ad("ad-05-pin-to-room", "A hand pinning fabric, tile and wood swatches onto a cork mood board") },
    { n: "06", title: "Lines to Light", text: "A pencil sketch becomes a photoreal room.", img: ad("ad-06-lines-to-light", "A pencil sketch of a living room beside a tablet showing the same room as a photoreal render") },
    { n: "07", title: "Which One?", text: "Same room, two styles. Viewers pick A or B.", img: ad("ad-07-which-one", "A calm Japandi-style living room with a paper pendant lamp and low wooden coffee table") },
    { n: "08", title: "After Dark", text: "Noon to night, layer by layer of your lighting plan.", img: ad("ad-08-after-dark", "A living room at night lit by cove lighting, a table lamp and candles, with a blue armchair") },
    { n: "09", title: "It Fits", text: "A cramped room, three clever fixes, the reveal.", img: ad("ad-09-it-fits", "A small room with a raised bed, window seat storage and a fold-down desk") },
    { n: "10", title: "Your Room, Next", text: "The paid ad that books consultations.", img: ad("ad-10-your-room-next", "A woman in a blue sweater scrolling an interior design reel on her phone in a sunny living room") },
  ],
  steps: [
    { title: "Pick one ad", text: "A simple picker matches the photos you already have to the right chapter." },
    { title: "Make your start images", text: "Use your real photos, plus the image prompts where you need an “after” or a time of day." },
    { title: "Paste 10 prompts", text: "Into Seedance 2.5, one shot at a time. Each clip is 4‑5 seconds; you trim to 2‑3." },
    { title: "Check, cut, post", text: "A 30-second clip check, the CapCut edit, then the chapter's caption and hook." },
  ],
  samplePrompt: {
    label: "Shot 5 of 100 - The reveal, from Chapter 1: The Swipe",
    input: {
      src: "/images/sample-input-living-room.webp",
      alt: "A calm living room with a linen sofa, oak coffee table, floor lamp and a tall window",
      width: 768,
      height: 1376,
    },
    output: {
      src: "/video/sample-output-the-swipe.mp4",
      width: 480,
      height: 854,
      note: "4-second clip with sound",
    },
    text: `TASK: Image-to-video. @Image 1 is the exact first frame. One continuous shot, about 5 seconds.
ASSET MAPPING: @AFTER = @Image 1 - the finished (or concept) living room, same angle as the before photo. Use its walls, window, furniture, materials and styling exactly.
SCENE: The same room, redesigned, in soft late-morning daylight.
OPTICS: 84° diagonal field of view, rectilinear, verticals straight. Lens locked.
CAMERA: Eye level, starts 0.5 m inside the doorway and pulls straight back to the doorway over 5 seconds, ending on the same framing as the before shot.
ACTION TIMING: 0-5s: slow, even pull-back; the sheer curtain moves gently in a breeze. End state: the whole room in frame, centred on the window.
LIGHTING: Soft natural daylight from the window, warm bounce off the floor, gentle shadows under the furniture.
AUDIO: <a soft room-tone swell>, <light breeze>. No music, no narration, no subtitles.
POSITIVE CONSTRAINTS: Walls, windows, doors, ceiling, floor and furniture stay exactly as in @Image 1. Nothing is added, removed or resized. No people.`,
  },
  tools: [
    { role: "Images", name: "Nano Banana, ChatGPT or Midjourney", note: "For your start frames and “after” images." },
    { role: "Video", name: "Seedance 2.5", note: "On Higgsfield or another Seedance host. Every prompt is written for it." },
    { role: "Edit", name: "CapCut", note: "Free on phone and desktop. The kit walks you through each edit." },
  ],
  fitFor: [
    "Design homes and post on Instagram or TikTok",
    "Have finished photos, sketches, mood boards or concepts",
    "Want video but don't want to hire a videographer",
    "Can copy, paste and trim clips on your phone",
  ],
  notFor: [
    "Want a one-click app that makes the whole video",
    "Need to show rooms you didn't design",
    "Want prompts for Midjourney art rather than video ads",
  ],
  faq: [
    { q: "Do I need video editing experience?", a: "No. If you can copy, paste and trim a clip on your phone, you can make every ad. The CapCut steps are written out for each chapter." },
    { q: "Which AI tools do I need, and what do they cost?", a: "An image tool (Nano Banana, ChatGPT or Midjourney), Seedance 2.5 for video, and CapCut for editing. The tools aren't included. Expect a few dollars of AI credits per ad, and about 15 generations including retries. Prices change, so check each tool's website." },
    { q: "Will the prompts work with Kling, Veo or Runway?", a: "They're written and structured for Seedance 2.5. The camera language may help elsewhere, but we haven't tested them in other tools, so we don't promise it." },
    { q: "Can I use photos of my clients' homes?", a: "Yes, with permission. The kit includes a Permissions Check: written client consent, whether your photographer's licence covers ads and animation, and what to hide for privacy. It's practical guidance, not legal advice." },
    { q: "What format are the files?", a: "A ZIP with the guide (PDF), the Prompt Library (Word document that opens in Google Docs, plus plain-text files) and the Worksheets (printable PDF)." },
    { q: "How long does one ad take?", a: "Plan an afternoon for your first one. Once you've made a few, about an hour per ad." },
    { q: "Can I get a refund?", a: "No. It's an instant digital download, and results depend on third-party AI models we don't control. If your files never arrive or won't open, email us and we'll send them again." },
  ],
};

export const PRODUCTS: Product[] = [INTERIOR_PROMPTS];

export const productPath = (p: Pick<Product, "slug">) => `/products/${p.slug}`;

// The few fields client components need. Passing the whole Product to a client component
// would serialise every ad, FAQ and prompt into the page once per button.
export type BuyInfo = Pick<Product, "slug" | "shortName" | "whopUrl" | "price">;
export const buyInfo = (p: Product): BuyInfo => ({ slug: p.slug, shortName: p.shortName, whopUrl: p.whopUrl, price: p.price });
