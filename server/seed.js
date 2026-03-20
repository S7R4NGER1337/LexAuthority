require('dotenv').config();
const mongoose = require('mongoose');
const Insight = require('./models/Insight');
const TeamMember = require('./models/TeamMember');
const PracticeArea = require('./models/PracticeArea');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lexauthority';

const practiceAreas = [
  { title: 'Corporate & M&A', description: 'Advising on complex domestic and cross-border transactions, private equity, and corporate governance for multinational enterprises.', icon: 'business_center', order: 1, slug: 'corporate-ma' },
  { title: 'Litigation & Dispute Resolution', description: 'Strategic representation in high-stakes commercial disputes, international arbitration, and regulatory investigations across all jurisdictions.', icon: 'gavel', order: 2, slug: 'litigation' },
  { title: 'Real Estate', description: 'Comprehensive advice on real estate investment, development, finance, and asset management for global institutional investors.', icon: 'apartment', order: 3, slug: 'real-estate' },
  { title: 'Banking & Finance', description: 'Deep expertise in structured finance, capital markets, and regulatory compliance for leading financial institutions.', icon: 'account_balance', order: 4, slug: 'banking-finance' },
  { title: 'Intellectual Property', description: 'Protecting global brands and innovation through strategic IP portfolio management, licensing, and enforcement.', icon: 'verified_user', order: 5, slug: 'intellectual-property' },
  { title: 'Employment & Incentives', description: 'Navigating global workforce challenges, executive compensation, and labor relations in an evolving regulatory landscape.', icon: 'groups', order: 6, slug: 'employment' },
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
  { category: 'Corporate Law', title: 'Navigating New Cross-Border Compliance Standards in 2024', excerpt: 'A comprehensive breakdown of the updated regulatory frameworks affecting multinational entities operating within the European and Asian markets.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSTZWpOnlpeFs3R2V7Cl1KtJeaF0Rdmm6K9yyKKVV3gQ7jkogwx7EkID51ae4zLrTvoMh4F3GE34IASwNsVvtwwroVg_4DAOsMksSGVOQB7QeAQPceMeLBWe8lSE1JQP3ZyWmh_ipzRdjKCHltvA5uOVI10JlhECfekJb3FeqQi8jPdYBAJtAm8xgB1PbiL5GUb7pj5wFgeH4du8BrA7oLvUCrNZS5f3OZgetDgwqjs8620GsNnjEyI8d22DxscQw2GqpLbRLOcg', imageAlt: 'Close up of classic law books in library', publishedAt: new Date('2024-05-14'), slug: 'cross-border-compliance-2024' },
  { category: 'Litigation', title: 'The Shift in Commercial Arbitration: What Firms Need to Know', excerpt: 'Examining the recent shift toward mediation-first clauses and the impact on long-term commercial litigation strategies for tech conglomerates.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75CtM-y7lhr1MTDFTIaUtSXKd7AmuP3aMtPeIHwH61odK83UpygrHuE3WPuqsdqwveJumygzdKd9Hq8hNsLr99qHd3Uw9M9e6fFSRtgj8NYrq5Yx6XbXCCRRKLnov_K49I0pi4OD2IamrLyJL8JopP_Dj_qgcno4fzJ4jxJtqjihRwWRVl5lDRc5Wa1szuog8h1KiHwmVsNRglh9N9peRwDd4ne-cls49STEmkIlOtkWSstye6tWJw18Qs-pYrCvG7-s8cKTtjw', imageAlt: 'Professional attorney reviewing legal documents carefully', publishedAt: new Date('2024-05-10'), slug: 'commercial-arbitration-shift' },
  { category: 'Intellectual Property', title: 'AI and Copyright: Protecting Digital Assets in the Age of Generative Tech', excerpt: 'Legal strategies for safeguarding proprietary datasets and artistic outputs as the courts redefine the boundaries of authorship.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBef7BCsTXEeVd4Koao90aicXtIlejWstDUogmOXxB-1DSw4YQQNKzRtDRu9csL9yB9o6uFiAW6f30bP649CRTk3btktkorGP0TuA-vNC3AhyoU0aTDrSoenDGEJc8AO8sx5n0B4gu-IubRTf0haZa_Eu4YtMckkeTl9yjr7mLuV5cqE6TX9Vlm2cvxAOYgHKslSCcZiQVpffLhsapG-Ev2ZKWm_CVzcFvlMmYTL5u0PJqdsZ4aI1HC84Qg3IouiCbCVQvJvdSGw', imageAlt: 'Focused shot of fountain pen signing official contract', publishedAt: new Date('2024-04-28'), slug: 'ai-copyright-digital-assets' },
  { category: 'Real Estate', title: 'Zoning Reforms and Their Impact on Urban Development Projects', excerpt: 'Understanding the implications of high-density zoning shifts for commercial real estate developers in major metropolitan centers.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtUpel5W0hOSiDu9q1G1y6AryWFbxlDLma0SEnbMYSxvuWovVE1uA8OBuLJRbt8el0hU_EPP3XNQUhIjjqR_ggXeH1G0YuWS_us5P-e-SoD_JbWHe_GhdrHAz-ZTgNwDWzuCFRgVxyWnTAQfqWNVvpVOX3WKpNP9gCn7G0qmgLtpw8ltKTOzudR_1JQrVaPi_wt_sbjRC-SKXmHyqGwdm7JbrowtS2oRI8TLkR4aFa74RiDNrG1bAuTkmPC21bUyb7XQgafmgU8g', imageAlt: 'Minimalist glass office tower reflecting the sky', publishedAt: new Date('2024-04-22'), slug: 'zoning-reforms-urban-development' },
  { category: 'Regulatory Affairs', title: 'ESG Reporting: Preparing for the 2025 Mandatory Disclosure Cycles', excerpt: 'A practical guide for C-suite executives on aligning corporate governance with new environmental transparency mandates.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05ngTaZX4EpN3cN_SweJ0M3QqCSb6dmGQPBV7MVNZaS5JmV6XS2JbG6-zojA52Ene-y-TTuejfqkfZLGUosyib_eXSw5AFf7gK_FvgheIGi_hZLvjrb6N81NcNnSiIojjHtUarTT1GwllyWOpq5Xrczxl-015wpbBmdHfncl5dBfmK-Jh-FbMCk1UB5W9kJ5hrc5sO8EzEAJQkqHGZGRCON_I8otzEe7YfpECXsLan-INsCtACC9QwRHyFgaKdcEueOswZgeX-Q', imageAlt: 'Stately stone columns of a financial institution', publishedAt: new Date('2024-04-15'), slug: 'esg-reporting-2025' },
  { category: 'Corporate Governance', title: 'Fiduciary Duties in the Era of Shareholder Activism', excerpt: 'Analyzing the evolving legal responsibilities of board members when facing high-pressure activist investor campaigns.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz20ugASvYOvSKmN6u9TYJp8Ed7lUrom5FYS2F6tnr7HW2E6Sxs4228Ld1dBOBASsgyJL8B1KVVkGSIxVHL5ybJ_wCOoSiqE8JgYhuDr4o_eB32UTdjHJZkqKzaBJX0F1DGyssthneWGGvopeCVvXqFfMGsm5lG-2Ga8vGQ8Z0PZR557rvxo2yO0GGM45n5nx8EBMGjSLjbmEqzRWL6nZo7LeHQ7tVSCHIBJYSrezBq08WL7egLKXwM_U3DElXxCtL6lUXASoqIg', imageAlt: 'Modern empty boardroom with wooden table and glass walls', publishedAt: new Date('2024-03-30'), slug: 'fiduciary-duties-shareholder-activism' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
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
