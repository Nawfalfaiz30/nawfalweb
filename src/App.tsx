import { FormEvent, ReactNode, useEffect, useState } from "react";
import { featuredProject, siteConfig, socialLinks } from "./config/site";
import { getPost, publishedPosts, renderMarkdown } from "./lib/content";

type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "close"
  | "code"
  | "copy"
  | "download"
  | "external"
  | "github"
  | "instagram"
  | "linkedin"
  | "mail"
  | "menu"
  | "send"
  | "whatsapp";

const navItems = [
  ["Beranda", "/"],
  ["Tentang", "/tentang"],
  ["Proyek", "/proyek"],
  ["Blog", "/blog"],
  ["Novel", "/novel"],
  ["CV", "/cv"],
  ["Kontak", "/kontak"],
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    code: <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>,
    copy: <><rect width="13" height="13" x="9" y="9" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    external: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5.1 5.1 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5.1 5.1 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" /><path d="M8 19c-3 .9-3-1.5-4-2" /></>,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><path d="M2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-10 6L2 7" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    whatsapp: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-3.8-.9L3 21l1.8-5A9 9 0 1 1 21 11.5Z" /><path d="M8.6 8.2c.3-.7.7-.7 1-.7l.6 1.6c.1.3 0 .5-.2.7l-.5.6c.7 1.5 1.9 2.7 3.4 3.4l.6-.7c.2-.2.4-.3.7-.1l1.5.7c.3.1.3.4.3.7-.2 1.2-1.2 2-2.4 2-2.5 0-7-3.8-7-6.8 0-.5.2-1 .4-1.4" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Link({
  to,
  children,
  className = "",
  external = false,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  if (external) return <a className={className} href={to} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <a className={className} href={to} onClick={(event) => {
    onClick?.();
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}>{children}</a>;
}

function ButtonLink({ to, children, variant = "primary", external = false }: { to: string; children: ReactNode; variant?: "primary" | "secondary" | "text"; external?: boolean }) {
  return <Link to={to} external={external} className={`button button-${variant}`}>{children}</Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const path = window.location.pathname;
  useEffect(() => {
    if (!open) return;
    const priorOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    document.querySelector<HTMLElement>(".mobile-menu button, .mobile-menu a")?.focus();
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);
  return <header className="site-header">
    <div className="container header-inner">
      <Link to="/" className="wordmark" ><span className="wordmark-mark">N</span><span>Nawfal Ulinnuha Faiz</span></Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">
        {navItems.map(([label, href]) => <Link key={href} to={href} className={path === href ? "active" : ""}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <ButtonLink to="/kontak">Hubungi Saya <Icon name="arrow" size={17} /></ButtonLink>
      <button className="menu-button" aria-label="Buka menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Icon name="menu" /></button>
      </div>
    </div>
    {open && <div className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigasi utama">
      <div className="mobile-menu-top">
        <span className="wordmark"><span className="wordmark-mark">N</span><span>Menu</span></span>
        <button className="icon-button" aria-label="Tutup menu" onClick={() => setOpen(false)}><Icon name="close" /></button>
      </div>
      <nav>{navItems.map(([label, href], index) => <Link key={href} to={href} onClick={() => setOpen(false)} className={path === href ? "active" : ""}><span>0{index + 1}</span>{label}<Icon name="arrow" /></Link>)}</nav>
      <ButtonLink to="/sosial" variant="secondary">Buka Social Hub</ButtonLink>
    </div>}
  </header>;
}

function Footer() {
  return <footer>
    <div className="container footer-grid">
      <div className="footer-brand">
        <div className="wordmark"><span className="wordmark-mark">N</span><span>Nawfal Ulinnuha Faiz</span></div>
        <p>Ruang digital untuk profil, proyek, tulisan, dan kanal komunikasi resmi.</p>
        <span className="domain">{siteConfig.domain}</span>
      </div>
      <div><h3>Jelajahi</h3>{navItems.slice(1, 6).map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</div>
      <div><h3>Terhubung</h3>{socialLinks.slice(0, 4).map((item) => <Link key={item.name} to={item.href} external>{item.name}</Link>)}</div>
      <div><h3>Kontak</h3><a href={`mailto:${siteConfig.email}`} className="email">{siteConfig.email}</a><ButtonLink to="/kontak" variant="text">Kirim pesan <Icon name="arrow" size={17} /></ButtonLink></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Nawfal Ulinnuha Faiz.</span><Link to="/privasi">Kebijakan Privasi</Link></div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <><a className="skip-link" href="#main-content">Lewati ke konten utama</a><Header /><main id="main-content">{children}</main><Footer /></>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow"><span></span>{children}</div>;
}

function PageHero({ eyebrow, title, description, side }: { eyebrow: string; title: string; description: string; side?: ReactNode }) {
  return <section className="page-hero"><div className="container page-hero-grid"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="lead">{description}</p></div>{side && <div>{side}</div>}</div></section>;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

function SocialIcons() {
  return <div className="social-icons">{socialLinks.map((item) => <a key={item.name} href={item.href} target={item.kind === "email" ? undefined : "_blank"} rel={item.kind === "email" ? undefined : "noopener noreferrer"} aria-label={item.name}><Icon name={item.icon} /></a>)}</div>;
}

function ProjectCard({ project }: { project: { title: string; summary: string; tags: string[]; href?: string; number?: string; detailTo?: string } }) {
  return <article className="project-card">
    <div className="project-visual visual-1"><img src="/images/project-counting-device.jpg" alt="Perangkat penghitung pemilih berbasis ESP32 dengan layar LCD" /><span>Perangkat uji · Buku PA</span></div>
    <div className="card-content">
      <div className="meta"><span>Proyek akhir · PENS</span><span>{project.number ?? "01"}</span></div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <ButtonLink to={project.detailTo ?? `/proyek/${featuredProject.slug}`} variant="text">Baca studi kasus <Icon name="arrow" size={17} /></ButtonLink>
      {project.href && <a className="button button-text" href={project.href} target="_blank" rel="noopener noreferrer">Lihat di GitHub <Icon name="arrow" size={17} /></a>}
    </div>
  </article>;
}

function ArticleEmpty() {
  return <div className="empty-note"><Icon name="copy" /><div><strong>Belum ada tulisan yang dipublikasikan.</strong><span>Artikel akan muncul di sini setelah siap dibagikan.</span></div></div>;
}

function PostCard({ post }: { post: (typeof publishedPosts)[number] }) {
  return <article className="article-card"><div className="article-content"><div className="meta"><span>{post.tags.join(" · ") || "Artikel"}</span><span>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(`${post.date}T00:00:00`))}</span></div><h3>{post.title}</h3><p>{post.description}</p><div className="article-foot"><ButtonLink to={`/blog/${post.slug}`} variant="text">Baca artikel <Icon name="arrow" size={17} /></ButtonLink></div></div></article>;
}

function Home() {
  return <Shell>
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Eyebrow>Elektronika · Embedded · Web</Eyebrow>
          <h1>Halo, saya Nawfal <em>Ulinnuha Faiz.</em></h1>
          <p>Lulusan D3 Teknik Elektronika PENS yang senang merangkai solusi dari perangkat, perangkat lunak, dan cerita. Proyek akhir saya mengolah data Kertas C Plano; novel <em>Hujan dan Payung Biru</em> terbit pada 2025.</p>
          <div className="button-row"><ButtonLink to="/proyek">Jelajahi Proyek <Icon name="arrow" size={18} /></ButtonLink><ButtonLink to="/cv" variant="secondary">Lihat CV</ButtonLink></div>
          <div className="hero-social"><span>Terhubung melalui</span><SocialIcons /></div>
        </div>
        <div className="hero-art">
          <img src="/images/portfolio-workspace.jpg" alt="Ilustrasi meja kerja dengan mikrokontroler, laptop, formulir, dan buku catatan" />
          <span className="hero-art-label">Elektronika <i>×</i> Cerita</span>
        </div>
      </div>
    </section>
    <section className="intro-strip"><div className="container intro-grid"><span>01 — Tentang</span><h2>Sebuah ruang untuk memperkenalkan diri melalui karya dan pemikiran.</h2><div><p>Website ini dirancang sebagai rumah digital yang merangkum perjalanan, eksplorasi, serta kanal komunikasi resmi dalam satu tempat.</p><ButtonLink to="/tentang" variant="text">Kenali Saya <Icon name="arrow" size={17} /></ButtonLink></div></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="Karya terpilih" title="Teknologi untuk data pemilu." description="Proyek akhir D3 yang menggabungkan perangkat embedded, pengolahan citra, dan AI vision." action={<ButtonLink to="/proyek" variant="secondary">Semua proyek <Icon name="arrow" size={17} /></ButtonLink>} /><div className="project-grid"><ProjectCard project={featuredProject} /></div></div></section>
    <section className="section section-muted"><div className="container"><SectionHeading eyebrow="Jurnal" title="Tulisan & catatan." description="Catatan teknis, proses belajar, dan hal-hal yang saya temui saat membangun sebuah sistem." />{publishedPosts.length ? <div className="blog-grid">{publishedPosts.slice(0, 2).map((post) => <PostCard key={post.slug} post={post} />)}</div> : <ArticleEmpty />}<div className="center-action"><ButtonLink to="/blog" variant="secondary">Lihat Blog <Icon name="arrow" size={17} /></ButtonLink></div></div></section>
    <section className="section"><div className="container novel-card"><div className="book-cover"><span>Novel · 2025</span><strong>Hujan dan Payung Biru</strong><small>Nawfal Ulinnuha Faiz · Beranda</small></div><div className="novel-copy"><Eyebrow>Karya sastra</Eyebrow><h2>Saya juga menulis cerita.</h2><p><em>Hujan dan Payung Biru</em> adalah novel perdana saya, diterbitkan oleh Beranda pada 2025. Saya juga pernah menulis cerita untuk JanakaPens Komik.</p><a className="button button-primary" href="https://store.intranspublishing.com/hujan-dan-payung-biru/" target="_blank" rel="noopener noreferrer">Lihat detail buku <Icon name="external" size={17} /></a></div></div></section>
    <ContactBand />
  </Shell>;
}

function ContactBand() {
  return <section className="contact-band"><div className="container contact-band-inner"><div><Eyebrow>Mari terhubung</Eyebrow><h2>Punya ide atau ingin <em>berkolaborasi?</em></h2></div><div><p>Saya terbuka untuk percakapan, pertukaran ide, dan peluang kolaborasi yang relevan.</p><div className="button-row"><ButtonLink to="/kontak">Mulai percakapan <Icon name="arrow" size={18} /></ButtonLink><ButtonLink to="https://wa.me/6281227504772" variant="secondary" external><Icon name="whatsapp" size={18} /> WhatsApp</ButtonLink></div></div></div></section>;
}

function About() {
  return <Shell><PageHero eyebrow="Profil" title="Tentang Saya" description="Saya Nawfal Ulinnuha Faiz, lulusan D3 Teknik Elektronika dari Politeknik Elektronika Negeri Surabaya. Saya tertarik pada pekerjaan yang mempertemukan perangkat, perangkat lunak, dan kebutuhan nyata." side={<div className="page-number">01 <span>/ 06</span></div>} />
    <section className="section"><div className="container editorial-grid"><div className="portrait-frame"><img src="/images/nawfal-portrait.jpg" alt="Nawfal Ulinnuha Faiz mengenakan jas dan dasi" /><span>Gunung Putri, Bogor</span></div><div className="prose-intro"><Eyebrow>Perkenalan</Eyebrow><h2>Membangun, belajar, dan bercerita.</h2><p>Saya menempuh pendidikan D3 Teknik Elektronika di PENS pada 2022–2025. Di sana saya banyak belajar menghubungkan dasar elektronika, sistem terbenam, pemrograman, dan pengujian. Saya menikmati proses mencari tahu mengapa sebuah sistem bekerja—atau gagal—lalu memperbaikinya dengan langkah yang terukur.</p><p>Proyek akhir saya menggabungkan tombol penghitung pemilih berbasis ESP32 dengan pembacaan angka dari Kertas C Plano menggunakan Tesseract OCR dan GPT-4o Vision API. Hasilnya mempertemukan pekerjaan hardware, aplikasi web, pengolahan citra, dan validasi data dalam satu alur.</p><p>Pengalaman magang memperkenalkan saya pada disiplin kerja dan keselamatan: dari pemeriksaan mutu produk di lingkungan manufaktur hingga pemeliharaan serta pengukuran sistem kelistrikan kereta. Saya juga pernah menjadi wakil ketua ekstrakurikuler komputer, mengajar dasar elektronika sebagai relawan, dan berbagi pengalaman menulis sebagai pembicara.</p><p>Di sisi kreatif, saya menulis cerita untuk JanakaPens Komik dan menerbitkan novel <em>Hujan dan Payung Biru</em> bersama Penerbit Beranda pada 2025. Bagi saya, teknik dan menulis sama-sama membutuhkan rasa ingin tahu, ketelitian, dan kemampuan memahami orang yang akan membaca atau menggunakan hasilnya.</p><div className="interest-grid">{[["01", "Elektronika", "ESP32, Arduino, PLC Omron, pengukuran, dan troubleshooting."], ["02", "Software", "Python, JavaScript, Node.js, PHP, C++, dan MySQL."], ["03", "Kreatif", "Penulisan cerita, kolaborasi komik, dan komunikasi."], ["04", "Cara kerja", "Belajar cepat, memecahkan masalah, dokumentasi, dan kerja tim."]].map(([number, title, description]) => <div key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div><div className="button-row"><ButtonLink to="/proyek">Lihat Proyek <Icon name="arrow" size={18} /></ButtonLink><ButtonLink to="/cv" variant="secondary">Lihat CV</ButtonLink></div></div></div></section>
  </Shell>;
}

type GithubRepo = { id: number; name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; updated_at: string };
type GithubPayload = { profile: { name: string | null; bio: string | null; public_repos: number; followers: number }; repos: GithubRepo[] };
function Projects() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [profile, setProfile] = useState<GithubPayload["profile"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    fetch("/api/github")
      .then((response) => { if (!response.ok) throw new Error("GitHub tidak tersedia"); return response.json(); })
      .then((data: GithubPayload) => { setRepos(Array.isArray(data.repos) ? data.repos : []); setProfile(data.profile ?? null); })
      .catch(() => setUnavailable(true))
      .finally(() => setLoading(false));
  }, []);
  return <Shell><PageHero eyebrow="Portfolio" title="Proyek & Eksplorasi" description="Proyek akhir kuliah serta repositori publik di GitHub." />
    <section className="section no-top"><div className="container"><SectionHeading eyebrow="Proyek terpilih" title="Tabulasi Suara Kertas Plano Pemilu" description={featuredProject.summary} /><div className="project-grid"><ProjectCard project={featuredProject} /></div><div className="github-section"><div className="github-heading"><div><Eyebrow>GitHub</Eyebrow><h2>Repositori publik</h2></div><a href={`https://github.com/${siteConfig.githubUsername}`} target="_blank" rel="noopener noreferrer">Lihat profil <Icon name="arrow" size={17} /></a></div>{loading ? <p className="muted-copy" aria-live="polite">Memuat profil dan repositori publik…</p> : profile && <div className="github-profile"><strong>{profile.name || siteConfig.githubUsername}</strong>{profile.bio && <p>{profile.bio}</p>}<span>{profile.public_repos} repositori publik · {profile.followers} pengikut</span></div>}{!loading && repos.length ? <div className="repo-grid">{repos.map((repo) => <article className="repo-card" key={repo.id}><div className="repo-top"><Icon name="code" /><span>{repo.language ?? "Repositori"}</span></div><h3><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h3><p>{repo.description || "Repositori publik dari GitHub."}</p><div className="repo-meta"><span>★ {repo.stargazers_count}</span><span>Diperbarui {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(repo.updated_at))}</span></div></article>)}</div> : !loading && <div className="empty-note"><Icon name="github" /><div><strong>{unavailable ? "Repositori belum dapat dimuat." : "Belum ada repositori publik."}</strong><span>{unavailable ? "Silakan kunjungi profil GitHub untuk melihat repositori terbaru." : "Repositori akan tampil di sini bila tersedia."}</span></div></div>}</div></div></section>
  </Shell>;
}

function ProjectDetail() {
  return <Shell><section className="detail-hero"><div className="container"><Breadcrumb items={[["Proyek", "/proyek"], ["Proyek akhir", ""]]} /><span className="content-label">Proyek Akhir · D3 Teknik Elektronika · 2025</span><h1>{featuredProject.title}</h1><p>{featuredProject.summary}</p><div className="tags">{featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><figure className="detail-cover project-cover"><img src="/images/project-counting-device.jpg" alt="Perangkat penghitung pemilih yang diuji, menggunakan ESP32 dan LCD" /><figcaption>Perangkat counting pemilih yang dikembangkan dan diuji · Dokumentasi buku PA</figcaption></figure></div></section>
    <section className="section"><div className="container case-grid"><aside><span>Ringkasan proyek</span>{["Tujuan", "Alur sistem", "Hasil uji", "Batasan"].map((x, i) => <a key={x} href={`#${["tujuan", "alur-sistem", "hasil-uji", "batasan"][i]}`}>0{i + 1} {x}</a>)}</aside><div className="reading-column"><section id="tujuan"><Eyebrow>Tujuan</Eyebrow><h2>Mencocokkan pencatatan kehadiran dengan pembacaan formulir.</h2><p>Sistem dirancang untuk membantu tabulasi suara melalui dua sumber data: jumlah pemilih yang dicatat petugas dengan tombol counting, dan angka pada gambar Kertas C Plano. Gagasan utamanya adalah membuat proses pencatatan lebih terstruktur serta memberi penanda ketika jumlahnya tidak konsisten.</p></section><section id="alur-sistem"><Eyebrow>Alur sistem</Eyebrow><h2>Dari tombol dan foto menuju data yang dapat diperiksa.</h2><p>Tombol biru menambah hitungan pemilih dan tombol merah mengoreksi hitungan. ESP32 menampilkan jumlah pada LCD dan mengirim data JSON melalui Wi-Fi. Pada alur web, gambar Kertas C Plano diproses dengan Tesseract OCR dan GPT-4o Vision API; hasil ekstraksinya kemudian dibandingkan dengan data counting dan disimpan untuk rekapitulasi wilayah.</p><div className="process-steps"><div><span>01</span><strong>Catat</strong><small>Tombol + LCD · ESP32</small></div><div><span>02</span><strong>Ekstrak</strong><small>Foto formulir · OCR / Vision</small></div><div><span>03</span><strong>Validasi</strong><small>Bandingkan jumlah · tandai selisih</small></div></div></section><section id="hasil-uji"><Eyebrow>Hasil pengujian</Eyebrow><h2>Angka dari pengujian proyek akhir.</h2><p>Dalam pengujian yang dilaporkan pada buku PA, pengolahan citra memperoleh akurasi rata-rata 96,25%. Kesesuaian antara data counting dan hasil image processing tercatat 100% pada pengujian ketika selisih berada dalam ambang ≤5%.</p><div className="metric-grid"><div><strong>96,25%</strong><span>Akurasi rata-rata pembacaan pada pengujian</span></div><div><strong>100%</strong><span>Kesesuaian counting ↔ image processing dalam toleransi ≤5%</span></div><div><strong>ESP32</strong><span>Penghitung pemilih dengan input tombol dan LCD</span></div></div><p className="source-note">Sumber: abstrak dan kesimpulan buku PA (2025). Angka ini adalah hasil uji yang dilaporkan, bukan jaminan akurasi untuk pemakaian lapangan.</p></section><section id="batasan"><Eyebrow>Batasan dan pengembangan</Eyebrow><h2>Kualitas gambar tetap berpengaruh.</h2><p>Buku PA mencatat pembacaan dipengaruhi oleh ketajaman dan fokus gambar; Tesseract memiliki keterbatasan pada citra buram atau kompleks. Pengujian dilaporkan dalam skenario simulasi. Rekomendasi pengembangan meliputi koreksi perspektif, perbaikan pra-pemrosesan, antarmuka yang lebih ramah pengguna, serta penguatan keamanan web.</p></section><ButtonLink to="/proyek" variant="secondary">← Kembali ke daftar proyek</ButtonLink></div></div></section>
  </Shell>;
}

function Blog() {
  const [search, setSearch] = useState("");
  const posts = publishedPosts.filter((post) => `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  return <Shell><PageHero eyebrow="Jurnal pribadi" title="Tulisan & Catatan" description="Catatan tentang teknologi, proses belajar, dan penulisan akan diterbitkan di sini." />
    <section className="section no-top"><div className="container">{publishedPosts.length > 0 && <div className="blog-toolbar"><div><strong>{posts.length} tulisan</strong><span>Markdown · diurutkan terbaru</span></div><label className="search"><span className="sr-only">Cari artikel</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari artikel..." /></label></div>}{posts.length ? <div className="blog-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : publishedPosts.length ? <div className="empty-note"><Icon name="copy" /><div><strong>Tulisan tidak ditemukan.</strong><span>Coba kata kunci yang berbeda.</span></div></div> : <ArticleEmpty />}<div className="center-action"><ButtonLink to="/kontak" variant="secondary">Hubungi Saya <Icon name="arrow" size={17} /></ButtonLink></div></div></section>
  </Shell>;
}

function Breadcrumb({ items }: { items: string[][] }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Beranda</Link>{items.map(([label, href]) => <span key={label}><Icon name="chevron" size={14} />{href ? <Link to={href}>{label}</Link> : <strong>{label}</strong>}</span>)}</nav>;
}

function ArticleDetail() {
  const [copied, setCopied] = useState(false);
  const slug = window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
  const post = getPost(slug);
  if (!post) return <NotFound />;
  const blocks = renderMarkdown(post.body);
  return <Shell><article className="article-page"><div className="container"><Breadcrumb items={[["Blog", "/blog"], [post.title, ""]]} /><div className="article-head"><span className="content-label">{post.tags.join(" · ") || "Artikel"} · {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(`${post.date}T00:00:00`))}</span><h1>{post.title}</h1><p>{post.description}</p><div className="article-author"><div className="avatar">N</div><div><strong>{siteConfig.name}</strong><span>Penulis</span></div></div></div><div className="article-layout article-layout-single"><div className="article-body">{blocks.map((block, index) => block.type === "ul" ? <ul key={index}>{block.text.split("\n").map((item) => <li key={item}>{item}</li>)}</ul> : block.type === "pre" ? <pre key={index}><code>{block.text}</code></pre> : block.type === "h1" || block.type === "h2" ? <h2 key={index}>{block.text}</h2> : block.type === "h3" ? <h3 key={index}>{block.text}</h3> : <p key={index}>{block.text}</p>)}<div className="share-row"><span>Bagikan artikel</span><button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); } catch { setCopied(false); } }}><Icon name={copied ? "check" : "copy"} />{copied ? "Tautan disalin" : "Salin tautan"}</button></div></div></div><div className="center-action"><ButtonLink to="/blog" variant="secondary">← Kembali ke blog</ButtonLink></div></div></article></Shell>;
}

function Novel() {
  return <Shell><PageHero eyebrow="Karya sastra" title="Hujan dan Payung Biru" description="Novel karya Nawfal Ulinnuha Faiz, diterbitkan oleh Beranda pada 2025." />
    <section className="section no-top"><div className="container novel-page-grid"><div className="book-cover large" aria-label="Visualisasi editorial untuk novel Hujan dan Payung Biru"><span>Novel · Penerbit Beranda</span><strong>Hujan dan Payung Biru</strong><small>Visualisasi editorial · Nawfal Ulinnuha Faiz</small></div><div><span className="status-pill">Novel · 2025</span><h2>Sebuah cerita dalam 190 halaman.</h2><p>Saya menulis novel <em>Hujan dan Payung Biru</em>. Saya juga pernah mengembangkan ide cerita dan berkontribusi dalam pembuatan komik digital bersama JanakaPens Komik. Sinopsis belum dicantumkan di halaman toko, jadi saya belum menambahkan ringkasan cerita agar informasi tetap akurat.</p><dl><div><dt>Penulis</dt><dd>Nawfal Ulinnuha Faiz</dd></div><div><dt>Penerbit</dt><dd>Beranda</dd></div><div><dt>Tahun</dt><dd>2025</dd></div><div><dt>ISBN</dt><dd>978-623-5453-49-1</dd></div><div><dt>Format</dt><dd>14 × 21 cm · vi + 190 halaman</dd></div></dl><div className="button-row"><a className="button button-primary" href="https://store.intranspublishing.com/hujan-dan-payung-biru/" target="_blank" rel="noopener noreferrer">Kunjungi toko penerbit <Icon name="external" size={17} /></a><a className="button button-secondary" href="https://tirtabuanamedia.co.id/shop/buku-fiksi-dan-sastra/novel/hujan-dan-payung-biru/" target="_blank" rel="noopener noreferrer">Lihat data buku <Icon name="external" size={17} /></a></div><p className="source-note">Visual sampul di halaman ini adalah ilustrasi editorial, bukan reproduksi sampul resmi.</p></div></div></section>
  </Shell>;
}

function CV() {
  return <Shell><PageHero eyebrow="Profil profesional" title="Curriculum Vitae" description="Lulusan D3 Teknik Elektronika dengan pengalaman embedded, pemeliharaan kelistrikan, quality control, dan penulisan cerita." side={<div className="cv-actions"><a className="button button-primary" href="/cv/nawfal-ulinnuha-faiz-cv.pdf" download><Icon name="download" size={18} /> Unduh CV PDF</a><ButtonLink to="/kontak" variant="secondary">Hubungi Saya</ButtonLink><small>Gunung Putri, Bogor · {siteConfig.email}</small></div>} />
    <section className="section no-top"><div className="container cv-layout"><aside><div className="avatar large"><img src="/images/nawfal-portrait.jpg" alt="" /></div><h3>Nawfal Ulinnuha Faiz</h3><p>Lulusan D3 Teknik Elektronika yang tertarik pada pengembangan teknologi berbasis integrasi hardware dan software.</p><h4>Keterampilan teknis</h4><div className="tags">{["PLC Omron", "Arduino", "ESP32", "Troubleshooting elektronika", "Alat ukur listrik", "PHP", "Node.js", "Python", "C++", "JavaScript", "MySQL", "AutoCAD", "Eagle", "Microsoft Office"].map((skill) => <span key={skill}>{skill}</span>)}</div><h4>Kemampuan</h4><div className="tags">{["Berpikir kritis", "Penyelesaian masalah", "Kerja sama tim", "Komunikasi"].map((skill) => <span key={skill}>{skill}</span>)}</div><p><a href={`https://github.com/${siteConfig.githubUsername}`} target="_blank" rel="noopener noreferrer">GitHub ↗</a></p></aside><div className="cv-content"><section><div className="cv-title"><span>01</span><h2>Pengalaman</h2></div><div className="timeline-entry"><div><strong>Operator Packing & Jiggering (Magang)</strong><span>PT. Haeng Nam Sejahtera Indonesia · Bogor</span><small>Januari 2026 – April 2026</small></div><p>Quality control produk, identifikasi produk cacat, pengemasan, finishing, dan pemeriksaan deformasi serta dimensi.</p></div><div className="timeline-entry"><div><strong>Teknisi Kelistrikan Kereta (Magang)</strong><span>PT Kereta Api Indonesia DAOP 8 · Surabaya</span><small>Juli 2024 – Desember 2024</small></div><p>Pemeliharaan sistem kelistrikan kereta, pengukuran parameter listrik, pemasangan komponen, dan dokumentasi sesuai prosedur K3.</p></div></section><section><div className="cv-title"><span>02</span><h2>Pendidikan</h2></div><div className="timeline-entry"><div><strong>Politeknik Elektronika Negeri Surabaya</strong><span>D3 Teknik Elektronika · IPK 3,55/4,00</span><small>Juli 2022 – Juli 2025</small></div><p>Proyek akhir: sistem tabulasi suara kertas plano menggunakan image processing pada ESP32 dan GPT-4o Vision API.</p></div></section><section><div className="cv-title"><span>03</span><h2>Kegiatan</h2></div><div className="timeline-entry"><div><strong>Penulis Cerita · JanakaPens Komik</strong><small>April 2024 – Juni 2025</small></div><p>Mengembangkan ide cerita dan berkontribusi dalam pembuatan komik digital. <a href="https://www.instagram.com/janaka.studio" target="_blank" rel="noopener noreferrer">Janaka Studio di Instagram ↗</a></p></div><div className="timeline-entry"><div><strong>Wakil Ketua Ekstrakurikuler Komputer · SMAN 1 Pangkah</strong><small>2020 – 2021</small></div><p>Mengelola kegiatan klub dan berkontribusi dalam pengembangan kemampuan anggota di bidang komputer.</p></div><div className="timeline-entry"><div><strong>Relawan · Gerakan Elka Mengajar</strong></div><p>Mengajar dasar elektronika kepada siswa sekolah dasar sebagai bagian dari pengabdian masyarakat.</p></div><div className="timeline-entry"><div><strong>Pembicara · Kegiatan Study Banding, SMA Hang Tuah 1 Surabaya</strong></div><p>Membawakan materi dan berbagi pengalaman tentang penulisan cerita.</p></div></section><section><div className="cv-title"><span>04</span><h2>Sertifikasi</h2></div><div className="timeline-entry"><div><strong>Sertifikat Kompetensi Pengoperasian Alat Ukur · BNSP</strong><small>November 2024 – November 2027</small></div></div><div className="timeline-entry"><div><strong>Pens English Proficiency Test · Skor 450</strong><small>Juni 2025 – Juni 2027</small></div></div></section></div></div></section>
  </Shell>;
}

type FormState = "default" | "loading" | "success" | "error";
function Contact() {
  const [state, setState] = useState<FormState>("default");
  const [message, setMessage] = useState("");
  const [fallbackMailto, setFallbackMailto] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setState("loading"); setMessage("");
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const subject = String(values.subject || "Pesan dari website");
    const body = `Nama: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
    setFallbackMailto(`mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Pesan belum berhasil dikirim. Silakan coba kembali.");
      setState("success"); form.reset(); setFallbackMailto("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Terjadi kendala. Lanjutkan melalui email langsung."); setState("error"); }
  };
  return <Shell><PageHero eyebrow="Kontak" title="Mari Terhubung" description="Punya pertanyaan, ide, atau peluang kolaborasi? Pilih kanal yang paling nyaman atau kirim pesan melalui formulir." />
    <section className="section no-top"><div className="container contact-grid"><div className="contact-info"><h2>Mari mulai percakapan.</h2><p>Saya akan berusaha merespons pesan yang jelas dan relevan secepatnya.</p><a className="contact-email" href={`mailto:${siteConfig.email}`}><Icon name="mail" /><span>Email<small>{siteConfig.email}</small></span><Icon name="external" /></a><ButtonLink to={socialLinks[0].href} external><Icon name="whatsapp" /> Hubungi via WhatsApp</ButtonLink><div className="contact-social">{socialLinks.filter((item) => item.kind === "profile").map((item) => <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"><Icon name={item.icon} />{item.name}<Icon name="external" size={16} /></a>)}</div></div>
      <form className="contact-form" onSubmit={submit}><div className="form-head"><span>Formulir pesan</span><span>Semua field bertanda * wajib diisi</span></div>{state === "success" ? <div className="form-result success" role="status"><div><Icon name="check" size={28} /></div><h2>Pesan berhasil dikirim.</h2><p>Terima kasih telah menghubungi saya. Pesan Anda sudah diteruskan.</p><button type="button" className="button button-secondary" onClick={() => { setState("default"); setMessage(""); }}>Kirim pesan lain</button></div> : <><div className="field-row"><label htmlFor="contact-name">Nama lengkap *<input id="contact-name" name="name" required maxLength={100} autoComplete="name" placeholder="Masukkan nama Anda" /></label><label htmlFor="contact-email">Email *<input id="contact-email" name="email" required type="email" maxLength={254} autoComplete="email" placeholder="nama@email.com" /></label></div><label htmlFor="contact-subject">Subjek<input id="contact-subject" name="subject" maxLength={150} placeholder="Apa yang ingin dibicarakan?" /></label><label htmlFor="contact-message">Pesan *<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="Ceritakan kebutuhan atau ide Anda..." /></label><label className="honeypot" aria-hidden="true">Jangan isi<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="checkbox"><input name="consent" type="checkbox" required /><span>Saya setuju data digunakan untuk merespons pesan ini. * <Link to="/privasi">Kebijakan Privasi</Link></span></label>{state === "error" && <div className="alert error" role="alert"><p>{message}</p><p>Pesan Anda belum terkirim melalui formulir. Anda dapat meneruskannya melalui email, atau menghubungi lewat WhatsApp.</p><div className="button-row"><a className="button button-secondary" href={fallbackMailto}>Lanjutkan lewat email <Icon name="mail" size={17} /></a><a className="button button-text" href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer">Buka WhatsApp <Icon name="external" size={16} /></a></div></div>}<button type="submit" className="button button-primary submit" aria-live="polite" disabled={state === "loading"}>{state === "loading" ? <><span className="spinner"></span>Mengirim...</> : <>Kirim Pesan <Icon name="send" size={18} /></>}</button></>}</form>
    </div></section>
  </Shell>;
}

function SocialHub() {
  return <Shell><PageHero eyebrow="Kanal resmi" title="Social Hub" description="Temukan dan hubungi saya melalui kanal resmi berikut." />
    <section className="section no-top"><div className="container social-hub-grid"><aside className="profile-card"><div className="profile-monogram">NUF</div><h2>Nawfal Ulinnuha Faiz</h2><p>Personal Website & Social Hub</p><span>{siteConfig.domain}</span><div className="verified"><Icon name="check" size={15} /> Kanal yang dicantumkan</div></aside><div className="channel-list">{socialLinks.map((item) => <a key={item.name} href={item.href} target={item.kind === "email" ? undefined : "_blank"} rel={item.kind === "email" ? undefined : "noopener noreferrer"} className="channel-card"><span className="channel-icon"><Icon name={item.icon} /></span><span><strong>{item.name}</strong><small>{item.description}</small>{item.name === "GitHub" && <em>Lihat proyek di GitHub</em>}</span><Icon name="external" /></a>)}</div></div></section><ContactBand />
  </Shell>;
}

function Privacy() {
  return <Shell><PageHero eyebrow="Informasi legal" title="Kebijakan Privasi" description="Informasi tentang data yang diproses saat Anda menggunakan formulir kontak atau membuka tautan pihak ketiga." />
    <section className="section no-top"><div className="container legal-layout"><aside><strong>Terakhir diperbarui</strong><span>15 Oktober 2026</span></aside><article><section><span>01</span><h2>Data formulir kontak</h2><p>Jika Anda mengirim formulir, nama, alamat email, subjek (jika diisi), dan isi pesan digunakan untuk menerima dan membalas permintaan Anda. Jangan kirim informasi sensitif melalui formulir ini.</p></section><section><span>02</span><h2>Penerima dan pengiriman</h2><p>Pesan diteruskan melalui Resend, penyedia email transaksional yang dikonfigurasi untuk situs ini, kepada Nawfal Ulinnuha Faiz. Isi pesan tidak disimpan dalam basis data situs ini. Resend dapat memproses data sesuai kebijakan privasinya.</p></section><section><span>03</span><h2>GitHub dan tautan eksternal</h2><p>Halaman proyek dapat meminta data repositori publik dari GitHub. Tautan ke WhatsApp, Instagram, LinkedIn, GitHub, dan layanan lain akan membawa Anda ke situs pihak ketiga yang memiliki kebijakan masing-masing.</p></section><section><span>04</span><h2>Cookie, analitik, dan retensi</h2><p>Situs ini tidak memasang analitik atau cookie pelacakan. Pesan dikirim ke email tujuan dan dapat disimpan dalam sistem email penerima sesuai pengaturannya. Untuk permintaan terkait pesan Anda, hubungi <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p></section><section><span>05</span><h2>Keamanan</h2><p>Data formulir divalidasi sebelum dikirim dan koneksi situs menggunakan HTTPS pada lingkungan produksi. Mohon jangan mengirim data rahasia atau informasi pribadi yang tidak diperlukan.</p></section></article></div></section>
  </Shell>;
}

function NotFound() {
  return <Shell><section className="not-found"><div className="container"><span className="giant-404">404</span><Eyebrow>Halaman tidak ditemukan</Eyebrow><h1>Sepertinya Anda mengambil jalan yang berbeda.</h1><p>Halaman yang dicari mungkin telah dipindahkan atau tidak tersedia.</p><div className="button-row"><ButtonLink to="/">Kembali ke Beranda <Icon name="arrow" size={18} /></ButtonLink><ButtonLink to="/blog" variant="secondary">Baca Blog</ButtonLink><ButtonLink to="/proyek" variant="text">Lihat Proyek</ButtonLink></div></div></section></Shell>;
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  useEffect(() => {
    const page = path.startsWith("/blog/") ? "Blog" : path.startsWith("/proyek/") ? "Proyek" : ({ "/": "Beranda", "/tentang": "Tentang Saya", "/proyek": "Proyek", "/blog": "Blog", "/novel": "Karya & Novel", "/cv": "CV", "/kontak": "Kontak", "/sosial": "Social Hub", "/privasi": "Kebijakan Privasi" } as Record<string, string>)[path] ?? "Halaman tidak ditemukan";
    const article = path.startsWith("/blog/") ? getPost(path.split("/").filter(Boolean).at(-1) ?? "") : undefined;
    const title = `${article?.title ?? page} — ${siteConfig.name}`;
    const descriptions: Record<string, string> = { "/": "Profil, proyek, CV, tulisan, dan kanal komunikasi Nawfal Ulinnuha Faiz.", "/tentang": "Profil dan perjalanan Nawfal Ulinnuha Faiz, lulusan D3 Teknik Elektronika PENS.", "/proyek": "Proyek akhir Teknik Elektronika dan repositori publik Nawfal Ulinnuha Faiz.", "/blog": "Tulisan dan catatan Nawfal Ulinnuha Faiz tentang teknologi, belajar, dan penulisan.", "/novel": "Pengalaman menulis cerita dan karya sastra Nawfal Ulinnuha Faiz.", "/cv": "Curriculum Vitae Nawfal Ulinnuha Faiz, lulusan D3 Teknik Elektronika.", "/kontak": "Hubungi Nawfal Ulinnuha Faiz melalui email, WhatsApp, atau formulir kontak.", "/sosial": "Kanal komunikasi Nawfal Ulinnuha Faiz.", "/privasi": "Kebijakan privasi situs Nawfal Ulinnuha Faiz." };
    const description = article?.description ?? descriptions[path] ?? `Informasi dari ${siteConfig.name}.`;
    const canonical = `${siteConfig.url}${path === "/" ? "/" : path}`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  }, [path]);
  if (path === "/") return <Home />;
  if (path === "/tentang") return <About />;
  if (path === "/proyek") return <Projects />;
  if (path === `/proyek/${featuredProject.slug}`) return <ProjectDetail />;
  if (path.startsWith("/proyek/")) return <NotFound />;
  if (path === "/blog") return <Blog />;
  if (path.startsWith("/blog/")) return <ArticleDetail />;
  if (path === "/novel") return <Novel />;
  if (path === "/cv") return <CV />;
  if (path === "/kontak") return <Contact />;
  if (path === "/sosial") return <SocialHub />;
  if (path === "/privasi") return <Privacy />;
  return <NotFound />;
}

export default App;

