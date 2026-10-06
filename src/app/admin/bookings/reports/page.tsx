'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MusicLoader from '@/components/ui/MusicLoader';
import {
  Download,
  Printer,
  ArrowLeft,
  Search,
  Filter,
  RotateCcw,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MONTH_OPTIONS = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function ShowEarningsReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedYear) params.append('year', selectedYear);
      if (selectedMonth) params.append('month', selectedMonth);
      const url = `/api/admin/reports/earnings${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching earnings report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (val: number) => {
    return `BDT ${Number(val || 0).toLocaleString('en-US')}`;
  };

  // Filter shows on client side for responsive search & status
  const filteredShows = (data?.shows || []).filter((s: any) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchOrg = (s.organization || '').toLowerCase().includes(q);
      const matchVenue = (s.venue || '').toLowerCase().includes(q);
      const matchCity = (s.city || '').toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchVenue && !matchCity) return false;
    }
    return true;
  });

  const totalDealValue = filteredShows.reduce((acc: number, s: any) => acc + (s.dealValue || 0), 0);
  const totalEarned = filteredShows.reduce((acc: number, s: any) => acc + (s.earnedAmount || 0), 0);
  const totalRetained = filteredShows
    .filter((s: any) => s.status === 'CANCELLED')
    .reduce((acc: number, s: any) => acc + (s.retainedAmount || 0), 0);

  const handleDownloadCSV = () => {
    if (!filteredShows.length) return;

    const headers = [
      'SL',
      'Transaction Date',
      'Show / Client Description',
      'Organization',
      'Venue',
      'City',
      'Event Type',
      'Status',
      'Agreed Deal Value (BDT)',
      'Net Amount Received / Earned (BDT)',
      'Retained Advance (BDT)',
      'Settlement Remarks'
    ];

    const rows = filteredShows.map((s: any, idx: number) => [
      idx + 1,
      `"${s.date || 'TBA'}"`,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${(s.organization || '').replace(/"/g, '""')}"`,
      `"${(s.venue || '').replace(/"/g, '""')}"`,
      `"${(s.city || '').replace(/"/g, '""')}"`,
      `"${s.eventType || ''}"`,
      `"${s.status || ''}"`,
      s.dealValue || 0,
      s.earnedAmount || 0,
      s.retainedAmount || 0,
      `"${s.status === 'CONFIRMED' ? 'Confirmed & Fully Settled' : s.status === 'CANCELLED' ? `Cancelled - Retained BDT ${s.retainedAmount || 0}` : 'Pending Negotiation'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `BIDDROHO_Transaction_Report_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    try {
      const reportElement = document.querySelector('.transaction-report-paper');
      if (!reportElement) {
        window.print();
        return;
      }

      let iframe = document.getElementById('report-clean-print-frame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.remove();
      }

      iframe = document.createElement('iframe');
      iframe.id = 'report-clean-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1000px';
      iframe.style.height = '1000px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document;
      if (!frameDoc || !iframe.contentWindow) {
        window.print();
        return;
      }

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>BIDDROHO - Transaction Report</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet">
            <style>
              @page {
                size: A4 portrait;
                margin: 15mm 18mm;
              }
              *, *::before, *::after {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              html, body {
                color-scheme: light !important;
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #111827 !important;
                margin: 0 !important;
                padding: 4mm 6mm !important;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                font-size: 10pt;
                line-height: 1.4;
              }
              .transaction-report-paper {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                border: none !important;
                box-shadow: none !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
              }
              tr {
                page-break-inside: avoid !important;
              }
            </style>
          </head>
          <body>
            ${reportElement.outerHTML}
          </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        if (!iframe?.contentWindow) return;
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 300);
    } catch (err) {
      console.error('Print iframe error:', err);
      window.print();
    }
  };

  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedMonth('');
    setStatusFilter('');
    setSearch('');
  };

  const hasActiveFilters = Boolean(selectedYear || selectedMonth || statusFilter || search);

  // Formatted date range label for the report header
  const getReportingPeriodLabel = () => {
    const monthObj = MONTH_OPTIONS.find((m) => m.value === selectedMonth);
    const monthLabel = monthObj && monthObj.value ? monthObj.label : '';

    if (monthLabel && selectedYear) {
      return `${monthLabel} ${selectedYear}`;
    }
    if (selectedYear && !monthLabel) {
      return `Full Year ${selectedYear} (Jan 1 – Dec 31)`;
    }
    if (monthLabel && !selectedYear) {
      return `All Transactions in ${monthLabel} (All Years)`;
    }
    return 'All Recorded Transactions (Complete Ledger)';
  };

  return (
    <div className="reports-page-wrapper" style={{ padding: '24px 28px', minHeight: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 18mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 4mm 6mm !important;
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          body::before {
            display: none !important;
          }
          aside, header, nav, .screen-only-toolbar, .no-print {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .admin-root-layout,
          .admin-main-container,
          .reports-page-wrapper {
            display: block !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }
          .transaction-report-paper {
            display: block !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 4mm 6mm !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          .transaction-report-paper * {
            border: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
          }
        }
      ` }} />

      {/* ============================================================ */}
      {/* SCREEN-ONLY TOOLBAR & CONTROLS (Disappears on Print)          */}
      {/* ============================================================ */}
      <div
        className="screen-only-toolbar no-print"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {/* Top Bar: Navigation & Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/admin/bookings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '36px',
                padding: '0 12px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#d4d4d8',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to CRM</span>
            </Link>

            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#f4f4f5', margin: 0, letterSpacing: '0.02em' }}>
                Transaction & Earnings Statement
              </h1>
              <p style={{ fontSize: '11px', color: '#71717a', margin: 0, marginTop: '2px' }}>
                Financial accounting statement of concert deals, paid contracts, and retained cancellation deposits.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                height: '36px',
                padding: '0 15px',
                backgroundColor: '#27272a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                height: '36px',
                padding: '0 15px',
                backgroundColor: '#e11d48',
                border: 'none',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Month Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600 }}>Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f4f4f5',
                  borderRadius: '4px',
                  padding: '0 10px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600 }}>Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f4f4f5',
                  borderRadius: '4px',
                  padding: '0 10px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Years</option>
                {(data?.availableYears || [new Date().getFullYear().toString()]).map((yr: string) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600 }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: '32px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f4f4f5',
                  borderRadius: '4px',
                  padding: '0 10px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED (Earned)</option>
                <option value="CANCELLED">CANCELLED (Retained Advance)</option>
                <option value="NEW">NEW (Inquiry)</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#71717a'
                }}
              />
              <input
                type="text"
                placeholder="Search show, venue, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  padding: '0 10px 0 30px',
                  fontSize: '12px',
                  color: '#f4f4f5',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                height: '32px',
                padding: '0 10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={11} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* THE OFFICIAL TRANSACTION REPORT (Visual on Screen & Printed) */}
      {/* ============================================================ */}
      <div
        className="transaction-report-paper"
        style={{
          backgroundColor: '#ffffff',
          color: '#111827',
          borderRadius: '4px',
          padding: '36px 42px',
          maxWidth: '1200px',
          margin: '0 auto',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
      >
        {/* 1. BAND NAME & INFO HEADER SECTION */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '20px',
            marginBottom: '18px'
          }}
        >
          {/* Band Identity */}
          <div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: '#000000',
                fontFamily: "'Bebas Neue', 'Syne', sans-serif"
              }}
            >
              BIDDROHO
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#4b5563',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '4px'
              }}
            >
              Heavy Rock Band • Commercial Operations & CRM Desk
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', lineHeight: '1.4' }}>
              Dhaka, Bangladesh • Official Website: biddroho.com<br />
              Commercial & Booking Desk: booking@biddroho.com
            </div>
          </div>

          {/* Statement Ref & Meta */}
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#374151', lineHeight: '1.6' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '4px' }}>
              TRANSACTION REPORT
            </div>
            <div>
              <strong>Statement Ref:</strong> BID-TRX-{selectedYear || 'ALL'}
              {selectedMonth ? `-${selectedMonth}` : ''}
            </div>
            <div>
              <strong>Generated:</strong>{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <strong>Currency:</strong> BDT (Bangladeshi Taka)
            </div>
            {statusFilter && (
              <div>
                <strong>Scope:</strong> {statusFilter} Only
              </div>
            )}
          </div>
        </div>

        {/* 2. REPORT DATE RANGE & SCOPE SECTION */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '4px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
              Reporting Period & Date Range
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {getReportingPeriodLabel()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, color: '#64748b' }}>
                Total Transactions
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                {filteredShows.length} Shows
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, color: '#64748b' }}>
                Net Band Revenue
              </div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#047857' }}>
                {formatCurrency(totalEarned)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. TRANSACTION TABLE */}
        <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              textAlign: 'left'
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155'
                }}
              >
                <th style={{ padding: '10px 8px', fontWeight: 800, width: '28px' }}>#</th>
                <th style={{ padding: '10px 8px', fontWeight: 800, width: '85px' }}>Date</th>
                <th style={{ padding: '10px 10px', fontWeight: 800 }}>Show / Client Description</th>
                <th style={{ padding: '10px 10px', fontWeight: 800 }}>Venue & City</th>
                <th style={{ padding: '10px 8px', fontWeight: 800, width: '80px' }}>Type</th>
                <th style={{ padding: '10px 8px', fontWeight: 800, width: '85px' }}>Status</th>
                <th style={{ padding: '10px 10px', fontWeight: 800, textAlign: 'right', width: '105px' }}>Contract Deal</th>
                <th style={{ padding: '10px 10px', fontWeight: 800, textAlign: 'right', width: '115px' }}>Net Received</th>
                <th style={{ padding: '10px 10px', fontWeight: 800, width: '170px' }}>Settlement Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center' }}>
                    <MusicLoader text="READING SHOW FINANCIALS & SETTLEMENTS..." size="compact" />
                  </td>
                </tr>
              ) : filteredShows.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    No transactions found for the selected period ({getReportingPeriodLabel()}).
                  </td>
                </tr>
              ) : (
                filteredShows.map((s: any, idx: number) => {
                  const isConfirmed = s.status === 'CONFIRMED';
                  const isCancelled = s.status === 'CANCELLED';

                  return (
                    <tr
                      key={s.id || idx}
                      style={{
                        pageBreakInside: 'avoid',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      <td style={{ padding: '10px 8px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {s.date || 'TBA'}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{s.title}</div>
                        {s.organization && (
                          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{s.organization}</div>
                        )}
                      </td>
                      <td style={{ padding: '10px 10px', color: '#334155' }}>
                        <div style={{ fontWeight: 500 }}>{s.venue}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{s.city}</div>
                      </td>
                      <td style={{ padding: '10px 8px', color: '#475569', fontSize: '10px' }}>
                        {s.eventType || 'Concert'}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '9px',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            backgroundColor: isConfirmed ? '#dcfce7' : isCancelled ? '#fee2e2' : '#fef3c7',
                            color: isConfirmed ? '#166534' : isCancelled ? '#991b1b' : '#92400e'
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#0f172a',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {s.dealValue > 0 ? formatCurrency(s.dealValue) : (s.rawBudget || '-')}
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: s.earnedAmount > 0 ? '#047857' : '#64748b',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {s.earnedAmount > 0 ? formatCurrency(s.earnedAmount) : 'BDT 0'}
                      </td>
                      <td style={{ padding: '10px 10px', fontSize: '10px', color: '#475569', lineHeight: '1.3' }}>
                        {isConfirmed && '✓ 100% Contract Agreed & Earned'}
                        {isCancelled && (
                          s.retainedAmount > 0
                            ? `+ BDT ${Number(s.retainedAmount).toLocaleString()} retained advance kept (deficit: - BDT ${Math.max(0, s.dealValue - s.retainedAmount).toLocaleString()})`
                            : 'Cancelled (Full fee forfeited)'
                        )}
                        {!isConfirmed && !isCancelled && 'Contract inquiry in negotiation'}
                        {s.cancellationReason && (
                          <div style={{ fontStyle: 'italic', color: '#991b1b', marginTop: '2px' }}>
                            Reason: {s.cancellationReason}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr
                style={{
                  backgroundColor: '#f1f5f9',
                  fontWeight: 800,
                  color: '#0f172a'
                }}
              >
                <td
                  colSpan={6}
                  style={{
                    padding: '12px 10px',
                    textAlign: 'right',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontSize: '11px'
                  }}
                >
                  Totals For Period ({filteredShows.length} Shows):
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {formatCurrency(totalDealValue)}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    textAlign: 'right',
                    color: '#047857',
                    fontSize: '12px',
                    fontWeight: 900,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatCurrency(totalEarned)}
                </td>
                <td style={{ padding: '12px 10px', fontSize: '10px', color: '#334155' }}>
                  {totalRetained > 0 && `(Incl. BDT ${totalRetained.toLocaleString()} retained advance)`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. VERIFICATION, AUDIT & STAMP FOOTER */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            fontSize: '11px',
            color: '#334155',
            pageBreakInside: 'avoid'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '36px', letterSpacing: '0.04em' }}>
              PREPARED BY:
            </div>
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', marginBottom: '6px' }}></div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>BIDDROHO Operations & Accounts Desk</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Date: {new Date().toLocaleDateString()}</div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '36px', letterSpacing: '0.04em' }}>
              AUDITED & APPROVED BY:
            </div>
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', marginBottom: '6px' }}></div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>Band Management / Lead Executive</div>
            <div style={{ color: '#64748b', fontSize: '10px' }}>Authorized Commercial Signatory</div>
          </div>

          <div
            style={{
              borderRadius: '4px',
              padding: '14px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}
          >
            <div style={{ fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em', fontSize: '10px' }}>
              [ OFFICIAL BAND SEAL ]
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
              BIDDROHO Heavy Rock Band<br />Certified Booking & Revenue Ledger
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
