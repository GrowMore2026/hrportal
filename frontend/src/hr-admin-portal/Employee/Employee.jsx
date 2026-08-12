import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { SvgPieChart } from '../HomePage/Dashboard.jsx';
import EmployeeSidebar from './EmployeeSidebar';
import '../HomePage/Dashboard.css';
import './EmployeeSidebar.css';

/* ── Chart data ── */
const headCountData = [
  { month: 'Mar', count: 5 },
  { month: 'Apr', count: 24 },
  { month: 'May', count: 32 },
  { month: 'Jun', count: 46 },
  { month: 'Jul', count: 42 },
  { month: 'Aug', count: 42 },
];

const loginStatsData = [
  { day: '5', last: 35, current: 36 },
  { day: '10', last: 36, current: 40 },
  { day: '15', last: 38, current: 8 },
  { day: '20', last: 30, current: 0 },
  { day: '25', last: 35, current: 0 },
  { day: '30', last: 39, current: 0 },
];

const lettersData = [
  { month: 'Sep', value: 0 },
  { month: 'Oct', value: 0 },
  { month: 'Nov', value: 0 },
];

const mobileAppData = [
  { name: 'Using', value: 35, color: '#1c9c6e' },
  { name: 'Not Using', value: 8, color: '#e05c8a' },
];

/* ── List Data ── */
const newJoiners = [
  { name: 'Sneha Sathwara', id: 'GM064', time: '6 days ago' },
  { name: 'Sanjay Shukla', id: 'GM062', time: '14 days ago' },
  { name: 'Mohini Chandpa', id: 'GM061', time: '21 days ago' }
];

const upcomingBirthdays = [
  { name: 'Suraj Dwivedi', id: 'GM006', time: '14 Aug 2026', img: true }
];

const confirmationsDue = [
  { name: 'Vruti Vachhani', id: 'GM033', time: 'in 2 days', img: true },
  { name: 'Dantreliya Ravi N...', id: 'GM039', time: 'in 2 days', img: true },
  { name: 'Chavda Jagrutibe...', id: 'GM032', time: 'in 2 days', img: true }
];

const resignedEmployees = [
  { name: 'Jeel Agrawal', id: 'GM050', time: '6 days ago' }
];

export default function Employee() {
  return (
    <div className="emp-page-layout">
      {/* ── Sidebar ── */}
      <EmployeeSidebar />

      {/* ── Main Content ── */}
      <main className="emp-main-content">
        <div className="emp-dashboard-grid">
          {/* ─ Row 1 ─ */}
          {/* Head Count (wide) */}
          <div className="emp-card emp-card--wide">
            <h3 className="emp-card-title">Employees Head Count</h3>
            <div className="emp-chart-wrap" style={{ marginTop: '-10px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={headCountData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis ticks={[0, 12, 24, 36, 48]} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="linear" dataKey="count" stroke="#14b8a6" strokeWidth={1.5} dot={{ r: 3, fill: '#14b8a6' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Helpdesk Stats */}
          <div className="emp-card">
            <div className="emp-stat-number">0</div>
            <div className="emp-stat-label">Helpdesk Stats of 3 Months</div>
            <div className="emp-stat-change green">0% <span className="emp-stat-vs">vs Previous month</span></div>
            <div className="emp-helpdesk-row">
              <div className="emp-helpdesk-item">
                <span className="emp-helpdesk-val">0</span>
                <span className="emp-helpdesk-lbl">Ticket Raised</span>
              </div>
              <div className="emp-helpdesk-divider"></div>
              <div className="emp-helpdesk-item">
                <span className="emp-helpdesk-val">0</span>
                <span className="emp-helpdesk-lbl">Ticket Solved</span>
              </div>
            </div>
          </div>

          {/* ─ Row 2 ─ */}
          {/* Login Stats */}
          <div className="emp-card">
            <div className="emp-stat-number">134</div>
            <div className="emp-stat-label">Employees Login Stats of 3 Months</div>
            <div className="emp-stat-change red">-10% <span className="emp-stat-vs">vs Previous month</span></div>
            <div className="emp-chart-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={loginStatsData} margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis label={{ value: 'Employees', angle: -90, position: 'left', style: { fontSize: 10, fill: '#9ca3af' } }} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10, color: '#6b7280' }} />
                  <Line type="linear" dataKey="last" stroke="#67e8f9" strokeWidth={1.5} dot={{ r: 3, fill: '#67e8f9' }} name="Last month" />
                  <Line type="linear" dataKey="current" stroke="#818cf8" strokeWidth={1.5} dot={{ r: 3, fill: '#818cf8' }} name="Current month" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Letters Generated */}
          <div className="emp-card">
            <div className="emp-stat-number">0</div>
            <div className="emp-stat-label">Letters Generated Stats of 3 Months</div>
            <div className="emp-stat-change green">0% <span className="emp-stat-vs">vs Previous month</span></div>
            <div className="emp-chart-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={lettersData} margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f8f9fa" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis label={{ value: 'Letter Generated', angle: -90, position: 'left', style: { fontSize: 10, fill: '#9ca3af' } }} tick={false} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#67e8f9" barSize={20} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mobile App Users */}
          <div className="emp-card">
            <h3 className="emp-card-title">Mobile App Users</h3>
            <div style={{ marginTop: '16px' }}>
              <SvgPieChart
                data={mobileAppData}
                labelKey="name"
                valueKey="value"
                height={160}
                chartWidth={160}
                cx={80}
                radius={56}
                legendFontSize={11}
              />
            </div>
          </div>
        </div>

        {/* ─ Row 3: Lists ─ */}
        <div className="emp-list-grid" style={{ marginTop: '24px' }}>
            {/* New Joiners */}
            <div className="emp-card emp-card--span-2">
              <div className="emp-list-header">
                <div className="emp-list-title">New Joiners for Last 1 Month</div>
                <Link to="/add-employee" className="emp-list-action">Add</Link>
              </div>
              {newJoiners.map((emp, idx) => (
                <div key={idx} className="emp-list-item">
                  <div className="emp-avatar">
                    <svg viewBox="0 0 24 24" className="emp-avatar-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="emp-item-details">
                    <div className="emp-item-name">{emp.name}</div>
                    <div className="emp-item-id">({emp.id})</div>
                  </div>
                  <div className="emp-item-time">{emp.time}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Birthdays */}
            <div className="emp-card emp-card--span-2">
              <div className="emp-list-header">
                <div className="emp-list-title">Upcoming Birthdays for a week</div>
              </div>
              {upcomingBirthdays.map((emp, idx) => (
                <div key={idx} className="emp-list-item">
                  <div className="emp-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt={emp.name} />
                  </div>
                  <div className="emp-item-details">
                    <div className="emp-item-name">{emp.name}</div>
                    <div className="emp-item-id">({emp.id})</div>
                  </div>
                  <div className="emp-item-time">{emp.time}</div>
                </div>
              ))}
            </div>

            {/* Confirmation due */}
            <div className="emp-card emp-card--span-2">
              <div className="emp-list-header">
                <div className="emp-list-title">Confirmation due for next 1 Month</div>
              </div>
              {confirmationsDue.map((emp, idx) => (
                <div key={idx} className="emp-list-item">
                  <div className="emp-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt={emp.name} />
                  </div>
                  <div className="emp-item-details">
                    <div className="emp-item-name">{emp.name}</div>
                    <div className="emp-item-id">({emp.id})</div>
                  </div>
                  <div className="emp-item-time">{emp.time}</div>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="#" className="emp-list-action">+12 more</Link>
              </div>
            </div>

            {/* Resigned Employees */}
            <div className="emp-card emp-card--span-3">
              <div className="emp-list-header">
                <div className="emp-list-title">Resigned Employees for Last 1 Month</div>
                <Link to="#" className="emp-list-action">Add</Link>
              </div>
              {resignedEmployees.map((emp, idx) => (
                <div key={idx} className="emp-list-item">
                  <div className="emp-avatar">
                    <svg viewBox="0 0 24 24" className="emp-avatar-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="emp-item-details">
                    <div className="emp-item-name">{emp.name}</div>
                    <div className="emp-item-id">({emp.id})</div>
                  </div>
                  <div className="emp-item-time">{emp.time}</div>
                </div>
              ))}
            </div>

            {/* Joining Anniversary */}
            <div className="emp-card emp-card--span-3">
              <div className="emp-list-header">
                <div className="emp-list-title">Joining Anniversary for a week</div>
              </div>
              <div className="emp-empty-state">
                <svg className="emp-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                No joining anniversary to show.
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
