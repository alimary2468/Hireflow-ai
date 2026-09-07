import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Mail, Sparkles, Award } from 'lucide-react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.warn('Notifications load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filtered = filter === 'UNREAD' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-400">Audit log of AI agent screening events, strong candidate detections, and emails.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${filter === 'UNREAD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 glass-card rounded-3xl">
            No notifications to display.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                item.read ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-blue-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${item.type.includes('STRONG') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                  {item.type.includes('STRONG') ? <Award className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => handleMarkRead(item.id)}
                  className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold shrink-0 transition"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
