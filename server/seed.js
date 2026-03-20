require('dotenv').config();
const mongoose = require('mongoose');
const Insight = require('./models/Insight');
const TeamMember = require('./models/TeamMember');
const PracticeArea = require('./models/PracticeArea');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lexauthority';

const practiceAreas = [
  {
    title: 'Corporate & M&A',
    description: 'Advising on complex domestic and cross-border transactions, private equity, and corporate governance for multinational enterprises.',
    fullDescription: 'Navigating complex domestic and international transactions with clinical precision. Our practice provides strategic counsel to global corporations, private equity firms, and institutional investors, ensuring structural integrity and long-term value creation in every mandate.',
    icon: 'business_center',
    order: 1,
    slug: 'corporate-ma',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJj3VewfuoR_FhEy2_cQOS4gWQED-mXKd9up6VuvfLnyKQ7y_-WeT3fXdGQrAiBMmngNMSrDqaaqO1Fqc8JnvsVM5ocj2lhrUEp--5Sc5kqk35KiB59Qrf-abXjjTwZ5tUyCGaLLXnK4p07TXDOjozajCrqeztqvDX1Zxh4Foa8vG4Jhto5Ps-vq2WF_eCIPYp8xFD-1275PuQOYYSTilskp5F_yD8AOQ4KvL83Myl1CWBB_Lcc6BORsCqR_Sno_rowflbnhGjnBw',
    services: [
      { icon: 'handshake',      title: 'Mergers & Acquisitions',  description: 'Strategic counsel for buy-side and sell-side mandates. We manage the full lifecycle of the transaction from initial due diligence to final closing integration.' },
      { icon: 'account_balance', title: 'Private Equity',          description: 'Dedicated advisory for funds and institutional investors. Structuring complex leveraged buyouts, growth capital investments, and exit strategies across jurisdictions.' },
      { icon: 'gavel',           title: 'Corporate Governance',    description: 'Ensuring compliance and board-level risk management. We provide sophisticated guidance on fiduciary duties, disclosure requirements, and regulatory alignment.' },
    ],
    sectors: [
      { title: 'Technology & Media',    description: 'High-growth mandates and intellectual property-driven transactions.' },
      { title: 'Financial Services',    description: 'Navigating the intersection of capital markets and banking regulation.' },
      { title: 'Industrial Goods',      description: 'Global supply chain logistics and manufacturing equity mandates.' },
      { title: 'Energy & Infrastructure', description: 'Large-scale project financing and cross-border energy consortia.' },
    ],
  },
  {
    title: 'Litigation & Dispute Resolution',
    description: 'Strategic representation in high-stakes commercial disputes, international arbitration, and regulatory investigations across all jurisdictions.',
    fullDescription: 'When commercial disputes demand the highest standard of advocacy, our litigation team delivers. We represent global corporations, financial institutions, and sovereign entities in the most complex proceedings — from international arbitration to multi-jurisdictional regulatory investigations.',
    icon: 'gavel',
    order: 2,
    slug: 'litigation',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75CtM-y7lhr1MTDFTIaUtSXKd7AmuP3aMtPeIHwH61odK83UpygrHuE3WPuqsdqwveJumygzdKd9Hq8hNsLr99qHd3Uw9M9e6fFSRtgj8NYrq5Yx6XbXCCRRKLnov_K49I0pi4OD2IamrLyJL8JopP_Dj_qgcno4fzJ4jxJtqjihRwWRVl5lDRc5Wa1szuog8h1KiHwmVsNRglh9N9peRwDd4ne-cls49STEmkIlOtkWSstye6tWJw18Qs-pYrCvG7-s8cKTtjw',
    services: [
      { icon: 'balance',         title: 'Commercial Litigation',       description: 'Robust representation in high-value commercial disputes before courts of first instance and appellate tribunals in all key jurisdictions.' },
      { icon: 'public',          title: 'International Arbitration',   description: 'Experienced advocates in ICC, LCIA, SIAC, and ICSID arbitrations. We develop strategy that balances cost-efficiency with maximum recovery prospects.' },
      { icon: 'policy',          title: 'Regulatory Investigations',   description: 'Proactive and reactive counsel during regulatory inquiries, dawn raids, and enforcement proceedings across financial services and competition law.' },
    ],
    sectors: [
      { title: 'Financial Services',  description: 'Banking disputes, securities litigation, and regulatory enforcement defense.' },
      { title: 'Technology & IP',     description: 'Patent and trade secret litigation across major jurisdictions.' },
      { title: 'Energy Disputes',     description: 'Production-sharing agreement and joint venture dispute resolution.' },
      { title: 'Construction',        description: 'Large-scale project delay and defect claims under FIDIC and NEC contracts.' },
    ],
  },
  {
    title: 'Real Estate',
    description: 'Comprehensive advice on real estate investment, development, finance, and asset management for global institutional investors.',
    fullDescription: 'Our real estate practice advises on the full spectrum of property transactions — from single-asset acquisitions to complex portfolio restructurings. We act for sovereign wealth funds, pension funds, REITs, and private developers across every stage of the property lifecycle.',
    icon: 'apartment',
    order: 3,
    slug: 'real-estate',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtUpel5W0hOSiDu9q1G1y6AryWFbxlDLma0SEnbMYSxvuWovVE1uA8OBuLJRbt8el0hU_EPP3XNQUhIjjqR_ggXeH1G0YuWS_us5P-e-SoD_JbWHe_GhdrHAz-ZTgNwDWzuCFRgVxyWnTAQfqWNVvpVOX3WKpNP9gCn7G0qmgLtpw8ltKTOzudR_1JQrVaPi_wt_sbjRC-SKXmHyqGwdm7JbrowtS2oRI8TLkR4aFa74RiDNrG1bAuTkmPC21bUyb7XQgafmgU8g',
    services: [
      { icon: 'villa',           title: 'Investment & Acquisitions',   description: 'Structuring and executing acquisitions and disposals of commercial, residential, and mixed-use assets across all major markets.' },
      { icon: 'construction',    title: 'Development Finance',         description: 'Advising lenders and borrowers on construction financing, mezzanine debt, and equity joint ventures for development projects.' },
      { icon: 'domain',          title: 'Asset Management',            description: 'Long-term advisory on portfolio management, lease restructuring, planning applications, and strategic asset repositioning.' },
    ],
    sectors: [
      { title: 'Commercial Property',   description: 'Office, retail, and logistics assets in prime urban locations.' },
      { title: 'Residential Portfolios', description: 'Build-to-rent and large-scale residential investment mandates.' },
      { title: 'Mixed-Use Development', description: 'Planning and delivery of complex urban regeneration schemes.' },
      { title: 'Infrastructure',        description: 'Long-term concession agreements and infrastructure financing.' },
    ],
  },
  {
    title: 'Banking & Finance',
    description: 'Deep expertise in structured finance, capital markets, and regulatory compliance for leading financial institutions.',
    fullDescription: 'Our banking and finance team advises the world\'s leading financial institutions, corporates, and alternative lenders on their most complex financing transactions. We combine rigorous technical expertise with a thorough understanding of regulatory frameworks across all major financial centres.',
    icon: 'account_balance',
    order: 4,
    slug: 'banking-finance',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05ngTaZX4EpN3cN_SweJ0M3QqCSb6dmGQPBV7MVNZaS5JmV6XS2JbG6-zojA52Ene-y-TTuejfqkfZLGUosyib_eXSw5AFf7gK_FvgheIGi_hZLvjrb6N81NcNnSiIojjHtUarTT1GwllyWOpq5Xrczxl-015wpbBmdHfncl5dBfmK-Jh-FbMCk1UB5W9kJ5hrc5sO8EzEAJQkqHGZGRCON_I8otzEe7YfpECXsLan-INsCtACC9QwRHyFgaKdcEueOswZgeX-Q',
    services: [
      { icon: 'trending_up',     title: 'Structured Finance',          description: 'Complex securitisations, CLOs, and asset-backed financing structures for institutional issuers and arrangers across global capital markets.' },
      { icon: 'show_chart',      title: 'Capital Markets',             description: 'Equity and debt capital markets transactions, including IPOs, rights issues, high-yield bond offerings, and convertible note programs.' },
      { icon: 'security',        title: 'Regulatory Compliance',       description: 'Navigating Basel IV, MiCA, and evolving prudential frameworks. We advise boards and compliance functions on regulatory strategy and implementation.' },
    ],
    sectors: [
      { title: 'Investment Banking', description: 'Leveraged finance, acquisition financing, and capital structure advisory.' },
      { title: 'Insurance',          description: 'Solvency II compliance and insurance-linked securities issuance.' },
      { title: 'Asset Management',   description: 'Fund structuring, AIFMD compliance, and cross-border distribution.' },
      { title: 'Fintech',            description: 'Payments regulation, e-money licensing, and digital asset frameworks.' },
    ],
  },
  {
    title: 'Intellectual Property',
    description: 'Protecting global brands and innovation through strategic IP portfolio management, licensing, and enforcement.',
    fullDescription: 'In a knowledge-driven economy, intellectual property is the most valuable asset a business can hold. Our IP practice works with technology leaders, pharmaceutical companies, and global brands to protect, monetise, and defend their most critical assets across all jurisdictions.',
    icon: 'verified_user',
    order: 5,
    slug: 'intellectual-property',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBef7BCsTXEeVd4Koao90aicXtIlejWstDUogmOXxB-1DSw4YQQNKzRtDRu9csL9yB9o6uFiAW6f30bP649CRTk3btktkorGP0TuA-vNC3AhyoU0aTDrSoenDGEJc8AO8sx5n0B4gu-IubRTf0haZa_Eu4YtMckkeTl9yjr7mLuV5cqE6TX9Vlm2cvxAOYgHKslSCcZiQVpffLhsapG-Ev2ZKWm_CVzcFvlMmYTL5u0PJqdsZ4aI1HC84Qg3IouiCbCVQvJvdSGw',
    services: [
      { icon: 'lightbulb',       title: 'Patent Strategy',             description: 'Building and defending high-value patent portfolios. We advise on prosecution, opposition proceedings, and cross-border infringement litigation.' },
      { icon: 'sell',            title: 'Trademark & Brand',           description: 'Global trademark portfolio management, anti-counterfeiting programs, and brand protection strategies across all major territories and online platforms.' },
      { icon: 'shield',          title: 'IP Enforcement',              description: 'Proactive enforcement through cease-and-desist campaigns, customs recordals, and targeted litigation against infringers in key markets.' },
    ],
    sectors: [
      { title: 'Technology',          description: 'Software patents, SEP licensing, and standard-essential patent pools.' },
      { title: 'Life Sciences',       description: 'Pharmaceutical patents, regulatory data exclusivity, and biosimilar strategy.' },
      { title: 'Media & Entertainment', description: 'Copyright protection, content licensing, and platform liability frameworks.' },
      { title: 'Consumer Goods',      description: 'Brand protection, design rights, and trade dress enforcement globally.' },
    ],
  },
  {
    title: 'Employment & Incentives',
    description: 'Navigating global workforce challenges, executive compensation, and labor relations in an evolving regulatory landscape.',
    fullDescription: 'The global workforce is undergoing profound transformation. Our employment and incentives practice helps boards, HR leadership, and in-house teams navigate complex employment law, executive pay governance, and cross-border workforce restructuring with confidence.',
    icon: 'groups',
    order: 6,
    slug: 'employment',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSTZWpOnlpeFs3R2V7Cl1KtJeaF0Rdmm6K9yyKKVV3gQ7jkogwx7EkID51ae4zLrTvoMh4F3GE34IASwNsVvtwwroVg_4DAOsMksSGVOQB7QeAQPceMeLBWe8lSE1JQP3ZyWmh_ipzRdjKCHltvA5uOVI10JlhECfekJb3FeqQi8jPdYBAJtAm8xgB1PbiL5GUb7pj5wFgeH4du8BrA7oLvUCrNZS5f3OZgetDgwqjs8620GsNnjEyI8d22DxscQw2GqpLbRLOcg',
    services: [
      { icon: 'payments',        title: 'Executive Compensation',      description: 'Designing and implementing board-approved incentive structures, long-term equity plans, and golden parachute arrangements that attract and retain senior talent.' },
      { icon: 'diversity_3',     title: 'Labor Relations',             description: 'Strategic guidance on collective bargaining, works council engagement, and industrial action management across all major European and US jurisdictions.' },
      { icon: 'flight_takeoff',  title: 'Global Mobility',             description: 'End-to-end advisory for international assignments — from immigration and tax equalisation to social security treaties and cross-border termination risk.' },
    ],
    sectors: [
      { title: 'Financial Services', description: 'Remuneration code compliance and senior manager accountability frameworks.' },
      { title: 'Technology',         description: 'Equity incentive design for pre-IPO and post-listing tech companies.' },
      { title: 'Manufacturing',      description: 'Workforce restructuring, TUPE obligations, and site closure procedures.' },
      { title: 'Healthcare',         description: 'Regulatory employment frameworks for hospital groups and medical staffing.' },
    ],
  },
];

const teamMembers = [
  { name: 'Marcus Sterling', title: 'Senior Partner, Corporate Litigation', bio: 'Over 20 years of experience in high-stakes commercial disputes and international arbitration.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChH8StkUMvWcwQN-7dXu6WbWIwM-CceXUPB--bH-IEcRYTPuNoKvws-rGKUL26haCMoEkHNhupoAnqmozJWviRWjfDGGUb1iJ3oSUj0me0eX_1DNCfoA3-PHjd_W19RKJowUxhgP3HgsVAklt7tpI8gUynQuD8yDDbaQytApV0EdFHaEJ5xpF8m2l1I27SWuCxl9WDGYAhH0smX7Ha8FPM36IqBQrVTq94nuGrrkbqt0r0ZzuaAsEFDLmP7OIXpOqI0ApreoYIPA', imageAlt: 'Professional male attorney in a navy suit', order: 1 },
  { name: 'Elena Rodriguez', title: 'Partner, Intellectual Property', bio: 'Specializing in global trademark strategy and emerging technology patent protections.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfnbHwTFUmOxaWmQJfVOFBSOWE2H8zJOzxIVrAG_4YBA9_p3fLaalZeTLElqom3RAYhg3UP_eeGxqhNav5igWwRf6yD1RTiAKzimZjopXDOfXrt-KWpwi1KhrSoqLeBFTEm8Gb6cXYlNqJnehpVDAQCKmeZiHVAIiReL57hbvPUQzYRLCzKMedc0Y2tXSxUnejNN1lebm5hppQJJIa2QcAMK34H4p89uHm3eE1qQft2TsPsup_cgsTX4XaVTAx6Tp2X0uxDPju6w', imageAlt: 'Professional female attorney in a dark blazer', order: 2 },
  { name: 'Jonathan Wu', title: 'Associate, M&A', bio: 'Providing strategic counsel on cross-border mergers and complex private equity structures.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD55NLapAcV-oOVQRHoXozveAO1HESmyhDZGVBl33fdIo257jHAK3nTz9-CoK6chseUgsEqF1Q443H7OSdOFSpPfnwxBVTrJmPx3dUQlohBflgSArsRFvRwt4mUPPp0LtAz1Y2SiU4NFYLrIRojYcLPkp0MoXwi0ia7Ed68yPXPc5IUGiJpGVf5fUDUa6OLForgoUMqCbtBKHmJaWsHsixC267hNrV4wYHsfma2rGnhwwlsSrOqJ5fUdsx3xYctOlyTpeIG6xwdEQ', imageAlt: 'Young professional male attorney smiling softly', order: 3 },
  { name: 'Sarah Henderson', title: 'Senior Partner, Private Wealth', bio: 'Expert advisor to family offices and high-net-worth individuals on legacy planning.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnVf12htDn2hsFanXg5JfMGJff_DaAGEAiRRUWopm0XbmZbSqVjU5CZ9-3lC-nxUDZ7QSLSCARAZSZUV6jKtrPcFimG2cVKgGMzT3-cs08otElE_ihJCg0-SF9TY3E9f-d4qI9qZHXDzc9lOdUH5BLYAtcfx6LdIocuT647dxaMIq3t0drCJLIBj1QS4JJKGeaJ5QDmSM_UEcMH46DMUIdxVpKOTUKqPF-ODZjRgabjiNnjpLhcov-YDCHRIvswQGVFu26Df6Tig', imageAlt: 'Experienced female attorney in professional attire', order: 4 },
  { name: 'David Thorne', title: 'Partner, Criminal Defense', bio: 'Renowned white-collar defense attorney with a track record of successful navigations.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzTkiccZH74YY5vK_m4Fhrz0jzFNi8QO_OuL9i4aPz2Zm2stN6vKNJynQvYiUqueremkXL2hP_BGHWUdjTT_hrpB3SjRvnJL7evJ9sioNSoxJE9fQ3Hf6yNqEt8Kaft-2eH67KXr8fklmZwQV22xAdmiElb2dfGCzYe_PmLh-SA2gtPB0vOhknvTt717s11cZ-c5Qc4Ufip3d5bWde_Sb0tLQb3_PQsapqhE2fmC3trBClRvLP7JQRu2pJT6wZrdZdHGcaI8efCw', imageAlt: 'Professional male attorney with glasses', order: 5 },
  { name: 'Amara Okafor', title: 'Associate, Employment Law', bio: 'Advising global corporations on compliance, workforce equity, and regulatory shifts.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJO7NIyaiqUJ3qs8EYCS30jFmDqHdu8KXKSclSFq41MnTYJUzPVRkH-JXI8r5o3Q8RuQk6rgYBk-8hPMlpAPUbunvo-TLwfixflLKJEK2Lpmc-EOriAMY-5cH3jNr51UfZv749BgPji3nNI9ZL1QPwSM44EBpp9ICh0AyG9OlOfib78UbqiFiT7iViuUavueizVxT6d5yvAOL6zsYLI-UzJztm1cfhzj-__ZjnWnURw-jkkGeGJOsDCTyJ-xnYbs7RCP7E042Fjg', imageAlt: 'Confident female attorney in professional grey suit', order: 6 },
  { name: 'Robert Chen', title: 'Counsel, Real Estate', bio: 'Facilitating large-scale commercial developments and portfolio acquisitions.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdc_mAjpP3s26so3j1IpdfSf6bICbiO4BdY3WdRHrF-PPL4UcO4TQpFGmKr9OLPDF7ovv1bobEa7Lml6G7QqlF89lONYrpabeHtHVvSUjTmYWx6zytUJQIIGa6v1Sx3RJQYlkNA0eizNuKV3ykBilqRKmJPNynYijEvSQa_qZd_aZO6x1onGDlIPUZ6nvuTpcT48u7mes3GGyi8uxtNl2zdpGo6OTT8PZ9uOaWm57Ub5SzWfJ3Xf6YtUR-w6WEwPeFUKK1D1viZA', imageAlt: 'Male professional in business formal attire', order: 7 },
  { name: 'Lillian Vance', title: 'Partner, Environmental Law', bio: 'Pioneering legal frameworks for ESG compliance and sustainable energy ventures.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8TGwUoYKam3IRgcKP3bLzG-9-Kxkq5M2BeSb6tIBMFSr1dv2DKzXowKiSBjo_GyU9ycK3yIH0UX6aEienJJBWxULDemKuml0lcMcTT_4jA52N86487D47jeFA9cwgclrHnpynwUlSSbX3bsFRyFRs9bBmbrKE49xW3O7umbfQwMxtZ8IF-VOJ-cPg8EvTNQKWS42i8EkNfvr076RiNylam6IiIzdaF74mGaOAe_f9CSN__iHHX_upReTcJVNlwPsLCqkwtbL3vQ', imageAlt: 'Young professional woman in professional attire', order: 8 },
];

const insights = [
  {
    category: 'Corporate Law',
    title: 'Navigating New Cross-Border Compliance Standards in 2024',
    excerpt: 'A comprehensive breakdown of the updated regulatory frameworks affecting multinational entities operating within the European and Asian markets.',
    author: 'Marcus Sterling',
    authorTitle: 'Senior Partner, Corporate Litigation',
    readTime: '8 Min Read',
    tags: ['Compliance', 'International', '2024 Outlook'],
    body: `
<h2>The Shifting Paradigm of Sovereignty</h2>
<p>For decades, international compliance was a matter of bilateral treaty adherence. However, the introduction of the 2024 Unified Standard marks a departure from historical norms. We are seeing a transition toward automated multilateral exchange — a system where digital reporting takes precedence over manual disclosure.</p>
<p>Legal departments must now contend with real-time data harvesting by jurisdictional authorities. This is not merely an administrative hurdle; it is a fundamental reconfiguration of how corporate privacy is defined in the 21st century.</p>
<div class="callout">
  <h3>Key Regulatory Pillars</h3>
  <ul>
    <li>Real-time Beneficial Ownership Transparency (RBOT) protocols across EU jurisdictions.</li>
    <li>Mandatory ESG-linked disclosure requirements for non-listed entities with revenue exceeding €50M.</li>
    <li>Enhanced cross-border dispute resolution mechanisms under the 2024 Hague Convention updates.</li>
  </ul>
</div>
<h2>Strategic Imperatives for Counsel</h2>
<p>The role of the General Counsel has evolved from reactive risk management to proactive structural design. To maintain the integrity of cross-border operations, firms must adopt a "Compliance by Design" philosophy — integrating legal logic directly into the enterprise's technological stack.</p>
<p>As we move into 2025, the margin for error in jurisdictional reporting has narrowed to near zero. Firms that fail to centralize their regulatory data risk not only financial penalties but a more permanent loss of reputational standing in the global market.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSTZWpOnlpeFs3R2V7Cl1KtJeaF0Rdmm6K9yyKKVV3gQ7jkogwx7EkID51ae4zLrTvoMh4F3GE34IASwNsVvtwwroVg_4DAOsMksSGVOQB7QeAQPceMeLBWe8lSE1JQP3ZyWmh_ipzRdjKCHltvA5uOVI10JlhECfekJb3FeqQi8jPdYBAJtAm8xgB1PbiL5GUb7pj5wFgeH4du8BrA7oLvUCrNZS5f3OZgetDgwqjs8620GsNnjEyI8d22DxscQw2GqpLbRLOcg',
    imageAlt: 'Close up of classic law books in library',
    publishedAt: new Date('2024-05-14'),
    slug: 'cross-border-compliance-2024',
  },
  {
    category: 'Litigation',
    title: 'The Shift in Commercial Arbitration: What Firms Need to Know',
    excerpt: 'Examining the recent shift toward mediation-first clauses and the impact on long-term commercial litigation strategies for tech conglomerates.',
    author: 'Elena Rodriguez',
    authorTitle: 'Partner, Intellectual Property',
    readTime: '6 Min Read',
    tags: ['Arbitration', 'Dispute Resolution', 'Strategy'],
    body: `
<h2>From Litigation to Mediation</h2>
<p>Commercial contracts increasingly contain mediation-first clauses that require parties to exhaust structured negotiation before escalating to arbitration or court proceedings. This shift, accelerated by post-pandemic cost-consciousness, is reshaping how litigation teams structure their advisory mandates.</p>
<p>Technology companies in particular have embraced hybrid clauses that offer rapid, confidential resolution while preserving the option to litigate novel IP questions before specialist judges.</p>
<div class="callout">
  <h3>What to Audit in Your Existing Agreements</h3>
  <ul>
    <li>Dispute resolution pathways and escalation timelines.</li>
    <li>Seat of arbitration and governing law in international contracts.</li>
    <li>Confidentiality obligations that may conflict with disclosure requirements.</li>
  </ul>
</div>
<h2>Implications for In-House Counsel</h2>
<p>In-house teams must recalibrate their dispute-readiness frameworks. This means investing in trained mediators as a retained resource, updating template commercial agreements, and educating boards on the cost and time advantages of early-stage resolution.</p>
<p>Firms that proactively adapt their contracts now will be better positioned to resolve disputes swiftly, protect commercial relationships, and control costs when conflicts inevitably arise.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75CtM-y7lhr1MTDFTIaUtSXKd7AmuP3aMtPeIHwH61odK83UpygrHuE3WPuqsdqwveJumygzdKd9Hq8hNsLr99qHd3Uw9M9e6fFSRtgj8NYrq5Yx6XbXCCRRKLnov_K49I0pi4OD2IamrLyJL8JopP_Dj_qgcno4fzJ4jxJtqjihRwWRVl5lDRc5Wa1szuog8h1KiHwmVsNRglh9N9peRwDd4ne-cls49STEmkIlOtkWSstye6tWJw18Qs-pYrCvG7-s8cKTtjw',
    imageAlt: 'Professional attorney reviewing legal documents carefully',
    publishedAt: new Date('2024-05-10'),
    slug: 'commercial-arbitration-shift',
  },
  {
    category: 'Intellectual Property',
    title: 'AI and Copyright: Protecting Digital Assets in the Age of Generative Tech',
    excerpt: 'Legal strategies for safeguarding proprietary datasets and artistic outputs as the courts redefine the boundaries of authorship.',
    author: 'Jonathan Wu',
    authorTitle: 'Associate, M&A',
    readTime: '7 Min Read',
    tags: ['AI', 'Copyright', 'Digital Assets'],
    body: `
<h2>Authorship in the Age of Generative AI</h2>
<p>Courts across multiple jurisdictions are actively grappling with a fundamental question: can an AI-generated work be protected by copyright? The consensus emerging from US and EU rulings is that a human creative element remains a prerequisite for protection. However, the threshold of human contribution required is still being defined case by case.</p>
<p>For companies training generative models on proprietary datasets, the risk is twofold — downstream liability for outputs that infringe third-party works, and upstream vulnerability if training data rights are not properly licensed.</p>
<div class="callout">
  <h3>Priority Actions for IP Counsel</h3>
  <ul>
    <li>Audit all datasets used for AI training against existing licensing terms.</li>
    <li>Implement human-in-the-loop workflows to establish copyright eligibility for generated outputs.</li>
    <li>Register copyrights for materials where human contribution can be documented.</li>
  </ul>
</div>
<h2>The Competitive Advantage of Early Compliance</h2>
<p>Firms that establish clear AI governance frameworks now — with defined policies on training data provenance, output ownership, and indemnification — will be far better positioned as regulatory frameworks solidify. The companies navigating this transition successfully will have treated legal compliance not as a constraint but as a competitive differentiator.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBef7BCsTXEeVd4Koao90aicXtIlejWstDUogmOXxB-1DSw4YQQNKzRtDRu9csL9yB9o6uFiAW6f30bP649CRTk3btktkorGP0TuA-vNC3AhyoU0aTDrSoenDGEJc8AO8sx5n0B4gu-IubRTf0haZa_Eu4YtMckkeTl9yjr7mLuV5cqE6TX9Vlm2cvxAOYgHKslSCcZiQVpffLhsapG-Ev2ZKWm_CVzcFvlMmYTL5u0PJqdsZ4aI1HC84Qg3IouiCbCVQvJvdSGw',
    imageAlt: 'Focused shot of fountain pen signing official contract',
    publishedAt: new Date('2024-04-28'),
    slug: 'ai-copyright-digital-assets',
  },
  {
    category: 'Real Estate',
    title: 'Zoning Reforms and Their Impact on Urban Development Projects',
    excerpt: 'Understanding the implications of high-density zoning shifts for commercial real estate developers in major metropolitan centers.',
    author: 'Sarah Henderson',
    authorTitle: 'Senior Partner, Private Wealth',
    readTime: '5 Min Read',
    tags: ['Zoning', 'Urban Development', 'Real Estate'],
    body: `
<h2>A New Urban Density Paradigm</h2>
<p>Major metropolitan authorities from London to Singapore are revising decades-old zoning frameworks to permit higher-density mixed-use development. Driven by housing shortages and sustainability mandates, these reforms present both opportunity and legal complexity for commercial developers.</p>
<p>The principal challenge lies in the transition period: projects that received planning consent under the old regime may now be subject to renegotiation of contributions, revised height restrictions, and new obligations around affordable housing provision.</p>
<div class="callout">
  <h3>Due Diligence Priorities</h3>
  <ul>
    <li>Review all planning permissions against updated zoning overlays before commencement.</li>
    <li>Assess the impact of infrastructure levy reforms on project viability models.</li>
    <li>Engage early with planning authorities to secure interpretive guidance on transitional provisions.</li>
  </ul>
</div>
<h2>Structuring for Flexibility</h2>
<p>Developers who structure their acquisition and joint venture agreements to accommodate zoning variability — through contingent pricing mechanisms and phased completion milestones — are better insulated from the legal and financial risk of mid-project regulatory change. Proactive legal due diligence is no longer optional; it is a prerequisite for securing institutional financing.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtUpel5W0hOSiDu9q1G1y6AryWFbxlDLma0SEnbMYSxvuWovVE1uA8OBuLJRbt8el0hU_EPP3XNQUhIjjqR_ggXeH1G0YuWS_us5P-e-SoD_JbWHe_GhdrHAz-ZTgNwDWzuCFRgVxyWnTAQfqWNVvpVOX3WKpNP9gCn7G0qmgLtpw8ltKTOzudR_1JQrVaPi_wt_sbjRC-SKXmHyqGwdm7JbrowtS2oRI8TLkR4aFa74RiDNrG1bAuTkmPC21bUyb7XQgafmgU8g',
    imageAlt: 'Minimalist glass office tower reflecting the sky',
    publishedAt: new Date('2024-04-22'),
    slug: 'zoning-reforms-urban-development',
  },
  {
    category: 'Regulatory Affairs',
    title: 'ESG Reporting: Preparing for the 2025 Mandatory Disclosure Cycles',
    excerpt: 'A practical guide for C-suite executives on aligning corporate governance with new environmental transparency mandates.',
    author: 'David Thorne',
    authorTitle: 'Partner, Criminal Defense',
    readTime: '9 Min Read',
    tags: ['ESG', 'Disclosure', 'Governance'],
    body: `
<h2>The Disclosure Imperative</h2>
<p>The Corporate Sustainability Reporting Directive (CSRD) comes into full force for a broad range of mid-market and large-cap entities in 2025. For many firms, this represents the most significant expansion of statutory reporting obligations in a generation. The directive demands double materiality assessments — evaluating both the company's impact on the environment and the environment's impact on the company's financial position.</p>
<p>Non-compliance carries material risk: regulatory fines, restrictions on public procurement, and the reputational damage that follows mandatory disclosure of inadequate reporting.</p>
<div class="callout">
  <h3>Key Obligations Under the 2025 Cycle</h3>
  <ul>
    <li>Publish a sustainability statement within the annual management report.</li>
    <li>Obtain limited assurance from an accredited third-party auditor.</li>
    <li>Align disclosures with the European Sustainability Reporting Standards (ESRS).</li>
  </ul>
</div>
<h2>Building a Compliant Reporting Infrastructure</h2>
<p>Boards must treat ESG reporting as a board-level governance matter, not a communications exercise. The companies that have invested early in data infrastructure, cross-functional reporting teams, and third-party audit relationships will meet the 2025 cycle with confidence. Those that have not face compressed timelines and significant remediation costs.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05ngTaZX4EpN3cN_SweJ0M3QqCSb6dmGQPBV7MVNZaS5JmV6XS2JbG6-zojA52Ene-y-TTuejfqkfZLGUosyib_eXSw5AFf7gK_FvgheIGi_hZLvjrb6N81NcNnSiIojjHtUarTT1GwllyWOpq5Xrczxl-015wpbBmdHfncl5dBfmK-Jh-FbMCk1UB5W9kJ5hrc5sO8EzEAJQkqHGZGRCON_I8otzEe7YfpECXsLan-INsCtACC9QwRHyFgaKdcEueOswZgeX-Q',
    imageAlt: 'Stately stone columns of a financial institution',
    publishedAt: new Date('2024-04-15'),
    slug: 'esg-reporting-2025',
  },
  {
    category: 'Real Estate',
    title: 'Commercial Lease Restructuring: Navigating the Post-2024 Market',
    excerpt: 'How landlords and tenants are renegotiating lease terms in response to shifting occupancy patterns and the rise of flexible workspace models.',
    author: 'Robert Chen',
    authorTitle: 'Counsel, Real Estate',
    readTime: '5 Min Read',
    tags: ['Leases', 'Commercial Property', 'Restructuring'],
    body: `
<h2>The Structural Shift in Commercial Occupancy</h2>
<p>The commercial real estate sector is undergoing a structural recalibration. Hybrid working patterns, accelerated by the pandemic and now institutionalised by corporate policy, have permanently altered the demand profile for Grade A office space. Tenants are negotiating shorter terms, break clauses, and fit-out contributions as standard — requirements that landlords must now accommodate or risk prolonged voids.</p>
<p>For legal practitioners, this shift has generated a surge in lease re-gear mandates. The tension between institutional landlord expectations and occupier flexibility requirements is being resolved, deal by deal, at the negotiating table.</p>
<div class="callout">
  <h3>Key Negotiating Points in 2024 Re-Gears</h3>
  <ul>
    <li>Break clause timing and conditions — typically at years three and five of longer terms.</li>
    <li>Landlord contributions to fit-out amortised against extended lease commitments.</li>
    <li>Turnover rent structures linked to actual occupancy and revenue performance.</li>
  </ul>
</div>
<h2>Legal Implications for Landlords</h2>
<p>Landlords accepting shorter terms must carefully consider the impact on asset valuation and financing covenants. Lenders with WAULT-based covenant tests may require consent before agreeing to terms below a defined weighted average unexpired lease length. Proactive engagement with lenders before heads of terms are agreed remains essential.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtUpel5W0hOSiDu9q1G1y6AryWFbxlDLma0SEnbMYSxvuWovVE1uA8OBuLJRbt8el0hU_EPP3XNQUhIjjqR_ggXeH1G0YuWS_us5P-e-SoD_JbWHe_GhdrHAz-ZTgNwDWzuCFRgVxyWnTAQfqWNVvpVOX3WKpNP9gCn7G0qmgLtpw8ltKTOzudR_1JQrVaPi_wt_sbjRC-SKXmHyqGwdm7JbrowtS2oRI8TLkR4aFa74RiDNrG1bAuTkmPC21bUyb7XQgafmgU8g',
    imageAlt: 'Modern glass office tower reflecting the city skyline',
    publishedAt: new Date('2024-03-18'),
    slug: 'commercial-lease-restructuring-2024',
  },
  {
    category: 'Corporate Law',
    title: 'Private Credit Ascendancy: Legal Frameworks for Non-Bank Lending',
    excerpt: 'As private credit funds displace traditional bank lenders in leveraged finance, counsel must master the evolving documentation standards and regulatory expectations.',
    author: 'Marcus Sterling',
    authorTitle: 'Senior Partner, Corporate Litigation',
    readTime: '7 Min Read',
    tags: ['Private Credit', 'Leveraged Finance', 'Corporate Law'],
    body: `
<h2>The Rise of the Direct Lender</h2>
<p>Private credit has emerged as one of the most significant structural shifts in corporate finance over the past decade. With banks constrained by capital requirements and risk appetite, non-bank lenders — credit funds, BDCs, and insurance-linked vehicles — have filled the void. In the European mid-market, direct lending now accounts for the majority of new leveraged buyout financings by volume.</p>
<p>For corporate counsel, this shift demands fluency in a new documentation landscape. Direct lending transactions typically use bilateral or club documentation rather than syndicated loan agreements, giving lenders significantly more control over amendment and waiver mechanics.</p>
<div class="callout">
  <h3>Documentation Differences: Direct Lending vs. Syndicated</h3>
  <ul>
    <li>Tighter covenant packages with maintenance tests rather than incurrence-only structures.</li>
    <li>Lender consent thresholds typically require unanimous or supermajority approval for material changes.</li>
    <li>PIK toggle provisions and equity cure rights negotiated deal by deal rather than market-standard.</li>
  </ul>
</div>
<h2>Regulatory Horizon</h2>
<p>European regulators are increasingly focused on the systemic risk implications of private credit growth. ESMA and national competent authorities are developing enhanced reporting frameworks for credit funds. Borrowers should expect lenders to pass compliance costs through documentation, and counsel advising on new facilities should build regulatory change provisions into long-term credit agreements.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSTZWpOnlpeFs3R2V7Cl1KtJeaF0Rdmm6K9yyKKVV3gQ7jkogwx7EkID51ae4zLrTvoMh4F3GE34IASwNsVvtwwroVg_4DAOsMksSGVOQB7QeAQPceMeLBWe8lSE1JQP3ZyWmh_ipzRdjKCHltvA5uOVI10JlhECfekJb3FeqQi8jPdYBAJtAm8xgB1PbiL5GUb7pj5wFgeH4du8BrA7oLvUCrNZS5f3OZgetDgwqjs8620GsNnjEyI8d22DxscQw2GqpLbRLOcg',
    imageAlt: 'Close-up of law books in a formal library setting',
    publishedAt: new Date('2024-03-10'),
    slug: 'private-credit-legal-frameworks',
  },
  {
    category: 'Regulatory Affairs',
    title: 'Digital Markets Act: Platform Liability in the New Regulatory Order',
    excerpt: 'The DMA fundamentally reframes the legal obligations of gatekeeper platforms. General counsels at technology companies must urgently recalibrate their compliance posture.',
    author: 'Amara Okafor',
    authorTitle: 'Associate, Employment Law',
    readTime: '6 Min Read',
    tags: ['DMA', 'Platform Regulation', 'Technology'],
    body: `
<h2>Gatekeepers Under Scrutiny</h2>
<p>The Digital Markets Act came into full force in March 2024, designating six major technology platforms as "gatekeepers" subject to a new set of ex ante obligations. Unlike competition law, which requires regulators to demonstrate harm before intervening, the DMA imposes structural obligations proactively — prohibiting self-preferencing, mandating interoperability, and requiring data portability as baseline requirements.</p>
<p>For in-house teams at gatekeeper companies, the compliance challenge is enormous in scope. Many of the DMA's obligations require changes to core product architecture, data governance frameworks, and commercial arrangements with third-party developers and business users.</p>
<div class="callout">
  <h3>Core DMA Obligations for Designated Gatekeepers</h3>
  <ul>
    <li>Prohibition on ranking own products and services more favourably than competing offerings.</li>
    <li>Mandatory interoperability with third-party messaging services for core communication platforms.</li>
    <li>Data portability obligations enabling business users to transfer data to alternative platforms.</li>
  </ul>
</div>
<h2>Strategic Implications for Non-Gatekeeper Firms</h2>
<p>The DMA's impact extends beyond designated gatekeepers. Businesses that operate within gatekeeper ecosystems — as app developers, advertisers, or marketplace sellers — gain new rights to challenge unfair platform practices and access data previously withheld. Legal teams should assess which DMA obligations their platform partners are now subject to and how to leverage these rights in commercial negotiations.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05ngTaZX4EpN3cN_SweJ0M3QqCSb6dmGQPBV7MVNZaS5JmV6XS2JbG6-zojA52Ene-y-TTuejfqkfZLGUosyib_eXSw5AFf7gK_FvgheIGi_hZLvjrb6N81NcNnSiIojjHtUarTT1GwllyWOpq5Xrczxl-015wpbBmdHfncl5dBfmK-Jh-FbMCk1UB5W9kJ5hrc5sO8EzEAJQkqHGZGRCON_I8otzEe7YfpECXsLan-INsCtACC9QwRHyFgaKdcEueOswZgeX-Q',
    imageAlt: 'Stately stone columns of a financial institution',
    publishedAt: new Date('2024-03-05'),
    slug: 'digital-markets-act-platform-liability',
  },
  {
    category: 'Corporate Governance',
    title: 'Fiduciary Duties in the Era of Shareholder Activism',
    excerpt: 'Analyzing the evolving legal responsibilities of board members when facing high-pressure activist investor campaigns.',
    author: 'Lillian Vance',
    authorTitle: 'Partner, Environmental Law',
    readTime: '6 Min Read',
    tags: ['Fiduciary Duty', 'Shareholder Activism', 'Board'],
    body: `
<h2>The Activist Playbook and the Board's Response</h2>
<p>Activist investors have become a structural feature of public market governance. Armed with proxy advisory relationships and increasingly sophisticated legal strategies, they routinely challenge board composition, capital allocation decisions, and strategic direction. For directors, the legal question is not whether activists can exert influence, but how to fulfil fiduciary duties under this sustained pressure without exposing themselves to personal liability.</p>
<p>Recent case law across Delaware, the UK, and Singapore has clarified that boards retain wide discretion to reject activist proposals — but only where they can demonstrate a rigorous, documented deliberative process. Good faith and proper procedure are the dual shields against derivative claims.</p>
<div class="callout">
  <h3>Board Protocols for Activist Engagements</h3>
  <ul>
    <li>Establish a dedicated engagement committee with defined authority and legal support.</li>
    <li>Document all deliberations, including dissenting views, in board minutes.</li>
    <li>Obtain independent legal and financial advice before responding to any public campaign.</li>
  </ul>
</div>
<h2>The Long-term Governance Dividend</h2>
<p>Boards that invest in governance best practices — including robust director education, clear conflict-of-interest policies, and regular independent assessments — are demonstrably more resilient to activist pressure. The goal is not to entrench management, but to ensure that shareholder value decisions are made through principled, defensible processes that withstand scrutiny from any quarter.</p>
    `.trim(),
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz20ugASvYOvSKmN6u9TYJp8Ed7lUrom5FYS2F6tnr7HW2E6Sxs4228Ld1dBOBASsgyJL8B1KVVkGSIxVHL5ybJ_wCOoSiqE8JgYhuDr4o_eB32UTdjHJZkqKzaBJX0F1DGyssthneWGGvopeCVvXqFfMGsm5lG-2Ga8vGQ8Z0PZR557rvxo2yO0GGM45n5nx8EBMGjSLjbmEqzRWL6nZo7LeHQ7tVSCHIBJYSrezBq08WL7egLKXwM_U3DElXxCtL6lUXASoqIg',
    imageAlt: 'Modern empty boardroom with wooden table and glass walls',
    publishedAt: new Date('2024-03-30'),
    slug: 'fiduciary-duties-shareholder-activism',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await PracticeArea.deleteMany({});
  await TeamMember.deleteMany({});
  await Insight.deleteMany({});

  await PracticeArea.insertMany(practiceAreas);
  await TeamMember.insertMany(teamMembers);
  await Insight.insertMany(insights);

  console.log('Database seeded successfully');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
