import React from 'react';
import { BookOpen, Bookmark, Code2, ExternalLink, FileText, GraduationCap, Link2, Play, Sprout } from 'lucide-react';
import { usePulse } from '../context/PulseContext';

const resourceKinds = [
  { title: 'Class notes', detail: 'Find clear explanations and lecture notes.', icon: FileText, link: (subject: string) => `https://scholar.google.com/scholar?q=${encodeURIComponent(`${subject} lecture notes`)}`, tone: 'sage' },
  { title: 'Video lectures', detail: 'Learn at your pace with guided lessons.', icon: Play, link: () => 'https://nptel.ac.in/courses', tone: 'rose' },
  { title: 'Previous papers', detail: 'Practice with questions and past exams.', icon: BookOpen, link: (subject: string) => `https://www.google.com/search?q=${encodeURIComponent(`${subject} previous year question papers`)}`, tone: 'lilac' },
  { title: 'Syllabus', detail: 'Keep the topics and course outline close.', icon: GraduationCap, link: (subject: string) => `https://www.google.com/search?q=${encodeURIComponent(`${subject} syllabus`)}`, tone: 'sand' },
  { title: 'Useful links', detail: 'Open trusted learning and reference tools.', icon: Link2, link: () => 'https://www.geeksforgeeks.org/', tone: 'mint' },
  { title: 'Cheat sheets', detail: 'Quick references for your next study block.', icon: Code2, link: () => 'https://devdocs.io/', tone: 'blue' },
];

export const ResourcesView: React.FC = () => {
  const { state } = usePulse();
  const subjects = Array.from(new Set(state.commitments.map(item => item.subject?.trim()).filter(Boolean))) as string[];
  const upcoming = [...state.commitments]
    .filter(item => !item.completed)
    .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
    .slice(0, 5);
  const firstSubject = subjects[0] || 'study skills';

  return (
    <div className="resources-page" id="resources-page">
      <header className="app-page-hero resources-page-hero">
        <div className="app-page-hero-copy">
          <span className="app-page-kicker"><i /> KEEP GOOD THINGS CLOSE</span>
          <h1>Resources <Sprout aria-hidden="true" /></h1>
          <p>Study materials, useful references, and the next thing you’re working toward.</p>
        </div>
        <div className="resources-hero-note"><span>YOUR STUDY SHELF</span><b>A good place to begin.</b></div>
      </header>

      <section className="resources-category-grid" aria-label="Resource types">
        {resourceKinds.map(({ title, detail, icon: Icon, link, tone }) => (
          <a className={`resource-category-card tone-${tone}`} href={link(firstSubject)} target="_blank" rel="noreferrer" key={title}>
            <span className="resource-category-icon"><Icon size={19} /></span>
            <b>{title}</b><p>{detail}</p><ExternalLink size={13} className="resource-external-icon" />
          </a>
        ))}
      </section>

      <div className="resources-lower-grid">
        <section className="resources-subject-panel">
          <div className="resources-panel-heading"><div><span className="app-page-kicker">ORGANIZED AROUND YOUR WORK</span><h2>Subject resources</h2></div><span className="resources-count">{subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}</span></div>
          {subjects.length ? <div className="resources-subject-grid">
            {subjects.map(subject => {
              const count = state.commitments.filter(item => item.subject === subject).length;
              return <a key={subject} href={`https://scholar.google.com/scholar?q=${encodeURIComponent(subject)}`} target="_blank" rel="noreferrer" className="resources-subject-card">
                <span className="resource-category-icon"><BookOpen size={18} /></span><span><b>{subject}</b><small>{count} linked {count === 1 ? 'commitment' : 'commitments'}</small></span><ExternalLink size={13} />
              </a>;
            })}
          </div> : <div className="resources-empty"><Bookmark size={18} /><span>Add a subject to a commitment and your study shelf will organize around it.</span></div>}
        </section>

        <section className="resources-upcoming-panel">
          <div className="resources-panel-heading"><div><span className="app-page-kicker">CONNECTED TO YOUR WEEK</span><h2>Coming up</h2></div></div>
          {upcoming.length ? <ul>{upcoming.map(item => <li key={item.id}><span className="resources-upcoming-icon"><BookOpen size={15} /></span><span className="resources-upcoming-copy"><b>{item.title}</b><small>{item.subject || item.type}</small></span><time>{item.dueDate || 'No date'}</time></li>)}</ul> : <div className="resources-empty"><span>Your shelf is clear. Add a commitment whenever you’re ready.</span></div>}
          <a className="resources-browse-link" href={`https://scholar.google.com/scholar?q=${encodeURIComponent(firstSubject)}`} target="_blank" rel="noreferrer">Browse learning references <ExternalLink size={13} /></a>
        </section>
      </div>
    </div>
  );
};

