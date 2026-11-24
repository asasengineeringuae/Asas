'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Building2, CheckCircle2, ClipboardCheck, Layers3, Ruler, Sofa, Waypoints} from 'lucide-react';
import {ActionButton} from '@/components/ActionButton';
import {homeDisciplineImages} from '@/data/image-manifest';

const shortTitles = {
  'architectural-design': {en: 'Architecture', ar: 'العمارة'},
  'civil-structural-engineering': {en: 'Structural Engineering', ar: 'الهندسة الإنشائية'},
  'mep-engineering-design': {en: 'Electromechanical Engineering', ar: 'الهندسة الكهروميكانيكية'},
  'quantities-cost': {en: 'Quantity Surveying', ar: 'حصر الكميات'},
  'project-management': {en: 'Project Management', ar: 'إدارة المشاريع'},
  'infrastructure-urban-planning': {en: 'Infrastructure', ar: 'البنية التحتية'},
  'interior-design': {en: 'Interior Design', ar: 'التصميم الداخلي'},
};

const icons = {
  'architectural-design': Building2,
  'civil-structural-engineering': Ruler,
  'mep-engineering-design': Layers3,
  'quantities-cost': ClipboardCheck,
  'project-management': ClipboardCheck,
  'infrastructure-urban-planning': Waypoints,
  'interior-design': Sofa,
};

export default function ServicesTabs({locale, services}) {
  const ar = locale === 'ar';
  const disciplines = services.filter((service) => shortTitles[service.slug]);
  const [active, setActive] = useState(disciplines[0]?.slug);
  const current = disciplines.find((service) => service.slug === active) || disciplines[0];
  if (!current) return null;

  const Icon = icons[current.slug] || Building2;
  const points = (ar ? current.capabilitiesAr : current.capabilities).slice(0, 3);

  return (
    <section className="insp-services hp-disciplines" id="disciplines">
      <div className="home-shell">
        <div className="insp-center-head">
          <p className="atlas-kicker center">{ar ? 'تخصصاتنا' : 'Our disciplines'}</p>
          <h2>{ar ? 'تخصصات هندسية في مكتب واحد' : 'One consultancy, seven core disciplines'}</h2>
          <p>{ar
            ? 'تغطي أساس العمارة والهندسة الإنشائية والكهروميكانيكية وحصر الكميات وإدارة المشاريع والبنية التحتية والتصميم الداخلي ضمن عمل منسق.'
            : 'Architecture, structural engineering, electromechanical engineering, quantity surveying, project management, infrastructure and interior design checked together before issue.'}</p>
        </div>

        <div className="insp-tabs" role="tablist">
          {disciplines.map((service) => {
            const TabIcon = icons[service.slug] || Building2;
            return (
              <button
                key={service.slug}
                type="button"
                role="tab"
                aria-selected={active === service.slug}
                className={active === service.slug ? 'active' : ''}
                onClick={() => setActive(service.slug)}
              >
                <TabIcon size={16} />
                <span>{shortTitles[service.slug][ar ? 'ar' : 'en']}</span>
              </button>
            );
          })}
        </div>

        <div className="insp-tab-panel hp-card">
          <div className="insp-tab-media">
            {homeDisciplineImages[current.slug] ? (
              <Image src={homeDisciplineImages[current.slug]} alt="" width={900} height={700} />
            ) : null}
          </div>
          <div className="insp-tab-copy">
            <Icon className="insp-tab-icon" />
            <h3>{ar ? current.titleAr : current.title}</h3>
            <p>{ar ? current.descriptionAr : current.description}</p>
            <ul>
              {points.map((point) => (
                <li key={point}><CheckCircle2 size={18} /><span>{point}</span></li>
              ))}
            </ul>
            <ActionButton variant="outline" href={`/${locale}/services/${current.slug}`}>
              {ar ? 'تفاصيل الخدمة' : 'View this service'}
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
