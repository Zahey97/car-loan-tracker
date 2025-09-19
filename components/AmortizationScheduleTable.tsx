
import React from 'react';
import type { AmortizationEntry } from '../types';
import Card from './Card';

interface AmortizationScheduleTableProps {
  schedule: AmortizationEntry[];
}

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    // The date from the hook is already in 'en-CA' format (YYYY-MM-DD)
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent date changes
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const AmortizationScheduleTable: React.FC<AmortizationScheduleTableProps> = ({ schedule }) => {
  return (
    <Card title="Amortization Schedule">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Instalment</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Paid</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {schedule.map((entry) => (
              <tr key={entry.month} className={`${entry.month === 0 ? 'bg-slate-50 font-medium' : (entry.paid ? 'bg-green-50' : '')} hover:bg-slate-100`}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{entry.month === 0 ? 'Initial' : entry.month}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{entry.month === 0 ? ' - ' : formatDate(entry.paymentDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{entry.month === 0 ? ' - ' : currencyFormatter.format(entry.monthlyInstalment)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700">{entry.month === 0 ? ' - ' : (entry.paid ? currencyFormatter.format(entry.paidAmount) : '-')}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{entry.month === 0 ? ' - ' : formatDate(entry.actualPaymentDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-800">{currencyFormatter.format(entry.totalOutstanding)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {entry.month === 0 ? (
                    ' - '
                  ) : entry.paid ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Due</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AmortizationScheduleTable;