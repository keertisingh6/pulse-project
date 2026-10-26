import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, CheckCircle2, ChevronDown, Focus, LayoutGrid, Lock,
  Menu, Sparkles, Target, User, X,
} from 'lucide-react';
import { motion } from 'motion/react';

const walkthrough = [
  { number: '01', title: 'Get it out of your head', body: 'Add assignments, exams, bills, and the things life keeps throwing at you. Pulse gives every commitment one calm place to land.' },
  { number: '02', title: 'See the day clearly', body: 'Your deadlines and available time come together in a realistic plan, with enough breathing room to actually follow it.' },
  { number: '03', title: 'Keep moving, gently', body: 'Check in with Kairo, settle into a focus session, and make progress one small step at a time.' },
];

const faqs = [
  { question: 'What is Pulse?', answer: 'Pulse is a personal productivity workspace for student life. It brings assignments, deadlines, planning, focus sessions, goals, and your AI study companion into one place.' },
  { question: 'Can I use Pulse without an account?', answer: 'Yes. Choose “Open Pulse” to enter a local workspace and start exploring without signing in.' },
  { question: 'How does Kairo work?', answer: 'Kairo can help you understand your commitments and plan your next step. AI replies require the project owner to configure an AI provider for the server.' },
  { question: 'Does Pulse work on mobile?', answer: 'The workspace and landing page adapt to smaller screens, so you can check your plan and commitments on the go.' },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`pulse-brand ${light ? 'pulse-brand-light' : ''}`} aria-label="Pulse home">
      <span className="pulse-brand-mark">p<span /></span>
      <span className="pulse-brand-name">pulse</span>
    </a>
  );
}

function PhonePreview({ kind }: { kind: 'plan' | 'kairo' }) {
  return (
    <div className={`phone-shell phone-${kind}`} aria-label={kind === 'plan' ? 'Pulse daily plan preview' : 'Kairo assistant preview'}>
      <div className="phone-screen">
        <div className="phone-status"><span>9:41</span><span className="phone-status-icons">● ▰ ▮</span></div>
        <div className="phone-island" />
        <div className="phone-appbar"><span className="phone-app-logo">p</span><span>Pulse</span><Bell size={14} /></div>
        {kind === 'plan' ? (
          <>
            <div className="phone-greeting"><span className="eyebrow">MONDAY, OCTOBER 26</span><h3>A little progress<br />goes a long way.</h3></div>
            <div className="phone-focus-card"><div><span className="eyebrow">UP NEXT</span><strong>Review biology notes</strong><small>10:30 · 45 min focus</small></div><span className="phone-play">↗</span></div>
            <div className="phone-list-head"><strong>Today’s rhythm</strong><span>View day</span></div>
            <div className="phone-timeline">
              <div className="timeline-row"><time>09:00</time><span className="timeline-dot blue"/><div><b>Morning reset</b><small>Water, breakfast, ease in</small></div></div>
              <div className="timeline-row"><time>10:30</time><span className="timeline-dot indigo"/><div><b>Biology review</b><small>Chapter 04 · 45 minutes</small></div></div>
              <div className="timeline-row"><time>12:00</time><span className="timeline-dot pale"/><div><b>Take a real break</b><small>Walk away from your desk</small></div></div>
              <div className="timeline-row"><time>14:00</time><span className="timeline-dot blue"/><div><b>Project check-in</b><small>One small next step</small></div></div>
            </div>
            <div className="phone-tabbar"><LayoutGrid size={15}/><CalendarDays size={15}/><Focus size={15}/><User size={15}/></div>
          </>
        ) : (
          <>
            <div className="kairo-top"><span className="kairo-avatar">✳</span><div><b>Kairo</b><small>Your study companion</small></div><span className="online-dot" /></div>
            <div className="chat-date">TODAY · 9:42 AM</div>
            <div className="chat-bubble kairo-bubble">You have a biology review and a project check-in today. Want to start with the one that feels easiest?</div>
            <div className="chat-bubble user-bubble">Help me get started.</div>
            <div className="chat-bubble kairo-bubble"><span className="serif-reply">Let’s make it small.</span><br/><br/>Open your notes and review just one section. I’ll help you choose what comes next.</div>
            <div className="chat-suggestion">Break down a task <ArrowRight size={12}/></div>
            <div className="chat-input">Ask Kairo anything… <span>↑</span></div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductPanel() {
  return (
    <div className="day-panel">
      <div className="day-panel-top"><span className="panel-icon"><CalendarDays size={16}/></span><span className="eyebrow">YOUR MONDAY, IN FOCUS</span><span className="panel-more">•••</span></div>
      <div className="day-panel-title"><h3>Make today<br/><em>feel doable.</em></h3><span className="weather-mark">☼<small>clear head<br/>ahead</small></span></div>
      <div className="day-panel-progress"><span>DAILY FLOW</span><span>2 of 4 blocks</span><div><i /></div></div>
      <div className="day-panel-row done"><span className="panel-time">09:00</span><span className="panel-line"/><span className="panel-task"><b>Ease into the day</b><small>Breakfast & a slow start</small></span><CheckCircle2 size={16}/></div>
      <div className="day-panel-row active"><span className="panel-time">10:30</span><span className="panel-line"/><span className="panel-task"><b>Review biology notes</b><small>Chapter 04 · 45 minutes</small></span><ArrowUpRight size={16}/></div>
      <div className="day-panel-row"><span className="panel-time">12:00</span><span className="panel-line"/><span className="panel-task"><b>Take a proper break</b><small>Fresh air is part of the plan</small></span><span className="panel-empty"/></div>
      <div className="day-panel-row"><span className="panel-time">14:00</span><span className="panel-line"/><span className="panel-task"><b>Project check-in</b><small>Just the next small step</small></span><span className="panel-empty"/></div>
      <div className="panel-foot"><span><span className="blue-dot"/> A steady pace, not a perfect day.</span><span>✳</span></div>
    </div>
  );
}

export const PulseLandingPage: React.FC = () => {
  const { continueToPulse, login, loginAsGuest, signup, loadDemoData, loading, error, clearError } = usePulse();
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const openAuth = (nextMode: 'signin' | 'signup' = 'signin') => {
    setMode(nextMode);
    setValidationError(null);
    clearError();
    setAuthOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    clearError();
    if (!email.trim() || !email.includes('@')) return setValidationError('Please enter a valid email address.');
    if (mode === 'signup' && !name.trim()) return setValidationError('Please enter your name.');
    if (!password || password.length < 6) return setValidationError('Password must be at least 6 characters.');
    try {
      if (mode === 'signin') await login(email.trim(), password, name.trim());
      else await signup(name.trim(), email.trim(), password);
    } catch { /* The context provides the error message. */ }
  };

  return (
    <div className="pulse-landing" id="top">
      <div className="pulse-sky" aria-hidden="true"><i className="sky-cloud cloud-one"/><i className="sky-cloud cloud-two"/><i className="sky-cloud cloud-three"/><i className="sky-cloud cloud-four"/><i className="sky-grain"/><i className="sky-halftone"/></div>
      <header className="landing-nav-wrap">
        <nav className="landing-nav" aria-label="Main navigation">
          <Brand />
          <div className="landing-links"><a href="#how-it-works">How it works</a><a href="#features">The feeling</a><a href="#letter">Our note</a></div>
          <div className="landing-nav-actions"><button className="nav-signin" onClick={() => openAuth('signin')}>Sign in</button><button className="button-blue nav-cta" onClick={() => continueToPulse()}>Open Pulse <ArrowUpRight size={15}/></button><button className="mobile-menu" onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Jump to features"><Menu size={19}/></button></div>
        </nav>
      </header>

      <main>
        <section className="landing-hero section-wrap">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="hero-copy">
            <div className="hero-kicker"><span className="blue-dot"/> A softer way to stay on top of things</div>
            <h1>Make room for<br/>the work that <span>matters.</span></h1>
            <p>All the things on your mind, in one calmer place. Pulse helps you find your rhythm between deadlines, deep focus, and being a person.</p>
            <div className="hero-actions"><button className="button-blue button-large" onClick={() => continueToPulse()}>Find your rhythm <ArrowRight size={17}/></button><button className="text-link demo-preview-link" onClick={loadDemoData}>Explore with example data <ArrowUpRight size={15}/></button><a href="#how-it-works" className="text-link landing-tour-link">Take a little tour <ArrowDownRight size={15}/></a></div>
            <div className="hero-note"><span className="mini-avatars"><i>J</i><i>M</i><i>A</i></span><span>A quieter corner of your busy day.</span></div>
          </motion.div>
          <div className="hero-products" aria-label="Pulse app previews">
            <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
            <motion.div className="hero-phone hero-phone-left" initial={{ opacity: 0, y: 34, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: -7 }} transition={{ duration: 0.9, delay: 0.2 }}><PhonePreview kind="plan"/></motion.div>
            <motion.div className="hero-phone hero-phone-right" initial={{ opacity: 0, y: 48, rotate: 7 }} animate={{ opacity: 1, y: 0, rotate: 6 }} transition={{ duration: 0.9, delay: 0.35 }}><PhonePreview kind="kairo"/></motion.div>
            <div className="float-note note-top"><span className="blue-dot"/> A plan with room to breathe</div>
            <div className="float-note note-bottom"><Sparkles size={13}/> One next step at a time</div>
          </div>
          <a className="scroll-cue" href="#intro"><span>SCROLL A LITTLE</span><span className="scroll-cue-line"/></a>
        </section>

        <section className="intro-section section-wrap" id="intro">
          <div className="section-label"><span className="blue-dot"/> A NOTE ON PRODUCTIVITY</div>
          <div className="intro-grid"><h2>You’re a whole person.<br/><em>Your planner should know that.</em></h2><p>Some days have classes, three deadlines, and a plan to make dinner. Some days, getting started is the whole win. Pulse brings your responsibilities into view without asking you to become a machine.</p></div>
          <div className="intro-rule"><span>Less noise, more knowing what comes next.</span><ArrowDownRight size={18}/></div>
        </section>

        <section className="walkthrough-section section-wrap" id="how-it-works">
          <div className="section-label"><span className="blue-dot"/> A LITTLE MORE IN STEP</div>
          <div className="walkthrough-grid">
            <div className="walkthrough-copy"><h2>A steady rhythm,<br/><em>built around you.</em></h2><div className="walkthrough-steps">{walkthrough.map(step => <article className="walk-step" key={step.number}><span className="walk-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></article>)}</div><button className="text-link walkthrough-link" onClick={() => continueToPulse()}>Start with what’s on your mind <ArrowRight size={15}/></button></div>
            <div className="walkthrough-visual"><div className="visual-sky"><span className="visual-sun"/><span className="visual-cloud cloud-a"/><span className="visual-cloud cloud-b"/><span className="visual-haze"/></div><ProductPanel/><div className="visual-caption"><span className="blue-dot"/> YOUR DAY, WITH BREATHING ROOM</div></div>
          </div>
        </section>

        <section className="features-section section-wrap" id="features">
          <div className="features-heading"><div><div className="section-label"><span className="blue-dot"/> THOUGHTFUL BY DESIGN</div><h2>Everything has<br/><em>a place to land.</em></h2></div><p>Not more tabs. Not another system to maintain. Just a few good tools that make it easier to show up for what matters.</p></div>
          <div className="feature-grid">
            <article className="feature-card feature-card-wide feature-sky-card"><div className="feature-card-text"><span className="feature-index">01 / SEE THE WHOLE DAY</span><h3>Make a plan<br/>that feels possible.</h3><p>Deadlines and available time, held together in one gentle overview.</p></div><div className="feature-calendar-art"><div className="art-sun"/><span className="art-cloud art-cloud-1"/><span className="art-cloud art-cloud-2"/><div className="art-glass-card"><span>MONDAY, OCT 26</span><b>Today has a little room.</b><i><Check size={12}/> Biology review <small>10:30</small></i><i>○ Project check-in <small>14:00</small></i></div></div></article>
            <article className="feature-card feature-kairo-card"><span className="feature-index">02 / A THOUGHTFUL COMPANION</span><div className="feature-kairo-glow"><span>✳</span></div><h3>Meet Kairo.</h3><p>Talk through a busy week, untangle a deadline, or ask for the next small step.</p><div className="mini-chat">“Let’s make it small.”<span>✳</span></div></article>
            <article className="feature-card feature-focus-card"><span className="feature-index">03 / FIND YOUR FOCUS</span><div className="focus-art"><div className="focus-ring"><div><small>TAKE A BREATH</small><b>25:00</b><span>one thing at a time</span></div></div><i className="focus-spark spark-a">✳</i><i className="focus-spark spark-b">·</i></div><h3>One thing at a time.</h3><p>Settle into a focus session that makes starting feel lighter.</p></article>
            <article className="feature-card feature-tasks-card"><span className="feature-index">04 / KEEP THE DETAILS CLOSE</span><div className="task-stack"><div><span className="task-check done-check"><Check size={11}/></span><span>Read chapter three</span><small>DONE</small></div><div><span className="task-check"/><span>Finish lab reflection</span><small>TODAY</small></div><div><span className="task-check"/><span>Reply to project group</span><small>FRI</small></div></div><h3>Small things count, too.</h3><p>Keep assignments, exams, and everyday commitments in one clear inbox.</p></article>
            <article className="feature-card feature-goals-card"><span className="feature-index">05 / NOTICE THE DISTANCE YOU’VE COME</span><div className="goal-art"><div className="goal-orb orb-back"/><div className="goal-orb orb-front"><Target size={22}/></div><span className="goal-label">A LITTLE CLOSER</span></div><h3>Progress, in perspective.</h3><p>Keep your goals in sight and let steady progress count as progress.</p></article>
          </div>
        </section>

        <section className="testimonial-section section-wrap">
          <div className="testimonial-heading"><div className="section-label"><span className="blue-dot"/> A FEW KIND WORDS</div><h2>Room to breathe.<br/><em>Space to do good work.</em></h2></div>
          <div className="testimonial-grid">
            <blockquote className="quote-card quote-large"><span className="quote-mark">“</span><p>It feels like someone finally made a planner that understands that my energy is part of the schedule.</p><footer><span className="portrait portrait-blue">S</span><span><b>Samira K.</b><small>Undergraduate student</small></span><span className="quote-stars">✳</span></footer></blockquote>
            <blockquote className="quote-card quote-small"><span className="quote-mark">“</span><p>I stopped spending Sunday night making a plan I’d abandon by lunch.</p><footer><span className="portrait portrait-lilac">J</span><span><b>Jordan L.</b><small>Design student</small></span></footer></blockquote>
            <blockquote className="quote-card quote-small quote-tint"><span className="quote-mark">“</span><p>The small next step is my favorite part. It makes a heavy day feel a bit more human.</p><footer><span className="portrait portrait-peach">A</span><span><b>Amara R.</b><small>Graduate student</small></span></footer></blockquote>
          </div>
          <p className="testimonial-disclaimer">A calmer way to make progress, at your own pace.</p>
        </section>

        <section className="letter-section section-wrap" id="letter">
          <div className="letter-card"><div className="letter-texture"/><div className="letter-inner"><div className="section-label"><span className="blue-dot"/> A NOTE FROM THE MAKER</div><h2>For the days when<br/><em>everything feels like a lot.</em></h2><div className="letter-body"><p>Pulse began with a small thought: maybe being productive shouldn’t mean learning to ignore yourself.</p><p>Our lives are more than due dates. There are quiet starts, unexpected detours, things we care about, and days when a gentle plan is enough. I wanted to make a place that could hold all of that with a little more kindness.</p><p>I hope Pulse helps you find your next step, and gives you a bit more room to be you along the way.</p></div><div className="letter-signoff"><span>With care,</span><b>Team Pulse <span>✳</span></b></div></div><div className="letter-art" aria-hidden="true"><div className="letter-halo"/><span className="letter-cloud letter-cloud-one"/><span className="letter-cloud letter-cloud-two"/><div className="letter-star">✳</div><div className="letter-tag">A LITTLE MORE<br/>ROOM TO BREATHE</div></div></div>
        </section>

        <section className="faq-section section-wrap" id="faq"><div className="faq-heading"><div className="section-label"><span className="blue-dot"/> GOOD TO KNOW</div><h2>A few things<br/><em>you might wonder.</em></h2><p>Still curious? <a href="mailto:hello@pulse.study">Drop us a note <ArrowUpRight size={13}/></a></p></div><div className="faq-list">{faqs.map((faq, index) => <details key={faq.question} className="faq-item" open={index === 0}><summary><span>{faq.question}</span><ChevronDown size={17}/></summary><p>{faq.answer}</p></details>)}</div></section>

        <section className="closing-section section-wrap"><div className="closing-sky"><div className="closing-cloud closing-cloud-left"/><div className="closing-cloud closing-cloud-right"/><div className="closing-grain"/><div className="section-label"><span className="blue-dot"/> A FRESH PAGE IS WAITING</div><h2>Take a breath.<br/><em>Then take your next step.</em></h2><p>Your day doesn’t have to be perfect to make a little progress.</p><button className="button-blue button-large" onClick={() => continueToPulse()}>Open your Pulse <ArrowRight size={17}/></button><span className="closing-small-note"><Lock size={12}/> Your workspace, your pace.</span></div></section>
      </main>

      <footer className="landing-footer section-wrap"><Brand/><span>Designed for your real life, not an ideal one.</span><div><a href="#faq">FAQ</a><a href="mailto:hello@pulse.study">Say hello</a><span>© 2026 Pulse</span></div></footer>

      {authOpen && <div className="auth-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAuthOpen(false); }}><div className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="auth-close" onClick={() => setAuthOpen(false)} aria-label="Close sign in"><X size={19}/></button><Brand/><div className="auth-dialog-copy"><div className="auth-asterisk">✳</div><h2 id="auth-title">{mode === 'signin' ? 'Welcome back.' : 'A fresh start.'}</h2><p>{mode === 'signin' ? 'Pick up where you left off.' : 'Make a little room for what matters.'}</p></div><div className="auth-mode"><button className={mode === 'signin' ? 'selected' : ''} onClick={() => setMode('signin')}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>Create account</button></div>{(validationError || error) && <div className="auth-error" role="alert">{validationError || error}</div>}<form className="auth-form" onSubmit={handleSubmit}>{mode === 'signup' && <label>Your name<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="How should we call you?"/></label>}<label>Email address<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters"/></label><button className="button-blue auth-submit" disabled={loading}>{loading ? 'One moment…' : mode === 'signin' ? 'Sign in to Pulse' : 'Create your account'} <ArrowRight size={15}/></button></form><div className="auth-divider"><span/>or explore without an account<span/></div><button className="guest-button" onClick={() => loginAsGuest('Student')}>Open a local guest workspace <ArrowUpRight size={14}/></button><p className="auth-privacy"><Lock size={12}/> A private, personal space to begin.</p></div></div>}
    </div>
  );
};

