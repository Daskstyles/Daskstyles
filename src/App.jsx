import React, { useMemo, useState, useEffect } from "react";
import {
  Check, Sparkles, LineChart, Shield, Mail, Clock, ArrowRight,
  BadgeEuro, Calculator as CalcIcon, Building2, Users, Rocket, Linkedin,
  Instagram, Globe, FileText, Upload, Search, Tag, ChevronRight
} from "lucide-react";

/**
 * B.U Prime — Full Site (with Blog)
 * - Hash router: #home, #services, #pricing, #hr, #calculator, #contact, #blog, #post/<slug>
 * - Blog is static (in-memory) for now; ready to swap to MDX or headless CMS later
 * - Includes categories, search, tags, and a simple author card
 * - Reuses your sections, pricing, HR and calculator from previous code
 */

// ===== Brand & Data =====
const BRAND = { name: "B.U Prime", email: "hello@buprime.com", phone: "+30 210 000 0000" };

const TIERS = [
  { key: "bronze", name: "Bronze", price: 450, onboarding: 200, slabel: "Starter", features: [
    "2 channels; 4 posts + 4 stories/mo",
    "1 ad campaign (Meta or Google), budget ≤ €1,000",
    "GA4/Tags + UTMs",
    "1-page monthly report + 30-min call",
    "Light brand polish; 1-day SLA",
  ]},
  { key: "silver", name: "Silver", price: 650, onboarding: 250, slabel: "Growth", features: [
    "Up to 3 channels; 8 posts + 8 stories/mo",
    "2 ad campaigns; budget ≤ €2,500",
    "Live Looker Studio dashboard",
    "1 landing-page refresh OR on-page SEO/mo",
    "1 A/B test/mo; 8h SLA",
  ]},
  { key: "gold", name: "Gold", price: 900, onboarding: 300, slabel: "Performance", features: [
    "Up to 4 channels; 12 posts + 2 Reels/mo",
    "3–4 campaigns across Meta/Google/LinkedIn; budget ≤ €5,000",
    "ROI & funnel dashboard; email/nurture",
    "2 CRO/SEO tests/mo; QBR",
    "4h consulting/mo; 4h SLA",
  ]},
  { key: "prime", name: "Prime", price: 1150, onboarding: 350, slabel: "Scale", features: [
    "4+ channels; 16 posts + 4 Reels/mo",
    "Always-on + promos; budget ≤ €10,000",
    "Full KPI stack + attribution view",
    "Automation & lead scoring; growth playbook",
    "8h consulting/mo; priority support",
  ]},
];

const HR_PACKS = [
  { name: "HR Starter", price: 300, bullets: ["Up to 1 active role", "Interview kit & scorecards", "2h consulting / month", "Offer & contract templates"] },
  { name: "HR Growth", price: 550, bullets: ["Up to 3 roles", "Full pipeline & screening", "4h consulting / month", "Onboarding toolkit (30/60/90)"] },
  { name: "HR Sprint (per role)", price: 650, bullets: ["End-to-end hire", "Structured interviews", "Reference checks", "Excl. job board fees"] },
];

const CAPS = { bronze: 1000, silver: 2500, gold: 5000, prime: 10000 };

// ===== Blog data (static, easy to swap to CMS) =====
const BLOG_CATEGORIES = ["Marketing", "AI", "Technology", "Case Studies", "News"];

const BLOG_POSTS = [
  {
    slug: "smr-framework-sme-growth",
    title: "SMR Framework: Simple Marketing Roadmap for SME Growth",
    excerpt: "A practical 90-day plan to stabilize your digital presence, generate demand, and measure ROI.",
    category: "Marketing",
    tags: ["roadmap", "sme", "roi"],
    date: "2025-08-10",
    author: { name: "B.U Prime Team", role: "Strategy", avatar: null },
    hero: null,
    content: `
### Why an SMR (Stabilize → Multiply → Refine) roadmap?
Most SMEs don't need complex funnels on day one. They need consistency, clear offers, and a way to measure if money turns into pipeline.

**Stabilize (Weeks 1–4):** Brand hygiene, GA4 + Tags, landing page refresh, 2 channels with weekly cadence.

**Multiply (Weeks 5–8):** Paid acquisition (Meta/Google), lead magnets, email nurture.

**Refine (Weeks 9–12):** A/B tests, audience cleanup, budget reallocation to best CPL/ROAS.

> KPI starter pack: CTR, CPC, CPL, ROAS, SQL rate.
    `,
  },
  {
    slug: "ai-content-workflows-2025",
    title: "AI Content Workflows in 2025: Quality at Scale",
    excerpt: "From briefs to brand-safe outputs: how to ship more content without losing your voice.",
    category: "AI",
    tags: ["genai", "workflow", "content"],
    date: "2025-08-12",
    author: { name: "B.U Prime Studio", role: "Creative", avatar: null },
    hero: null,
    content: `
### The 5-layer workflow
1) Research & voice board → 2) Brief → 3) Draft → 4) Human edit → 5) Compliance pass.

**Guardrails:** tone rules, examples, banned claims list, source-of-truth glossary.

**Outputs:** posts, emails, landing copy, scripts. Track \"revision count per asset\" as a quality KPI.
    `,
  },
  {
    slug: "lookerstudio-dashboard-kpis",
    title: "Dashboards that Execs Actually Read",
    excerpt: "What to show (and what to hide) in your Looker Studio for non-technical leaders.",
    category: "Technology",
    tags: ["analytics", "kpi", "looker"],
    date: "2025-08-18",
    author: { name: "Analytics @ BU", role: "BI", avatar: null },
    hero: null,
    content: `
### Keep it outcome-first
Answer: Are we growing efficiently? Show ROAS, CAC, Payback, pipeline velocity.

**One pager:** traffic → leads → opps → revenue. Add annotations for campaign launches.
    `,
  },
];

// ===== UI Bits =====
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-24">
    {title && (
      <div className="mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-300 mt-2 md:mt-3 max-w-3xl">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

const PageHeader = ({ kicker, title, subtitle }) => (
  <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 md:py-14">
      {kicker && <Pill>{kicker}</Pill>}
      <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7A00] to-[#2563EB]">{title}</span>
      </h1>
      {subtitle && <p className="mt-3 text-slate-300 max-w-2xl">{subtitle}</p>}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={"bg-slate-900/60 backdrop-blur rounded-2xl shadow-lg shadow-black/30 border border-white/10 " + className}>
    {children}
  </div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 text-white border border-white/10 px-3 py-1 text-xs font-medium">
    {children}
  </span>
);

// ===== Calculator helpers =====
function useROAS({ spend, roas, gm, fee }) {
  return useMemo(() => {
    const revenue = spend * roas;
    const grossProfit = revenue * gm;
    const netAfterFee = grossProfit - fee;
    const breakeven = spend > 0 && gm > 0 ? fee / (spend * gm) : NaN;
    const roiPct = spend > 0 ? (netAfterFee / spend) * 100 : NaN;
    return { revenue, grossProfit, netAfterFee, breakeven, roiPct };
  }, [spend, roas, gm, fee]);
}

function calcROAS({ spend, roas, gm, fee }) {
  const revenue = spend * roas;
  const grossProfit = revenue * gm;
  const netAfterFee = grossProfit - fee;
  const breakeven = spend > 0 && gm > 0 ? fee / (spend * gm) : NaN;
  const roiPct = spend > 0 ? (netAfterFee / spend) * 100 : NaN;
  return { revenue, grossProfit, netAfterFee, breakeven, roiPct };
}

const number = (n) => (isFinite(n) ? n.toLocaleString("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "—");
const percent = (p) => (isFinite(p) ? `${p.toFixed(1)}%` : "—");

function suggestedSpend(tierKey, fee, roas, gm) {
  const cap = CAPS[tierKey] ?? 1000;
  if (!(roas > 0 && gm > 0)) return Math.round((cap * 0.8) / 50) * 50;
  const sMin = fee / (roas * gm);
  const base = cap * 0.8;
  const target = Math.max(base, sMin * 1.25);
  const s = Math.min(target, cap);
  return Math.max(0, Math.round(s / 50) * 50);
}

function computeTierMetrics(roas, gm) {
  const rows = TIERS.map(t => {
    const spend = suggestedSpend(t.key, t.price, roas, gm);
    const revenue = spend * roas;
    const grossProfit = revenue * gm;
    const netAfterFee = grossProfit - t.price;
    return { ...t, cap: CAPS[t.key], spend, revenue, grossProfit, netAfterFee };
  });
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].netAfterFee <= rows[i - 1].netAfterFee) {
      let s = rows[i].spend;
      while (s < rows[i].cap) {
        s = Math.min(rows[i].cap, Math.round((s * 1.05) / 50) * 50);
        const gp = (s * roas) * gm;
        const net = gp - rows[i].price;
        if (net > rows[i - 1].netAfterFee) {
          rows[i].spend = s; rows[i].grossProfit = gp; rows[i].revenue = s * roas; rows[i].netAfterFee = net; break;
        }
        if (s === rows[i].cap) break;
      }
    }
  }
  return rows;
}

function runSelfTests() {
  const cases = [
    { spend: 2500, roas: 3, gm: 0.6, fee: 650 },
    { spend: 1000, roas: 2.5, gm: 0.5, fee: 450 },
    { spend: 5000, roas: 4, gm: 0.7, fee: 1150 },
  ];
  console.groupCollapsed("BU Prime: Self-tests");
  cases.forEach((c, i) => {
    const r = calcROAS(c);
    console.assert(r.revenue === c.spend * c.roas, `Case ${i}: revenue`);
    console.assert(r.grossProfit === r.revenue * c.gm, `Case ${i}: grossProfit`);
    console.assert(Math.abs(r.netAfterFee - (r.grossProfit - c.fee)) < 1e-9, `Case ${i}: netAfterFee`);
  });
  const rows = computeTierMetrics(3, 0.6);
  let mono = true;
  for (let i = 1; i < rows.length; i++) if (!(rows[i].netAfterFee >= rows[i-1].netAfterFee)) mono = false;
  console.assert(mono, "Tier netAfterFee should be non-decreasing B→P under default test");
  console.groupEnd();
}

// ===== Feature blocks reused across pages =====
function ServicesGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {["Digital Marketing", "Advertising Ops", "Analytics & BI"].map((t, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-[#86B6FF]"/>
            <h3 className="font-semibold text-lg">{t}</h3>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex gap-2"><Check className="text-green-400"/> Content & social (IG/FB/LinkedIn/YT/TikTok)</li>
            <li className="flex gap-2"><Check className="text-green-400"/> Campaigns: Meta, Google, LinkedIn</li>
            <li className="flex gap-2"><Check className="text-green-400"/> GA4, Tag Manager, UTMs</li>
            <li className="flex gap-2"><Check className="text-green-400"/> CRO/SEO sprints & testing</li>
          </ul>
        </Card>
      ))}
    </div>
  );
}

function HRGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {HR_PACKS.map((p) => (
        <Card key={p.name} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7A00] to-[#2563EB]">€{p.price}/mo</div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            {p.bullets.map((b, i) => (
              <li key={i} className="flex gap-2"><Check className="text-green-400"/> {b}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function PricingGrid() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {TIERS.map((t) => (
        <Card key={t.key} className="p-6 flex flex-col">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold">{t.name}</h3>
            <Pill>{t.slabel}</Pill>
          </div>
          <div className="mt-2 text-3xl font-extrabold">€{t.price}<span className="text-base font-medium text-slate-400">/mo</span></div>
          <div className="text-slate-400 text-sm">Onboarding €{t.onboarding}</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {t.features.map((f, i) => (
              <li key={i} className="flex gap-2"><Check className="text-green-400"/> {f}</li>
            ))}
          </ul>
          <a href="#contact" className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-xl transition">
            Choose {t.name} <ArrowRight size={16}/>
          </a>
        </Card>
      ))}
    </div>
  );
}

function CalculatorBlocks() {
  const [tierKey, setTierKey] = useState("silver");
  const tier = TIERS.find(t => t.key === tierKey);
  const [spend, setSpend] = useState(2500);
  const [roas, setRoas] = useState(3);
  const [gm, setGm] = useState(0.6);
  const { revenue, grossProfit, netAfterFee, breakeven, roiPct } = useROAS({ spend, roas, gm, fee: tier.price });
  const compareRows = computeTierMetrics(roas, gm);

  return (
    <>
      <Card className="p-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="text-sm text-slate-300">Tier</label>
            <select value={tierKey} onChange={e => setTierKey(e.target.value)} className="mt-1 w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
              {TIERS.map(t => <option key={t.key} value={t.key}>{t.name} — €{t.price}/mo</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Ad Spend (€)</label>
            <input type="number" inputMode="decimal" min={0} step="1"
              value={spend} onChange={e => setSpend(Math.max(0, Number(e.target.value)))}
              className="mt-1 w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Target ROAS (×)</label>
            <input type="number" inputMode="decimal" min={0} step="0.1"
              value={roas} onChange={e => setRoas(Math.max(0, Number(e.target.value)))}
              className="mt-1 w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Gross Margin (%)</label>
            <input type="number" inputMode="decimal" min={0} max={100} step="1"
              value={gm*100} onChange={e => setGm(Math.min(100, Math.max(0, Number(e.target.value))) / 100)}
              className="mt-1 w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mt-6 text-sm">
          <Stat label="Revenue" value={number(revenue)} />
          <Stat label="Gross Profit" value={number(grossProfit)} />
          <Stat label="Fee / Month" value={number(tier.price)} />
          <Stat label="Net After Fee" value={number(netAfterFee)} emphasize={netAfterFee >= 0} />
          <Stat label="Breakeven ROAS" value={isFinite(breakeven) ? `${breakeven.toFixed(2)}×` : "—"} />
        </div>
        <div className="mt-3 text-slate-400 text-xs">ROI on spend (after fee): {percent(roiPct)}</div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tier Comparison (Recommended Scenario)</h3>
          <div className="text-slate-400 text-xs">Spends assume 80% of each tier’s cap or +25% above breakeven — whichever is higher.</div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4">Tier</th>
                <th className="py-2 pr-4">Suggested Spend</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Gross Profit</th>
                <th className="py-2 pr-4">Fee</th>
                <th className="py-2 pr-4">Net After Fee</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r, i, arr) => {
                const positive = r.netAfterFee >= 0;
                const highest = i === arr.length - 1;
                return (
                  <tr key={r.key} className="border-b border-white/5">
                    <td className="py-2 pr-4 font-semibold">{r.name}</td>
                    <td className="py-2 pr-4">{number(r.spend)}</td>
                    <td className="py-2 pr-4">{number(r.revenue)}</td>
                    <td className="py-2 pr-4">{number(r.grossProfit)}</td>
                    <td className="py-2 pr-4">{number(r.price)}</td>
                    <td className={`py-2 pr-4 font-bold ${positive ? "text-green-400" : "text-red-400"}`}>{number(r.netAfterFee)}</td>
                    <td className="py-2">{positive ? (highest ? "Highest net" : "✓ Profitable") : "⚠ Improve ROAS/Margin"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function ContactBlocks() {
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="text-lg font-semibold">Get a proposal</div>
          <p className="text-slate-300 text-sm mt-1">Share your website, monthly budget, and goals. We’ll suggest the best tier and first 90‑day plan.</p>

          <div className="mt-4 flex flex-col gap-2 text-slate-300 text-sm">
            <a className="inline-flex items-center gap-2 hover:text-white" href={`mailto:${BRAND.email}`}><Mail size={16}/> {BRAND.email}</a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> LinkedIn</a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={16}/> Instagram</a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="#" target="_blank" rel="noopener noreferrer"><Globe size={16}/> buprime.com</a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="#" target="_blank" rel="noopener noreferrer"><FileText size={16}/> Request MSA</a>
          </div>
        </div>
        <form action="https://formspree.io/f/your_form_id" method="POST" className="grid grid-cols-1 gap-4">
          <input type="hidden" name="_subject" value="BU Prime — Website Lead" />
          <input required name="name" placeholder="Your Name" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3"/>
          <input required name="email" type="email" placeholder="Email" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3"/>
          <input name="company" placeholder="Company / Website" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3"/>
          <select name="tier" required className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3">
            {TIERS.map(t => <option key={t.key} value={t.name}>{t.name}</option>)}
          </select>
          <textarea name="goals" rows={4} placeholder="What goals do you want to hit in the next 90 days?" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3"/>
          <button type="submit" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-90 text-white font-semibold px-5 py-3 rounded-xl">
            Send <ArrowRight size={16}/>
          </button>
        </form>
      </div>
    </Card>
  );
}

// ===== Blog components =====
function BlogHeader() {
  return (
    <PageHeader kicker={<><FileText size={14}/> Blog</>} title="Insights & Updates" subtitle="Marketing, AI, technology and real results from the field." />
  );
}

function BlogList({ posts }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map(p => (
        <Card key={p.slug} className="p-5 flex flex-col">
          <div className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString("en-GB")}</div>
          <a href={`#post/${p.slug}`} className="mt-1 text-lg font-bold hover:underline">{p.title}</a>
          <div className="mt-2 text-slate-300 text-sm flex-1">{p.excerpt}</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Pill><Tag size={12}/> {p.category}</Pill>
            {p.tags.slice(0,3).map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 border border-white/10">#{t}</span>)}
          </div>
          <a href={`#post/${p.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm hover:opacity-80">
            Read more <ChevronRight size={16}/>
          </a>
        </Card>
      ))}
    </div>
  );
}

function BlogSidebar({ selectedCategory, setCategory, search, setSearch }) {
  return (
    <aside className="space-y-4">
      <Card className="p-4">
        <div className="text-sm font-semibold mb-2">Search</div>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts" className="bg-transparent flex-1 outline-none text-sm"/>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-semibold mb-2">Categories</div>
        <div className="flex flex-wrap gap-2">
          {["All", ...BLOG_CATEGORIES].map(cat => (
            <button key={cat} onClick={()=>setCategory(cat)} className={`px-3 py-1 rounded-lg border text-xs ${selectedCategory===cat?"bg-white/10 border-white/30":"border-white/10 hover:border-white/30"}`}>{cat}</button>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-semibold mb-2">About</div>
        <div className="text-slate-300 text-sm">We blend creative marketing with business intelligence to drive profitable growth for SMEs across Greece & the EU.</div>
      </Card>
    </aside>
  );
}

function BlogPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = BLOG_POSTS.filter(p => (category === "All" || p.category === category) && (
    p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()) || p.tags.join(" ").toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <>
      <BlogHeader />
      <Section id="blog">
        <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Blog'}]} />
        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <div>
            <BlogList posts={filtered} />
          </div>
          <div>
            <BlogSidebar selectedCategory={category} setCategory={setCategory} search={search} setSearch={setSearch} />
          </div>
        </div>
      </Section>
    </>
  );
}

function PostPage({ slug }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return (
    <Section>
      <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Blog', href:'#blog'},{label:'Not found'}]} />
      <Card className="p-6">Post not found.</Card>
    </Section>
  );
  return (
    <>
      <PageHeader kicker={<><FileText size={14}/> {post.category}</>} title={post.title} subtitle={post.excerpt} />
      <Section>
        <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Blog', href:'#blog'},{label:post.title}]} />
        <article className="prose prose-invert max-w-none">
          <div className="text-sm text-slate-400">{new Date(post.date).toLocaleDateString("en-GB")} • {post.tags.map(t=>`#${t}`).join("  ")}</div>
          <Markdown content={post.content} />
          <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-sm text-slate-300">Written by <span className="font-semibold">{post.author.name}</span> — {post.author.role}</div>
          </div>
        </article>
      </Section>
    </>
  );
}

// Very small MD parser for headings/paragraphs/lists/inline code/quotes
function Markdown({ content }) {
  const lines = content.trim().split(/\n\n+/);
  return (
    <div className="space-y-4">
      {lines.map((block, i) => {
        if (block.startsWith("### ")) return <h3 key={i} className="text-xl font-bold">{block.replace(/^###\s+/, '')}</h3>;
        if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold">{block.replace(/^##\s+/, '')}</h2>;
        if (block.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-white/20 pl-4 text-slate-300">{block.replace(/^>\s+/, '')}</blockquote>;
        if (/^\d+\)/.test(block.trim())) return (
          <ol key={i} className="list-decimal ml-5">
            {block.split("\n").map((ln, j) => <li key={j}>{ln.replace(/^\d+\)\s*/, '')}</li>)}
          </ol>
        );
        if (block.includes("**")) {
          const parts = block.split(/(\*\*[^*]+\*\*)/g).map((p, k) => p.startsWith("**") ? <strong key={k}>{p.replace(/\*\*/g,'')}</strong> : p);
          return <p key={i}>{parts}</p>;
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}

// ===== Router helpers =====
function getRouteFromHash() {
  const h = (typeof window !== "undefined" ? window.location.hash : "#home").replace(/^#?/, "#");
  const valid = ["#home", "#services", "#pricing", "#hr", "#calculator", "#contact", "#blog"]; // posts handled separately
  if (valid.includes(h)) return h;
  if (h.startsWith("#post/")) return h; // dynamic post
  return "#home";
}

const DEFAULT_THEME = {
  primaryBg: "#0B1220",
  gradientFrom: "#1d4ed8",
  gradientTo: "#6E00FF",
  cta: "#FF7A00",
  ctaHover: "#e56d00",
  cardBg: "rgba(15,23,42,0.6)",
  border: "rgba(255,255,255,0.1)",
  tier: { bronze: "#C16B2E", silver: "#CBD5E1", gold: "#E2B714", prime: "#6E00FF" },
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem("buprime_theme") || "null") || DEFAULT_THEME; } catch { return DEFAULT_THEME; }
  });
  useEffect(() => { try { localStorage.setItem("buprime_theme", JSON.stringify(theme)); } catch {} }, [theme]);
  return [theme, setTheme];
}

function DevPanel({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') setOpen(v => !v); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  function upd(path, value) {
    setTheme(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let ref = clone; for (let i=0;i<parts.length-1;i++) ref = ref[parts[i]];
      ref[parts[parts.length-1]] = value; return clone;
    });
  }
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${open ? '' : ''}`}>
      <button onClick={() => setOpen(o=>!o)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 border border-white/20 hover:bg-white/20">
        {open ? 'Close Dev Panel' : 'Dev Panel (⌘/Ctrl+D)'}
      </button>
      {open && (
        <div className="mt-2 w-[320px] max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur p-4 text-sm space-y-3">
          <div className="font-semibold mb-1">Theme Editor</div>
          {[
            ["primaryBg","Primary Background"],
            ["gradientFrom","Gradient From"],
            ["gradientTo","Gradient To"],
            ["cta","CTA"],
            ["ctaHover","CTA Hover"],
            ["cardBg","Card BG (css rgba)"],
            ["border","Border (css rgba)"],
          ].map(([k,label]) => (
            <div key={k} className="flex items-center gap-2">
              <label className="w-40 text-slate-300">{label}</label>
              <input value={theme[k]} onChange={e=>upd(k, e.target.value)} className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1"/>
            </div>
          ))}
          <div className="font-semibold mt-2">Tier Colors</div>
          {Object.keys(theme.tier).map(tk => (
            <div key={tk} className="flex items-center gap-2">
              <label className="w-40 capitalize text-slate-300">{tk}</label>
              <input value={theme.tier[tk]} onChange={e=>upd(`tier.${tk}`, e.target.value)} className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-6">
      <ol className="flex items-center gap-2">
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            {i>0 && <span>/</span>}
            {t.href ? <a href={t.href} className="hover:text-white">{t.label}</a> : <span className="text-white">{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function BUPrimeSiteWithBlog() {
  const [logo, setLogo] = useState(null);
  const [route, setRoute] = useState(getRouteFromHash());
  const [theme, setTheme] = useTheme();

  useEffect(() => { const preset = localStorage.getItem("buprime_logo"); if (preset) setLogo(preset); }, []);
  useEffect(() => { const onHash = () => setRoute(getRouteFromHash()); window.addEventListener("hashchange", onHash); return () => window.removeEventListener("hashchange", onHash); }, []);
  useEffect(() => { runSelfTests(); }, []);

  function onPick(e) { const f = e.target.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = () => { const data = reader.result; setLogo(data); try { localStorage.setItem("buprime_logo", data); } catch {} }; reader.readAsDataURL(f); }

  const isPost = route.startsWith("#post/");
  const slug = isPost ? route.replace("#post/", "") : null;

  return (
    <div className="min-h-screen text-slate-100" style={{ background: `linear-gradient(to bottom, ${theme.primaryBg}, ${theme.primaryBg})` }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-gradient-to-r from-[#FF7A00] to-[#2563EB] text-slate-950 px-3 py-2 rounded z-50">Skip to content</a>

      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3" aria-label={`${BRAND.name} home`}>
            <div className="h-9 w-9 rounded-xl overflow-hidden border border-white/10 grid place-items-center bg-white/5">
              {logo ? <img src={logo} alt="B.U Prime logo" className="h-7 w-7 object-contain" /> : <div className="h-7 w-7 rounded bg-white/10" />}
            </div>
            <span className="font-semibold tracking-wide">{BRAND.name}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#hr" className="hover:text-white">HR</a>
            <a href="#calculator" className="hover:text-white">Calculator</a>
            <a href="#blog" className="hover:text-white">Blog</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl border" style={{borderColor: theme.border}}>
              <Upload className="h-4 w-4"/>
              Upload logo
              <input type="file" accept="image/*" onChange={onPick} className="hidden" />
            </label>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm rounded-xl transition" style={{background: theme.cta, color: "#fff", padding: "0.5rem 1rem"}}>
              <Mail size={16} /> Get Proposal
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        {!isPost && route === "#home" && (
          <>
            <Section id="home">
              <Breadcrumbs trail={[{label:'Home'}]} />
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <Pill><Rocket size={14}/> Athens • Greece & EU</Pill>
                  <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    Creative Marketing
                    <span className="block bg-clip-text text-transparent" style={{backgroundImage:`linear-gradient(90deg, ${theme.cta}, ${theme.gradientTo})`}}>meets Business Intelligence</span>
                  </h1>
                  <p className="mt-5 text-slate-300 max-w-xl">
                    We help mid‑market teams turn ads and content into measurable growth. Four clear subscription tiers, BI dashboards, and Fractional HR to fix hiring bottlenecks.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#services" className="inline-flex items-center gap-2 border px-5 py-3 rounded-xl" style={{borderColor: theme.border}}>
                      <Sparkles size={18}/> Services
                    </a>
                    <a href="#pricing" className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl transition" style={{background: theme.cta, color: '#fff'}}>
                      <BadgeEuro size={18}/> Pricing
                    </a>
                    <a href="#hr" className="inline-flex items-center gap-2 border px-5 py-3 rounded-xl" style={{borderColor: theme.border}}>
                      <Users size={18}/> HR
                    </a>
                    <a href="#calculator" className="inline-flex items-center gap-2 border px-5 py-3 rounded-xl" style={{borderColor: theme.border}}>
                      <CalcIcon size={18}/> Calculator
                    </a>
                    <a href="#blog" className="inline-flex items-center gap-2 border px-5 py-3 rounded-xl" style={{borderColor: theme.border}}>
                      <FileText size={18}/> Blog
                    </a>
                    <a href="#contact" className="inline-flex items-center gap-2 border px-5 py-3 rounded-xl" style={{borderColor: theme.border}}>
                      <Mail size={18}/> Contact
                    </a>
                  </div>
                  <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2"><Clock size={16}/> 3‑month min</span>
                    <span className="inline-flex items-center gap-2"><Shield size={16}/> GDPR‑aware</span>
                    <span className="inline-flex items-center gap-2"><LineChart size={16}/> Live dashboards</span>
                  </div>
                </div>
                <div className="rounded-2xl" style={{background: theme.cardBg, border: `1px solid ${theme.border}`}}>
                  <div className="grid grid-cols-2 gap-4 p-6">
                    {[
                      {icon: <LineChart className="text-[#86B6FF]"/>, title: "BI Dashboards", copy: "Clear KPIs: CPL, ROAS, pipeline."},
                      {icon: <Users className="text-[#86B6FF]"/>, title: "Fractional HR", copy: "Hiring kits, scorecards, onboarding."},
                      {icon: <Building2 className="text-[#86B6FF]"/>, title: "B2B Focus", copy: "SMEs & mid‑market across GR & EU."},
                      {icon: <Sparkles className="text-[#86B6FF]"/>, title: "Creative", copy: "Content + performance, not either/or."},
                    ].map((f, i) => (
                      <div key={i} className="rounded-xl p-4" style={{background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.border}`}}>
                        <div className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center mb-2">{f.icon}</div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-slate-400 text-sm mt-1">{f.copy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section id="home-services" title="Services" subtitle="Packages that scale from dependable presence to full‑funnel growth.">
              <ServicesGrid />
            </Section>
            <Section id="home-pricing" title="Pricing" subtitle="Ad spend not included • 3‑month minimum • Yearly prepay −15% • Quarterly −10%">
              <PricingGrid />
            </Section>
            <Section id="home-hr" title="Fractional HR" subtitle="Leverage Director‑level HR experience to hire better and faster.">
              <HRGrid />
            </Section>
            <Section id="home-calculator" title="ROAS Calculator" subtitle="Estimate your economics by tier. Adjust spend, ROAS, and margin to see net profit after fees.">
              <CalculatorBlocks />
            </Section>
            <Section id="home-blog" title="From the Blog" subtitle="Fresh ideas in marketing, AI and tech.">
              <BlogList posts={BLOG_POSTS.slice(0,3)} />
              <div className="mt-6">
                <a href="#blog" className="inline-flex items-center gap-2 text-sm hover:opacity-80">See all posts <ChevronRight size={16}/></a>
              </div>
            </Section>
            <Section id="home-contact" title="Contact" subtitle="Tell us about your goals. We’ll reply within one business day (Prime: same‑day).">
              <ContactBlocks />
            </Section>
          </>
        )}

        {!isPost && route === "#services" && (
          <>
            <PageSubnav items={[{label:'Overview', href:'#services'},{label:'Marketing', href:'#services-marketing'},{label:'Ad Ops', href:'#services-ops'},{label:'Analytics', href:'#services-analytics'}]} />
            <PageHeader kicker={<><Sparkles size={14}/> Services</>} title="What We Do" subtitle="End‑to‑end creative + performance + BI. Choose a tier or ask for a custom mix." />
            <Section id="services">
              <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Services'}]} />
              <ServicesGrid />
            </Section>
            <Section id="services-marketing" title="Digital Marketing" subtitle="Content systems, social, and conversion‑ready landing pages." />
            <Section id="services-ops" title="Advertising Ops" subtitle="Reliable campaign execution across Meta, Google, and LinkedIn." />
            <Section id="services-analytics" title="Analytics & BI" subtitle="From GA4 hygiene to board‑ready dashboards." />
          </>
        )}

        {!isPost && route === "#pricing" && (
          <>
            <PageHeader kicker={<><BadgeEuro size={14}/> Pricing</>} title="Simple subscription tiers" subtitle="Transparent fees. Ad spend excluded. Quarterly and annual prepay discounts available." />
            <Section>
              <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Pricing'}]} />
              <PricingGrid />
            </Section>
          </>
        )}

        {!isPost && route === "#hr" && (
          <>
            <PageHeader kicker={<><Users size={14}/> HR</>} title="Fractional HR add‑ons" subtitle="Hire faster with structured, data‑driven processes and onboarding support." />
            <Section>
              <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'HR'}]} />
              <HRGrid />
            </Section>
          </>
        )}
{!isPost && route === "#calculator" && (
  <>
    <PageHeader kicker={<><CalcIcon size={14}/> Calculator</>} title="ROAS & Profitability" subtitle="Model outcomes per tier to pick the best fit for your budget and margins." />
    <Section>
      <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Calculator'}]} />
      <CalculatorBlocks />
    </Section>
  </>
)}

        {!isPost && route === "#contact" && (
          <>
            <PageHeader kicker={<><Mail size={14}/> Contact</>} title="Let's talk" subtitle="Send your details and we’ll tailor a 90‑day plan and tier recommendation." />
            <Section>
              <Breadcrumbs trail={[{label:'Home', href:'#home'},{label:'Contact'}]} />
              <ContactBlocks />
            </Section>
          </>
        )}

        {!isPost && route === "#blog" && (
          <BlogPage />
        )}

        {isPost && (
          <PostPage slug={slug} />
        )}
      </main>

      <footer className="py-10 text-center text-sm text-slate-400 border-t" style={{borderColor: theme.border}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href="#pricing">Pricing</a>
              <a className="hover:text-white" href="#services">Services</a>
              <a className="hover:text-white" href="#blog">Blog</a>
              <a className="hover:text-white" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <DevPanel theme={theme} setTheme={setTheme} />
    </div>
  );
}

function PageSubnav({ items }) {
  return (
    <div className="sticky top-16 z-30 bg-slate-950/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-12 flex items-center gap-4 overflow-x-auto text-sm">
        {items.map((it)=> (
          <a key={it.href} href={it.href} className="px-3 py-1 rounded-lg border border-white/10 hover:border-white/30 whitespace-nowrap">{it.label}</a>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, emphasize = false }) {
  return (
    <div className={`rounded-xl p-4`} style={{border: `1px solid rgba(255,255,255,0.1)`, background: emphasize ? 'rgba(34,197,94,0.12)' : 'rgba(15,23,42,0.6)'}}>
      <div className="text-slate-400 text-xs">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  const cid = q.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between" aria-expanded={open} aria-controls={cid}>
        <span className="font-semibold">{q}</span>
        <ArrowRight className={`transition ${open ? "rotate-90" : ""}`} aria-hidden="true" />
      </button>
      {open && <div id={cid} className="px-5 pb-5 text-slate-300 text-sm">{a}</div>}
    </div>
  );
}
