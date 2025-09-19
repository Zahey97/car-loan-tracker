import React from 'react';
import type { User } from '../types';
import GoogleIcon from './icons/GoogleIcon';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleLogin = () => {
    // This is a mock login. In a real app, this would trigger the Google OAuth flow.
    const mockUser: User = {
      name: 'Aiman',
      email: 'aiman@gmail.com',
      photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Aiman`,
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Mitsubishi Xpander Loan Tracker</h1>
        <p className="text-slate-600 mb-8">Please sign in to continue</p>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg hover:bg-slate-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;