import { useMemo } from 'react';
import type { LoanInfo, Payment, AmortizationEntry, LoanSummary, ChartDataPoint } from '../types';

// Rule of 78 Calculation Logic for AITAB
const calculateAitabSchedule = (loanInfo: LoanInfo): AmortizationEntry[] => {
  const { tenureMonths, monthlyInstalment, totalUnearnedProfit, principal, firstPaymentDate } = loanInfo;
  
  const sumOfDigits = (tenureMonths * (tenureMonths + 1)) / 2;
  const schedule: AmortizationEntry[] = [];
  let currentPrincipal = principal;
  let currentProfit = totalUnearnedProfit;

  const firstPayment = new Date(`${firstPaymentDate}T00:00:00Z`); // Treat as UTC

  for (let i = 1; i <= tenureMonths; i++) {
    const profitPortion = ((tenureMonths - i + 1) / sumOfDigits) * totalUnearnedProfit;
    const principalPortion = monthlyInstalment - profitPortion;

    currentPrincipal -= principalPortion;
    currentProfit -= profitPortion;
    
    // Calculate payment date by adding months to the first payment date
    const paymentDate = new Date(firstPayment);
    paymentDate.setUTCMonth(paymentDate.getUTCMonth() + i - 1);

    schedule.push({
      month: i,
      paymentDate: paymentDate.toISOString().split('T')[0], // YYYY-MM-DD format
      monthlyInstalment,
      principalComponent: principalPortion,
      profitComponent: profitPortion,
      remainingPrincipal: Math.max(0, currentPrincipal),
      remainingProfit: Math.max(0, currentProfit),
      totalOutstanding: Math.max(0, currentPrincipal + currentProfit),
      paid: false,
      paidAmount: 0,
    });
  }
  
  // Adjust last month to ensure balances are zero
  if(schedule.length > 0){
      const lastEntry = schedule[schedule.length - 1];
      const principalAdjustment = lastEntry.remainingPrincipal;
      lastEntry.principalComponent += principalAdjustment;
      lastEntry.remainingPrincipal = 0;
      
      const profitAdjustment = lastEntry.remainingProfit;
      lastEntry.profitComponent += profitAdjustment;
      lastEntry.remainingProfit = 0;

      lastEntry.totalOutstanding = 0;
  }

  return schedule;
};


export const useAitabLoan = (loanInfo: LoanInfo, payments: Payment[]) => {
  const processedLoanData = useMemo(() => {
    const baseSchedule = calculateAitabSchedule(loanInfo);
    const updatedSchedule = [...baseSchedule.map(entry => ({ ...entry }))];

    let principalPaid = 0;
    let profitPaid = 0;
    
    const sortedPayments = [...payments].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());

    sortedPayments.forEach(payment => {
        const nextUnpaidEntry = updatedSchedule.find(e => !e.paid);
        if (nextUnpaidEntry) {
            nextUnpaidEntry.paid = true;
            nextUnpaidEntry.paidAmount = payment.amount;
            nextUnpaidEntry.paymentId = payment.id;
            nextUnpaidEntry.actualPaymentDate = payment.paymentDate; // Record the actual payment date
            principalPaid += nextUnpaidEntry.principalComponent;
            profitPaid += nextUnpaidEntry.profitComponent;

            // Handle overpayment/underpayment if necessary in a more complex scenario
            // For now, we just mark one installment as paid per payment
        }
    });

    const firstUnpaidEntry = updatedSchedule.find(e => !e.paid);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalLoanAmount = loanInfo.principal + loanInfo.totalUnearnedProfit;
    const outstandingBalance = totalLoanAmount - totalPaid;

    const remainingMonths = updatedSchedule.filter(e => !e.paid).length;
    
    const nextPaymentDate = firstUnpaidEntry
      ? new Date(`${firstUnpaidEntry.paymentDate}T00:00:00Z`) // Use UTC to avoid timezone shift
      : null;

    const summary: LoanSummary = {
        outstandingBalance,
        remainingMonths,
        totalTenureMonths: loanInfo.tenureMonths,
        nextPaymentDueDate: nextPaymentDate
          ? nextPaymentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
          : 'Fully Paid',
        totalPaid,
        principalPaid,
        profitPaid,
        totalPrincipal: loanInfo.principal,
        totalProfit: loanInfo.totalUnearnedProfit,
        remainingPrincipal: loanInfo.principal - principalPaid,
        remainingProfit: loanInfo.totalUnearnedProfit - profitPaid,
    };
    
    const scheduleWithInitialState = [...updatedSchedule];
    const initialEntry: AmortizationEntry = {
      month: 0,
      paymentDate: '',
      monthlyInstalment: 0,
      principalComponent: 0,
      profitComponent: 0,
      remainingPrincipal: loanInfo.principal,
      remainingProfit: loanInfo.totalUnearnedProfit,
      totalOutstanding: loanInfo.principal + loanInfo.totalUnearnedProfit,
      paid: false,
      paidAmount: 0,
    };
    scheduleWithInitialState.unshift(initialEntry);

    let cumulativeInstalment = 0;
    let cumulativePaid = 0;
    const chartData: ChartDataPoint[] = scheduleWithInitialState.map(entry => {
      cumulativeInstalment += entry.monthlyInstalment;
      cumulativePaid += entry.paidAmount;
      return {
        month: entry.month,
        name: `M${entry.month}`,
        cumulativeInstalment,
        cumulativePaid,
        remainingBalance: entry.totalOutstanding,
      };
    });

    return { schedule: scheduleWithInitialState, summary, chartData };
  }, [loanInfo, payments]);

  return processedLoanData;
};