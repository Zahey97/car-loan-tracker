import React from 'react';
import type { User, LoanInfo } from '../types';
import Card from './Card';

interface ProfileProps {
  user: User;
  loanInfo: LoanInfo;
}

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
});

const Profile: React.FC<ProfileProps> = ({ user, loanInfo }) => {
  const totalLoan = loanInfo.principal + loanInfo.totalUnearnedProfit;

  return (
    <div className="space-y-6">
      <Card title="User Profile">
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="h-16 w-16 rounded-full bg-slate-200"
          />
          <div>
            <p className="text-lg font-bold text-slate-800">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </Card>

      <Card title={`Loan Details: ${loanInfo.vehicleNo}`}>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Bank:</span>
            <span className="font-medium text-slate-800">{loanInfo.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account Name:</span>
            <span className="font-medium text-slate-800">{loanInfo.accountPreferredName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account No:</span>
            <span className="font-medium text-slate-800">{loanInfo.accountNo}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-slate-500">Product Type:</span>
            <span className="font-medium text-slate-800">{loanInfo.productType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Profit Rate:</span>
            <span className="font-medium text-slate-800">{loanInfo.profitRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tenure:</span>
            <span className="font-medium text-slate-800">{loanInfo.tenureMonths} Months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Monthly Instalment:</span>
            <span className="font-medium text-slate-800">{currencyFormatter.format(loanInfo.monthlyInstalment)}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-slate-500">Payment Due Date:</span>
            <span className="font-medium text-slate-800">{loanInfo.paymentDueDate}th of each month</span>
          </div>
        </div>
      </Card>

       <Card title="Financial Summary">
        <div className="space-y-3">
            <div className="flex justify-between">
                <span className="text-slate-500">FN Release (Principal):</span>
                <span className="font-medium text-slate-800">{currencyFormatter.format(loanInfo.principal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">DR Unearned Profit:</span>
                <span className="font-medium text-slate-800">{currencyFormatter.format(loanInfo.totalUnearnedProfit)}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between text-lg">
                <span className="font-semibold text-slate-600">Total Loan:</span>
                <span className="font-bold text-blue-700">{currencyFormatter.format(totalLoan)}</span>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;