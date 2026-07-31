import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getCountFromServer } from 'firebase/firestore';
import DashboardCards from '../../components/admin/DashboardCards';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalReviews: 0,
    totalCategories: 0,
    totalNotifications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const collections = ['games', 'users', 'downloads', 'reviews', 'categories', 'notifications'];
      const results = await Promise.all(
        collections.map((col) => getCountFromServer(collection(db, col)))
      );
      setStats({
        totalGames: results[0].data().count,
        totalUsers: results[1].data().count,
        totalDownloads: results[2].data().count,
        totalReviews: results[3].data().count,
        totalCategories: results[4].data().count,
        totalNotifications: results[5].data().count,
      });
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <DashboardCards stats={stats} />
      {/* Add charts or recent activity later */}
    </AdminLayout>
  );
};

export default AdminDashboard;
