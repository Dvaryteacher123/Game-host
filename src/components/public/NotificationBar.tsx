import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosNotifications } from 'react-icons/io';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
  createdAt: any;
}

const NotificationBar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(data);
    });
    return unsubscribe;
  }, []);

  // Rotate notifications every 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [notifications]);

  if (notifications.length === 0) return null;

  const current = notifications[currentIndex];
  return (
    <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md text-white py-2 px-4 text-center border-b border-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center justify-center gap-2 text-sm"
        >
          <IoIosNotifications className="text-yellow-400" />
          <span className="font-semibold">{current.title}</span>
          <span>{current.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;
