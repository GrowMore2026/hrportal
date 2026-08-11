import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

// ─── Pure SVG Line Chart (no dependencies) ──────────────────────
function SvgLineChart({ data, xKey, lines, xLabel, yLabel, height = 220 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pad = { top: 24, right: 36, bottom: 44, left: 52 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const allVals = lines.flatMap(l => data.map(d => d[l.key]));
  const maxVal = Math.max(...allVals, 1);
  const gridLines = 5;
  const xStep = data.length > 1 ? W / (data.length - 1) : W;

  const toX = i => pad.left + (data.length > 1 ? i * xStep : W / 2);
  const toY = v => pad.top + H - (v / maxVal) * H;

  const [tooltip, setTooltip] = useState(null);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', userSelect: 'none' }}>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {/* Y grid lines + labels */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const val = Math.round((maxVal / gridLines) * (gridLines - i));
          const y = pad.top + (H / gridLines) * i;
          return (
            <g key={i}>
              <line x1={pad.left} x2={pad.left + W} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 3" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{val}</text>
            </g>
          );
        })}
        {/* Y axis label */}
        <text transform={`translate(14,${pad.top + H / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#6b7280">{yLabel}</text>
        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={pad.top + H + 18} textAnchor="middle" fontSize={11} fill="#9ca3af">{d[xKey]}</text>
        ))}
        {/* X axis label */}
        <text x={pad.left + W / 2} y={height - 4} textAnchor="middle" fontSize={11} fill="#6b7280">{xLabel}</text>
        {/* Lines + dots + value labels */}
        {lines.map(l => {
          const pts = data.map((d, i) => `${toX(i)},${toY(d[l.key])}`).join(' ');
          return (
            <g key={l.key}>
              <polyline points={pts} fill="none" stroke={l.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {data.map((d, i) => (
                <g key={i}>
                  <circle cx={toX(i)} cy={toY(d[l.key])} r={5} fill={l.color} stroke="#fff" strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setTooltip({ x: toX(i), y: toY(d[l.key]), label: d[xKey], val: d[l.key], name: l.name, color: l.color })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                  {d[l.key] > 0 && (
                    <text x={toX(i)} y={toY(d[l.key]) - 10} textAnchor="middle" fontSize={11} fontWeight="600" fill="#374151">{d[l.key]}</text>
                  )}
                </g>
              ))}
            </g>
          );
        })}
        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect x={tooltip.x + 8} y={tooltip.y - 28} width={90} height={28} rx={6} fill="#1f2937" />
            <text x={tooltip.x + 53} y={tooltip.y - 10} textAnchor="middle" fontSize={11} fill="#fff">
              {tooltip.name}: {tooltip.val}
            </text>
          </g>
        )}
      </svg>
      {/* Legend */}
      {lines.length > 1 && (
        <div style={{ display: 'flex', gap: 16, paddingLeft: pad.left, marginTop: 4 }}>
          {lines.map(l => (
            <span key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
              {l.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pure SVG Horizontal Bar Chart ─────────────────────────────
function SvgBarChart({ data, labelKey, valueKey, color = '#1c9c6e', height = 240 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pad = { top: 16, right: 60, bottom: 32, left: 90 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  const barH = Math.min(24, (H / data.length) - 8);
  const barGap = H / data.length;
  const gridCount = 6;
  const [hovered, setHovered] = useState(null);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {Array.from({ length: gridCount + 1 }).map((_, i) => {
          const x = pad.left + (W / gridCount) * i;
          const val = Math.round((maxVal / gridCount) * i);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={pad.top} y2={pad.top + H} stroke="#e5e7eb" strokeDasharray="4 3" />
              <text x={x} y={pad.top + H + 18} textAnchor="middle" fontSize={11} fill="#9ca3af">{val}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barW = Math.max(4, (d[valueKey] / maxVal) * W);
          const y = pad.top + i * barGap + (barGap - barH) / 2;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <text x={pad.left - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize={11} fill="#6b7280">{d[labelKey]}</text>
              <rect x={pad.left} y={y} width={barW} height={barH} rx={4}
                fill={hovered === i ? '#17856a' : color}
                style={{ transition: 'fill 0.15s' }}
              />
              <text x={pad.left + barW + 6} y={y + barH / 2 + 4} fontSize={11} fontWeight="600" fill="#374151">{d[valueKey]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Pure SVG Pie / Donut Chart ───────────────────────────────
export function SvgPieChart({ data, labelKey, valueKey, height = 240, chartWidth = 320, cx = 130, radius, legendFontSize = 12 }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0);
  const cy = (height - 48) / 2 + 8, r = radius || Math.min(cx, cy) - 16;
  let angle = -Math.PI / 2;
  const [hovered, setHovered] = useState(null);

  const slices = data.map((d, i) => {
    const frac = total > 0 ? d[valueKey] / total : 0;
    const sweep = frac * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const mid = angle - sweep / 2;
    const lx = cx + (r * 0.62) * Math.cos(mid);
    const ly = cy + (r * 0.62) * Math.sin(mid);
    const large = sweep > Math.PI ? 1 : 0;
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, lx, ly, frac, val: d[valueKey], label: d[labelKey], color: d.color };
  });

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      <svg width={chartWidth} height={height} style={{ display: 'block', flexShrink: 0 }}>
        {slices.map((s, i) => (
          <g key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            <path d={s.d}
              fill={s.color}
              opacity={hovered === i ? 0.8 : 1}
              stroke="#fff" strokeWidth={2}
              style={{ transition: 'opacity 0.15s', transform: hovered === i ? `scale(1.04)` : 'scale(1)', transformOrigin: `${cx}px ${cy}px` }}
            />
            {s.val > 0 && (
              <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight="700" fill="#fff">{s.val}</text>
            )}
          </g>
        ))}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12 }}>
        {data.map((d, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: legendFontSize, color: '#374151' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: d.color, display: 'inline-block', flexShrink: 0 }} />
            {d[labelKey]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Pure SVG Vertical Bar Chart ───────────────────────────────
function SvgVBarChart({ data, xKey, valueKey, color = '#1c9c6e', height = 240 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const pad = { top: 32, right: 20, bottom: 40, left: 64 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  const barW = Math.min(48, (W / data.length) - 12);
  const barSlot = W / data.length;
  const gridCount = 5;
  const [hovered, setHovered] = useState(null);
  const fmt = v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : String(v);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {/* Y grid */}
        {Array.from({ length: gridCount + 1 }).map((_, i) => {
          const val = Math.round((maxVal / gridCount) * (gridCount - i));
          const y = pad.top + (H / gridCount) * i;
          return (
            <g key={i}>
              <line x1={pad.left} x2={pad.left + W} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 3" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{fmt(val)}</text>
            </g>
          );
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const bH = (d[valueKey] / maxVal) * H;
          const x = pad.left + i * barSlot + (barSlot - barW) / 2;
          const y = pad.top + H - bH;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x={x} y={y} width={barW} height={bH} rx={4}
                fill={hovered === i ? '#17856a' : color}
                style={{ transition: 'fill 0.15s' }}
              />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight="600" fill="#374151">{d[valueKey].toLocaleString()}</text>
              <text x={x + barW / 2} y={pad.top + H + 16} textAnchor="middle" fontSize={11} fill={hovered === i ? '#1c9c6e' : '#9ca3af'}>{d[xKey]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const allItems = [
  // Employee
  { icon: 'user', label: 'Add Employee', category: 'Employee', starred: true },
  { icon: 'user', label: 'Prepare Letter', category: 'Employee', starred: false },
  { icon: 'user', label: 'Import Data From Excel', category: 'Employee', starred: false },
  { icon: 'user', label: 'Disable Portal Access', category: 'Employee', starred: false },
  { icon: 'user', label: 'Enable Portal Access', category: 'Employee', starred: false },
  { icon: 'user', label: 'Regenerate Employee Password', category: 'Employee', starred: false },
  { icon: 'user', label: 'Employee Separation', category: 'Employee', starred: false },
  { icon: 'user', label: 'Confirm Employee', category: 'Employee', starred: false },
  { icon: 'user', label: 'Extend Probation Period', category: 'Employee', starred: false },
  { icon: 'user', label: 'Change Employee Number', category: 'Employee', starred: false },
  { icon: 'user', label: 'Exclude From Payroll', category: 'Employee', starred: false },
  { icon: 'user', label: 'Delete Employee', category: 'Employee', starred: false },
  { icon: 'user', label: 'Upload Employee Document', category: 'Employee', starred: false },
  { icon: 'user', label: 'Add Bulletin Board', category: 'Employee', starred: false },
  { icon: 'user', label: 'Mass Employee Update', category: 'Employee', starred: false },
  { icon: 'user', label: 'Update Employee Data', category: 'Employee', starred: false },
  { icon: 'user', label: 'Update Bank Details', category: 'Employee', starred: false },
  { icon: 'user', label: 'Employee Onboarding', category: 'Employee', starred: false },
  { icon: 'user', label: 'Invite Employees (Email Employee Password)', category: 'Employee', starred: false },
  { icon: 'user', label: 'Employee File', category: 'Employee', starred: false },
  { icon: 'user', label: 'Bulk Photo Upload', category: 'Employee', starred: false },
  { icon: 'user', label: 'Update Employee Category', category: 'Employee', starred: false },
  { icon: 'user', label: 'Bulk Data Upload', category: 'Employee', starred: false },
  { icon: 'user', label: 'Upload Forms / Policies', category: 'Employee', starred: false },
  { icon: 'user', label: 'People Analytics Hub', category: 'Employee', starred: false },
  { icon: 'user', label: 'Organization Chart', category: 'Employee', starred: false },
  { icon: 'user', label: 'Assign Manager', category: 'Employee', starred: false },
  // Payroll
  { icon: 'db', label: 'Stop Salary Processing', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Deduct Loss Of Pay (LOP)', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Print / Email Payslips', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Settle Resigned Employee', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Print / Email Reimbursement Payslip', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Arrears', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Update Employee PAN Number', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Revise Employee Salary', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Process Payroll', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Release IT Declaration Form', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Download IT Declaration For TDS', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Create New Payroll Month', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Update Payroll Data', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Pay Arrears', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Verify Payroll Differences', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Generate Payroll Statement', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Generate Accounts JV', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Release Payslip to Employees', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Clean Up Payroll', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Hold Salary Payout', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Release Salary Payout', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Resettle Employee', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Add TDS Challan', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Bank Transfer', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Track Cash/Cheque Payment', category: 'Payroll', starred: false },
  { icon: 'db', label: 'PF KYC Mapping', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Salary statement for a month', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Employee wise payslip release', category: 'Payroll', starred: false },
  // Leave
  { icon: 'calendar', label: 'Add Holidays', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Post Leave Transaction', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Grant Leave', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Year End Process', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Download Leave Card', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Apply On Behalf', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Verify employee swipes', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Attendance Muster', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Manual Override', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Shift Roster', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Shift Override', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Attendance Exception', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Attendance Period Finalization', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Update Sign in IP address', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Who Is in ?', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'View Employee attendance', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Approve leave', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Approve leave cancellation', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Approve RH', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Leave Calendar', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Approve Comp off', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Update Employee weekdays', category: 'Leave', starred: false },
  // Other
  { icon: 'folder', label: 'Upload Documents In Bulk', category: 'Other', starred: false },
  { icon: 'folder', label: 'Set up workflow delegate for an employee', category: 'Other', starred: false },
  { icon: 'folder', label: 'List of Values', category: 'Other', starred: false },
  { icon: 'folder', label: 'Employee Position', category: 'Other', starred: false },
  { icon: 'folder', label: 'Add New Bank Branch', category: 'Other', starred: false },
  { icon: 'folder', label: 'Update Company Details', category: 'Other', starred: false },
];

const categories = ['All', 'My Favourites', 'Employee', 'Payroll', 'Leave', 'Other'];

// Chart Data
const yearsInServiceData = [
  { year: '< 1', employees: 47 },
  { year: '> 10', employees: 1 },
];

const additionsAttritionData = [
  { month: 'Sep', joined: 0, resigned: 0 },
  { month: 'Oct', joined: 0, resigned: 0 },
  { month: 'Nov', joined: 0, resigned: 0 },
  { month: 'Dec', joined: 0, resigned: 0 },
  { month: 'Jan', joined: 0, resigned: 0 },
  { month: 'Feb', joined: 10, resigned: 0 },
  { month: 'Mar', joined: 19, resigned: 0 },
  { month: 'Apr', joined: 12, resigned: 1 },
  { month: 'May', joined: 18, resigned: 6 },
  { month: 'Jun', joined: 18, resigned: 6 },
  { month: 'Jul', joined: 2, resigned: 4 },
  { month: 'Aug', joined: 1, resigned: 1 },
];

const divisionData = [
  { division: 'Engineering', count: 56 },
  { division: 'Sales', count: 34 },
  { division: 'HR', count: 18 },
  { division: 'Finance', count: 12 },
  { division: 'Operations', count: 28 },
];

const ageDistributionData = [
  { age: '< 20', employees: 16 },
  { age: '20-25', employees: 15 },
  { age: '25-30', employees: 5 },
  { age: '30-35', employees: 3 },
  { age: '35-40', employees: 1 },
  { age: '> 50', employees: 0 },
];

const salaryRevisionData = [
  { month: '< 6', employees: 7 },
  { month: '>30', employees: 0 },
];

const genderData = [
  { label: 'Male', value: 27, color: '#1c9c6e' },
  { label: 'Female', value: 15, color: '#e05c8a' },
  { label: 'Not Available', value: 0, color: '#3b82f6' },
];

const ctcMonthlyData = [
  { month: 'Feb 2026', ctc: 410000 },
  { month: 'Mar 2026', ctc: 632000 },
  { month: 'Apr 2026', ctc: 755000 },
  { month: 'May 2026', ctc: 863500 },
  { month: 'Jun 2026', ctc: 927500 },
];

const ctcByLocationData = [
  { location: 'AHMEDABAD', ctc: 927500, employees: 56 },
];

const leaveTakerData = [
  { empNo: 'GM015', name: 'Nandani Devani', day: 1 },
  { empNo: 'GM019', name: 'Ayushi Patel', day: 1 },
  { empNo: 'GM014', name: 'Nishtha Ramani', day: 1 },
  { empNo: 'GM003', name: 'Ajay Rana', day: 1 },
  { empNo: 'GM021', name: 'Sonal Panchal', day: 0.5 },
];

export default function Dashboard() {
  return (
    <>
      {/* Analytics Charts */}
        <h2 className="gm-bento-heading">Analytics</h2>
        <div className="gm-charts-grid">
          {/* Years In Service Distribution */}
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Years In Service Distribution</h3>
            <SvgLineChart
              data={yearsInServiceData}
              xKey="year"
              lines={[{ key: 'employees', name: 'Employees', color: '#1c9c6e' }]}
              xLabel="Years"
              yLabel="Employees"
              height={240}
            />
          </div>

          {/* Additions & Attrition */}
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Additions &amp; Attrition</h3>
            <p className="gm-chart-subtitle">September 2025 to August 2026</p>
            <SvgLineChart
              data={additionsAttritionData}
              xKey="month"
              lines={[
                { key: 'joined', name: 'Joined', color: '#1c9c6e' },
                { key: 'resigned', name: 'Resigned', color: '#ef4444' },
              ]}
              xLabel=""
              yLabel="Employees"
              height={240}
            />
          </div>
        </div>

        {/* Row 2: Employee Count By Division + Age Distribution */}
        <div className="gm-charts-grid">
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Employee Count By Division</h3>
            <SvgBarChart
              data={divisionData}
              labelKey="division"
              valueKey="count"
              color="#1c9c6e"
              height={240}
            />
          </div>
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Age Distribution</h3>
            <SvgLineChart
              data={ageDistributionData}
              xKey="age"
              lines={[{ key: 'employees', name: 'Employees', color: '#1c9c6e' }]}
              xLabel="Age"
              yLabel="Employees"
              height={240}
            />
          </div>
        </div>

        {/* Row 3: Salary Revision Frequency + Gender Distribution */}
        <div className="gm-charts-grid">
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Salary Revision Frequency</h3>
            <SvgLineChart
              data={salaryRevisionData}
              xKey="month"
              lines={[{ key: 'employees', name: 'Employees', color: '#1c9c6e' }]}
              xLabel="Month"
              yLabel="Employees"
              height={240}
            />
          </div>
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Gender Distribution - Current Employees</h3>
            <SvgPieChart
              data={genderData}
              labelKey="label"
              valueKey="value"
              height={240}
            />
          </div>
        </div>

        {/* Row 4: Last 5 Months Monthly CTC + CTC By Location Table */}
        <div className="gm-charts-grid">
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Last 5 Months MONTHLY CTC</h3>
            <SvgVBarChart
              data={ctcMonthlyData}
              xKey="month"
              valueKey="ctc"
              color="#1c9c6e"
              height={240}
            />
          </div>
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">MONTHLY CTC By Location</h3>
            <div className="gm-ctc-table-wrap">
              <table className="gm-ctc-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>MONTHLY CTC</th>
                    <th>No of Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {ctcByLocationData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.location}</td>
                      <td>{row.ctc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>{row.employees}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="gm-ctc-total">
                    <td><strong>Total</strong></td>
                    <td><strong>{ctcByLocationData.reduce((s, r) => s + r.ctc, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                    <td><strong>{ctcByLocationData.reduce((s, r) => s + r.employees, 0)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Row 5: Top 5 Leave Taker Table */}
        <div className="gm-charts-grid">
          <div className="gm-chart-card">
            <h3 className="gm-chart-title">Top 5 Leave Taker for CLSL</h3>
            <p className="gm-chart-subtitle">01 Jul 2026 to 31 Aug 2026</p>
            <div className="gm-ctc-table-wrap">
              <table className="gm-leave-table">
                <thead>
                  <tr>
                    <th>Emp No.</th>
                    <th>Name</th>
                    <th>Day</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTakerData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.empNo}</td>
                      <td>{row.name}</td>
                      <td>{row.day}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  );
}