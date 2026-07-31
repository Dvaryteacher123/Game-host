import { Outlet } from 'react-router-dom';
import NotificationBar from './NotificationBar';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <NotificationBar />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
