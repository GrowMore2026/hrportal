import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeSidebar from '../../EmployeeSidebar';
import './OrganizationChart.css';

const OrgNode = ({ node, level = 0 }) => {
  return (
    <li>
      <div className={`org-card level-${level % 5}`}>
        <div className="org-avatar-container">
          {node.profile_image ? (
            <img src={node.profile_image} alt={`${node.first_name} ${node.last_name}`} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>
        <div className="org-info">
          <p className="org-name" title={`${node.first_name || ''} ${node.last_name || ''}`.trim()}>
            {`${node.first_name || ''} ${node.last_name || ''}`.trim() || 'Unknown'}
          </p>
          <p className="org-role" title={node.designation || ''}>{node.designation || 'Employee'}</p>
          <p className="org-id">Emp ID - {node.emp_code || 'N/A'}</p>
        </div>
        <button className="org-options-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map(child => (
            <OrgNode key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function OrganizationChart() {
  const [employees, setEmployees] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) {
          const empList = data.employees;
          setEmployees(empList);
          buildTree(empList);
        }
      })
      .catch(err => console.error('Failed to fetch employees:', err));
  }, []);

  const buildTree = (empList) => {
    const map = {};
    const roots = [];

    empList.forEach(emp => {
      map[emp.id] = { ...emp, children: [] };
    });

    const findManagerIdByName = (name) => {
      if (!name) return null;
      const n1 = name.trim().toLowerCase();
      const mgr = empList.find(e => `${e.first_name || ''} ${e.last_name || ''}`.trim().toLowerCase() === n1);
      return mgr ? mgr.id : null;
    };

    empList.forEach(emp => {
      let managerId = findManagerIdByName(emp.reporting_to);
      if (managerId && map[managerId]) {
        map[managerId].children.push(map[emp.id]);
      } else {
        roots.push(map[emp.id]);
      }
    });

    setTreeData(roots);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.org-card') || e.target.closest('button') || e.target.closest('select')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    // Only zoom if control/cmd key is pressed or we're on trackpad - but for a canvas usually it's standard
    // However standard onWheel without checking delta mode might scroll the page.
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.2, scale + delta), 3);
    setScale(newScale);
  };

  const zoomIn = () => setScale(s => Math.min(3, s + 0.2));
  const zoomOut = () => setScale(s => Math.max(0.2, s - 0.2));
  const zoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="org-chart-page-container">
      <EmployeeSidebar />
      <main className="org-chart-main-content">
        <div className="org-chart-header">
          <div className="org-chart-breadcrumb"></div>
          
          <div className="org-chart-controls">
            <div className="org-chart-filter-group">
              <select className="org-filter-select">
                <option>Payroll Month: Jun'26</option>
              </select>
              <select className="org-filter-select">
                <option>All</option>
              </select>
            </div>
            
            <button className="org-action-btn org-btn-outline">Assign Top Level Manager</button>
            <button className="org-action-btn org-btn-outline">Mass Transfer</button>
            <button className="org-action-btn org-btn-primary">Assign Manager</button>
          </div>
        </div>

        <div 
          className="org-chart-canvas-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div 
            className="org-chart-canvas"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
            }}
          >
            <div className="org-tree">
              <ul>
                {treeData.map(node => (
                  <OrgNode key={node.id} node={node} />
                ))}
              </ul>
            </div>
          </div>

          <div className="org-zoom-controls">
            <button className="org-zoom-btn" onClick={zoomReset} title="Reset Zoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM15 9l-6 6M9 9l6 6"/></svg>
            </button>
            <button className="org-zoom-btn" onClick={zoomIn} title="Zoom In">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button className="org-zoom-btn" onClick={zoomOut} title="Zoom Out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
