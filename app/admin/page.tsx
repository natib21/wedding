"use client";

import { useState, useEffect } from 'react';
import { Plus, Users, CheckCircle, Clock, Link as LinkIcon, Phone, User, Share2 } from 'lucide-react';

export default function AdminDashboard() {
  const [invites, setInvites] = useState<any[]>([]);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchInvites = async () => {
    try {
      const res = await fetch('/api/invites');
      const data = await res.json();
      if (Array.isArray(data)) setInvites(data);
    } catch (error) {
      console.error('Failed to fetch invites', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ fullName: '', phoneNumber: '' });
        fetchInvites();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add guest');
      }
    } catch (error) {
      alert('Error adding guest');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Invitation link copied!');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Mobile-Optimized Header */}
      <header className="bg-white border-b border-slate-200 px-4 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">Guest Management</h1>
          <p className="text-slate-500 text-sm mb-6">Wedding Registry</p>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total</p>
              <p className="text-xl font-black">{invites.length}</p>
            </div>
            <div className="flex-1 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Attended</p>
              <p className="text-xl font-black text-emerald-600">
                {invites.filter(i => i.status === 'attended').length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section - Stacked on Mobile */}
        <section className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Add New Guest
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block ml-1">Guest Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="Amharic or English name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="+251..."
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
              <button 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Generate Invitation'}
              </button>
            </form>
          </div>
        </section>

        {/* Guest List - Cards on Mobile, Table on Desktop */}
       <section className="lg:col-span-2">
  <div className="flex items-center justify-between mb-6 px-2">
    <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
      <Users className="w-6 h-6 text-indigo-600" />
      Registry
    </h2>
    <span className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
      {invites.length} Total Guests
    </span>
  </div>

  {isFetching ? (
    <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-sm">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full mb-4" />
        <p className="font-medium">Loading guest list...</p>
      </div>
    </div>
  ) : invites.length === 0 ? (
    <div className="bg-white rounded-3xl p-16 text-center text-slate-400 border border-slate-200 shadow-sm">
      <User className="w-16 h-16 mx-auto mb-4 opacity-10" />
      <p className="text-lg font-medium">No guests registered yet.</p>
    </div>
  ) : (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invites.map((invite) => (
              <tr key={invite._id} className="hover:bg-slate-50/80 transition-colors group">
                {/* Guest Profile */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                      invite.status === 'attended' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {invite.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-bold text-slate-900">{invite.fullName}</div>
                  </div>
                </td>

                {/* Contact - Hidden on mobile, shown in Profile on mobile if preferred */}
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {invite.phoneNumber}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex">
                    {invite.status === 'attended' ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Attended
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => copyLink(invite.slug)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
                    title="Copy Invitation Link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</section>
      </main>
    </div>
  );
}