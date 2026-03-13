import { LayoutDashboard, BarChart3, Users, Settings, X } from "lucide-react";
import { LogoIcon } from "@/components/icons";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Customers", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-700
          flex flex-col transition-transform duration-200
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <LogoIcon className="text-indigo-400" width={28} height={28} />
            <span className="text-lg font-bold text-slate-100">Metrix</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${
                      item.active
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
