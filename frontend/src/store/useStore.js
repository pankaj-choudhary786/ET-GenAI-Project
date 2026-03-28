import { create } from 'zustand';

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('salesai_user');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

export const useStore = create((set) => ({
  user: getSavedUser(),
  toasts: [],
  
  setUser: (user) => {
    if (user) localStorage.setItem('salesai_user', JSON.stringify(user));
    else { localStorage.removeItem('salesai_user'); localStorage.removeItem('salesai_token'); }
    set({ user });
  },
  
  logout: () => {
    localStorage.removeItem('salesai_token');
    localStorage.removeItem('salesai_user');
    set({ user: null });
  },
  
  addToast: (type, message) => {
    const id = Date.now().toString();
    set(state => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })), 4000);
  },
  
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
