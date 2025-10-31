import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="pl-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}