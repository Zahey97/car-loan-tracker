export interface LoanInfo {
  bankName: string;
  accountPreferredName: string;
  accountNo: string;
  productType: string;
  vehicleNo: string;
  profitRate: number;
  tenureMonths: number;
  monthlyInstalment: number;
  paymentDueDate: number;
  firstPaymentDate: string; // YYYY-MM-DD
  totalUnearnedProfit: number;
  principal: number;
}

export interface AmortizationEntry {
  month: number;
  paymentDate: string; // This is the due date
  monthlyInstalment: number;
  principalComponent: number;
  profitComponent: number;
  remainingPrincipal: number;
  remainingProfit: number;
  totalOutstanding: number;
  paid: boolean;
  paidAmount: number;
  actualPaymentDate?: string; // The date the payment was actually made
  paymentId?: string;
}

export interface Payment {
  id: string;
  paymentDate: string; // YYYY-MM-DD
  amount: number;
  notes?: string;
  fileName?: string;
}

export interface LoanSummary {
  outstandingBalance: number;
  remainingMonths: number;
  totalTenureMonths: number;
  nextPaymentDueDate: string;
  totalPaid: number;
  principalPaid: number;
  profitPaid: number;
  totalPrincipal: number;
  totalProfit: number;
  remainingPrincipal: number;
  remainingProfit: number;
}

export type Tab = 'dashboard' | 'schedule' | 'history' | 'profile';

export interface ChartDataPoint {
  month: number;
  name: string;
  cumulativeInstalment: number;
  cumulativePaid: number;
  remainingBalance: number;
}

export interface User {
    name: string;
    email: string;
    photoURL: string;
}