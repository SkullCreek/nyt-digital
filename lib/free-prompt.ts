// The free prompt email. Chapter 2, Shot 4 of the kit: one living-room photo, no image
// editing, a slow orbit that shows the lock line working.
import { INTERIOR_PROMPTS, productPath } from "./products";
import { CONTACT, LEGAL, SITE } from "./site";

export const FREE_PROMPT = {
  label: "Chapter 2 (Come In), Shot 4: The living room",
  text: `TASK: Image-to-video. @Image 1 is the exact first frame. One continuous shot, about 5 seconds.
ASSET MAPPING: @LIVING = @Image 1 - the finished living room wide. Use its walls, windows, furniture and materials exactly.
OPTICS: 84° diagonal field of view, rectilinear, verticals straight. Lens locked.
CAMERA: 1.3 m high, slow 25° orbit to the right around the coffee table.
ACTION TIMING: 0-5s: smooth continuous orbit; the curtains move slightly. End state: the sofa and window framed together.
LIGHTING: Soft window daylight, warm floor bounce.
AUDIO: <room tone opens up>, <faint breeze>. No music, no narration, no subtitles.
POSITIVE CONSTRAINTS: Walls, windows, doors, ceiling, floor and furniture stay exactly as in @Image 1. Nothing is added, removed or resized. No people.`,
  steps: [
    "Pick one finished living room photo: taken from the doorway at chest height, with straight vertical lines and clear floor in front of the coffee table.",
    "In Seedance 2.5, set 9:16 and the shortest length (4-5 seconds).",
    "Upload your photo as @Image 1 and paste the prompt as it is.",
    "Check the clip: walls, windows and furniture should look exactly like your photo. Trim it to 2-3 seconds in CapCut.",
  ],
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function freePromptEmail() {
  const url = `${SITE.url}${productPath(INTERIOR_PROMPTS)}?utm_source=brevo&utm_medium=email&utm_campaign=free_prompt`;
  const subject = "Your free prompt: the living room orbit";

  const text = [
    "Here's your free prompt from 100 AI Video Prompts for Interior Design Reels.",
    "",
    FREE_PROMPT.label,
    "",
    FREE_PROMPT.text,
    "",
    "How to run it:",
    ...FREE_PROMPT.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "The last line is the lock line. It keeps your room exactly as you designed it; only the camera and light move.",
    "",
    `Like the result? The full kit has 100 prompts like this, 10 ad stories, worksheets and a 120-page guide for $${INTERIOR_PROMPTS.price.amount}:`,
    url,
    "",
    `You're getting this because you asked for it at ${SITE.url.replace("https://", "")}. Reply "stop" and we won't email you again.`,
    `${LEGAL.entity}, ${LEGAL.address}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#EEF0F3;font-family:Arial,Helvetica,sans-serif;color:#0F1A3C">
<div style="max-width:600px;margin:0 auto;padding:32px 20px">
<p style="font-size:13px;color:#4A5270;margin:0 0 20px">NYT Studios Digital</p>
<h1 style="font-size:26px;line-height:1.2;margin:0 0 12px">Your free prompt</h1>
<p style="font-size:16px;line-height:1.6;margin:0 0 20px">Here's one prompt from <b>100 AI Video Prompts for Interior Design Reels</b>. All you need is one finished living room photo.</p>
<div style="background:#0A0F2C;border-radius:14px;padding:20px">
<p style="font-size:13px;color:#AEB5D1;margin:0 0 12px">${esc(FREE_PROMPT.label)}</p>
<pre style="margin:0;white-space:pre-wrap;font-family:'Courier New',monospace;font-size:13px;line-height:1.7;color:#E9ECF7">${esc(FREE_PROMPT.text)}</pre>
</div>
<h2 style="font-size:18px;margin:28px 0 8px">How to run it</h2>
<ol style="font-size:15px;line-height:1.6;padding-left:20px;margin:0">${FREE_PROMPT.steps.map((s) => `<li style="margin-bottom:6px">${esc(s)}</li>`).join("")}</ol>
<p style="font-size:15px;line-height:1.6;margin:16px 0 0">The last line is the lock line. It keeps your room exactly as you designed it; only the camera and light move.</p>
<div style="margin:28px 0;padding:20px;background:#FFFFFF;border:1px solid #DDE0E8;border-radius:14px">
<p style="font-size:16px;line-height:1.5;margin:0 0 14px">Like the result? The full kit has 100 prompts like this, 10 ad stories, worksheets and a 120-page guide.</p>
<a href="${url}" style="display:inline-block;background:#2346D0;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 24px;border-radius:99px">Get all 100 prompts for $${INTERIOR_PROMPTS.price.amount}</a>
</div>
<p style="font-size:12px;line-height:1.6;color:#4A5270;margin:0">You're getting this because you asked for it at ${esc(SITE.url.replace("https://", ""))}. Reply "stop" and we won't email you again.<br>${esc(LEGAL.entity)}, ${esc(LEGAL.address)}<br>Questions: <a href="mailto:${CONTACT.email}" style="color:#4A5270">${CONTACT.email}</a></p>
</div></body></html>`;

  return { subject, text, html };
}
