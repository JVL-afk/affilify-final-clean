'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  plan: string;
  websiteCount: number;
  createdAt: string;
  lastLoginAt: string;
}

interface Stats {
  totalWebsiteGenerations: number;
  totalClicks: number;
  totalRevenue: number;
  totalConversions: number;
  conversionRate: string;
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setStats(data.stats);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-orange-600 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!userInfo || !stats) {
    return null;
  }

  const userFirstName = userInfo.name ? userInfo.name.split(' ')[0] : 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-orange-600 to-black text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm p-4 border-b border-orange-500/20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AFFILIFY</h1>
          <div className="flex items-center space-x-4">
            <span className="text-orange-200">Welcome, {userFirstName}!</span>
            <Link href="/api/auth/logout" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-2">Welcome back, {userFirstName}! 👋</h2>
        <p className="text-orange-200 text-lg mb-8">You have {stats.totalWebsiteGenerations} websites generating ${stats.totalRevenue.toFixed(2)} in revenue!</p>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <h3 className="text-purple-300 text-lg font-semibold mb-2">Total Websites</h3>
            <p className="text-4xl font-bold text-white">{stats.totalWebsiteGenerations}</p>
            <p className="text-sm text-orange-200">0 active</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <h3 className="text-purple-300 text-lg font-semibold mb-2">Total Clicks</h3>
            <p className="text-4xl font-bold text-white">{stats.totalClicks}</p>
            <p className="text-sm text-orange-200">0 this week</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <h3 className="text-purple-300 text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-orange-200">$0.00 this week</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <h3 className="text-purple-300 text-lg font-semibold mb-2">Conversion Rate</h3>
            <p className="text-4xl font-bold text-white">{stats.conversionRate}%</p>
            <p className="text-sm text-orange-200">{stats.totalConversions} conversions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/create-website" className="bg-orange-600 hover:bg-orange-700 rounded-xl p-6 transition-all duration-200 block">
                <h4 className="text-xl font-semibold text-white">Create Website</h4>
                <p className="text-orange-200">Generate a new affiliate website with AI</p>
            </Link>
            <Link href="/dashboard/analyze-website" className="bg-purple-600 hover:bg-purple-700 rounded-xl p-6 transition-all duration-200 block">
                <h4 className="text-xl font-semibold text-white">Analyze Website</h4>
                <p className="text-purple-200">Get AI insights on any website</p>
            </Link>
            <Link href="/dashboard/my-websites" className="bg-green-600 hover:bg-green-700 rounded-xl p-6 transition-all duration-200 block">
                <h4 className="text-xl font-semibold text-white">My Websites</h4>
                <p className="text-green-200">View and manage your affiliate sites</p>
            </Link>
        </div>

        {/* Account Info */}
        <h3 className="text-2xl font-bold mb-4">Account Info</h3>
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-purple-300 font-semibold">Email</p>
            <p className="text-white">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-purple-300 font-semibold">Member Since</p>
            <p className="text-white">{new Date(userInfo.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-purple-300 font-semibold">Last Active</p>
            <p className="text-white">{new Date(userInfo.lastLoginAt).toLocaleString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

