import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Icon } from './HomePage';

const updates = [
  { date: '06 Aug 2026', title: 'Multi-Language Support for Employee Profiles in GrowMore' },
  { date: '31 Jul 2026', title: 'Form 24Q is now Form 138' },
  { date: '30 Jul 2026', title: "From Tax Filing to AI — HR's Essential Update" },
  { date: '25 Jul 2026', title: 'New Leave Policy rolled out across all branches' },
];

export default function WelcomePage() {
  const { favourites, setShowModal } = useOutletContext();

  return (
    <>
      {/* My Favourites */}
      <h2 className="gm-bento-heading">My Favourites</h2>
      <div className="gm-fav-row">
        <button className="gm-fav-add-btn" aria-label="Add favourite" onClick={() => setShowModal(true)}>
          <span className="gm-fav-add-icon">+</span>
        </button>
        {favourites.map((f) => (
          <button key={f.label} className="gm-widget gm-widget-fav gm-tone-green">
            <span className="gm-fav-icon"><Icon name={f.icon} /></span>
            <span className="gm-fav-label">{f.label}</span>
          </button>
        ))}
      </div>

      {/* My Tasks */}
      <h2 className="gm-bento-heading">My Tasks</h2>
      <section className="gm-widget gm-widget-tasks">
        <a href="#leave" className="gm-task-row">
          <div>
            <h3>Leave</h3>
            <p>2 tasks pending for others' review.</p>
          </div>
          <span className="gm-monitor-btn">Monitor →</span>
        </a>
        <a href="#permissions" className="gm-task-row">
          <div>
            <h3>Permissions</h3>
            <p>1 task pending for others' review.</p>
          </div>
          <span className="gm-monitor-btn">Monitor →</span>
        </a>
      </section>

      {/* Latest Updates */}
      <section className="gm-widget gm-widget-updates">
        <div className="gm-updates-head">
          <h2>Latest Updates</h2>
          <a href="#all" aria-label="See all updates">See all</a>
        </div>
        <div className="gm-updates-list">
          {updates.map((u) => (
            <div key={u.title} className="gm-update-item">
              <span className="gm-update-date">{u.date}</span>
              <p>{u.title}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
