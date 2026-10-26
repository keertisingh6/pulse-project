import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Bell,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setCurrentView,
    showToast
  } = usePulse();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.actionView) {
      setCurrentView(notif.actionView);
      onClose();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl border-l border-[#E8E2D5] flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF4EE] text-[#236B43] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E2621]">Notifications & Alerts</h3>
                <p className="text-[11px] text-[#7A837C] font-mono">
                  {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] font-bold text-[#1E3A2B] hover:underline"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#F2ECE1] text-[#8C958E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {notifications.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 ${
                  item.read
                    ? 'bg-[#FBF9F5] border-[#EDE8DE] opacity-75'
                    : 'bg-[#FEFDF9] border-[#E0D9CB] shadow-2xs hover:border-[#1E3A2B]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.type === 'deadline'
                      ? 'bg-[#FDF0ED] text-[#C34E32]'
                      : item.type === 'exam'
                      ? 'bg-[#FEF7E6] text-[#A1741F]'
                      : item.type === 'habit'
                      ? 'bg-[#EAF4EE] text-[#236B43]'
                      : 'bg-[#F0EFFE] text-[#5344B5]'
                  }`}
                >
                  {item.type === 'deadline' ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : item.type === 'exam' ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : item.type === 'habit' ? (
                    <Flame className="w-3.5 h-3.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors truncate">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D46247] flex-shrink-0 ml-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#58615A] leading-snug mt-0.5">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F2ECE1]/60 text-[10px] text-[#8C958E]">
                    <span className="font-mono">{item.time}</span>
                    <span className="font-bold text-[#1E3A2B] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F2ECE1]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold text-center transition-all"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
