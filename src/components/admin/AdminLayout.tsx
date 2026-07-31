import Sidebar from './Sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">{children}</div>
    </div>
  );
};

export default AdminLayout;
