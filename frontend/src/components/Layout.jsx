import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  User,
  CreditCard,
  FileText,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const navigation = [
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Buy Tokens", href: "/login-pricing", icon: CreditCard },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-neutral-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User menu */}
              <div className="relative">
                <button className="flex items-center gap-x-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:block">
                    {user?.name || "User"}
                  </span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-neutral-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-x-2">
            <BarChart3 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gradient">Assesme</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-medium transition-all duration-200
                          ${
                            isCurrent
                              ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600"
                              : "text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                          }
                        `}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isCurrent
                              ? "text-primary-600"
                              : "text-neutral-400 group-hover:text-primary-600"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
