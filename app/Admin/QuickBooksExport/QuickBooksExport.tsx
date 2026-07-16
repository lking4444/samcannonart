'use client';

import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';
import styles from './QuickBooksExport.module.css';

import 'react-datepicker/dist/react-datepicker.css';

type OrderForExport = {
  value: string | number;
  currency?: string;
  status?: string;
  paidAt?: Date | string | null;
  createdAt?: Date | string | null;
};

type QuickBooksExportProps = {
  orders: OrderForExport[];
};

function toDate(value?: Date | string | null): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(value: Date): string {
  return value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function QuickBooksExport({ orders }: QuickBooksExportProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (order.status && order.status !== 'PAID') {
        return false;
      }

      const paidAt = toDate(order.paidAt);

      if (!paidAt) {
        return false;
      }

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (paidAt < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (paidAt > end) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate]);

  function handleExport() {
    setError('');

    if (startDate && endDate && startDate > endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    if (filteredOrders.length === 0) {
      setError('No paid orders found for this date range.');
      return;
    }

    const rows = filteredOrders.map((order) => {
      const paidAt = toDate(order.paidAt);

      return {
        Description: 'Customer payment',
        Amount: Number.parseFloat(String(order.value)) / 100,
        Date: paidAt ? formatDateOnly(paidAt) : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: ['Description', 'Amount', 'Date'],
    });

    worksheet['!cols'] = [
      { wch: 24 },
      { wch: 14 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Order History');

    const fileNameParts = ['order-history'];

    if (startDate) fileNameParts.push(`from-${formatDateOnly(startDate).replaceAll('/', '-')}`);
    if (endDate) fileNameParts.push(`to-${formatDateOnly(endDate).replaceAll('/', '-')}`);

    XLSX.writeFile(workbook, `${fileNameParts.join('-')}.xlsx`);
  }

  return (
    <section className={styles.exportBox}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Export order history</h2>
          <p className={styles.subtitle}>
            Export paid orders to an Excel spreadsheet.
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>Start date</span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select start date"
            className={styles.input}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.datePickerWrapper}
            popperClassName={styles.datePickerPopper}
            shouldCloseOnSelect
            popperPlacement="bottom-start"
            popperProps={{
                strategy: 'fixed',
            }}
            />
        </label>
        <label className={styles.field}>
        <span>End date</span>
        <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate? startDate: undefined}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select end date"
            className={styles.input}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.datePickerWrapper}
            popperClassName={styles.datePickerPopper}
            shouldCloseOnSelect
            popperPlacement="bottom-start"
            popperProps={{
            strategy: 'fixed',
            }}
        />
        </label>

        <button
          type="button"
          onClick={handleExport}
          className={styles.button}
        >
          Export Excel
        </button>
      </div>

      <div className={styles.meta}>
        {filteredOrders.length} paid order{filteredOrders.length === 1 ? '' : 's'} selected
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}