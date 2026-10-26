import React, { useState, useMemo } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Priority } from '../../types';
import {
  Check,
  Clock,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  RotateCcw
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    deleteTask,
    rescheduleTask,
    setEditingTask,
    setIsTaskModalOpen,
    subjects
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (activeTab === 'today') {
        if (task.dueDate !== todayStr || task.status === 'completed') return false;
      } else if (activeTab === 'upcoming') {
        if (task.dueDate <= todayStr || task.status === 'completed') return false;
      } else if (activeTab === 'overdue') {
        if (task.dueDate >= todayStr || task.status === 'completed') return false;
      } else if (activeTab === 'completed') {
        if (task.status !== 'completed') return false;
      }

      if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, activeTab, selectedSubject, searchQuery, todayStr]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#1E2621]">Tasks Management</h2>
          <p className="text-xs text-[#6E7570] mt-0.5 font-sans">
            Organize, filter, and execute responsibilities.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-card flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={e => toggleTaskStatus(task.id, e)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isDone ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white' : 'border-[#B8B0A2] bg-white'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <div>
                  <h4 className={`text-xs font-bold ${isDone ? 'line-through text-[#8C958E]' : 'text-[#1E2621]'}`}>
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-[#8C958E]">Due {task.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded-lg text-[#8C958E] hover:text-[#C34E32]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
