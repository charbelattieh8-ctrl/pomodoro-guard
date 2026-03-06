import { useEffect, useRef, useState } from "react";
import { Award, ChevronRight, Clock3, DoorOpen, LayoutDashboard, ShoppingBag, Users, TrendingUp, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/timer", label: "Timer", icon: Clock3 },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/challenges", label: "Challenges", icon: Award },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/milestones", label: "Badges", icon: Award },
  { to: "/stats", label: "Stats", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Wrench },
];

const itemClass = ({ isActive }, collapsed) =>
  `group flex items-center rounded-2xl px-3 py-3 transition ${
    collapsed ? "justify-center" : "gap-3"
  } ${isActive ? "nav-pill text-white" : "text-slate-200/86 hover:bg-white/8"}`;

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const collapseTimerRef = useRef(null);
  const collapsed = !isHovered;

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => setIsHovered(false), 140);
  };

  return (
    <>
      <aside
        className={`glass hidden h-fit rounded-[28px] p-3 shadow-glow ring-1 ring-white/20 transition-[width] duration-300 ease-out will-change-[width] md:block ${
          collapsed ? "w-[78px]" : "w-64"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`mb-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-3 transition-all ${collapsed ? "text-center" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="nav-pill grid h-11 w-11 place-items-center rounded-2xl text-cyan-100">
              <Clock3 size={18} />
            </div>
            {!collapsed && (
              <div>
                <p className="eyebrow text-[0.6rem]">Navigation</p>
                <p className="font-display text-lg font-semibold tracking-[-0.04em]">Command Deck</p>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={(navState) => itemClass(navState, collapsed)}
                end={item.to === "/"}
                title={collapsed ? item.label : ""}
              >
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/[0.05] text-slate-100 transition group-hover:bg-white/[0.09]">
                  <Icon size={17} />
                </span>
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${
                    collapsed ? "pointer-events-none w-0 opacity-0" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {!collapsed && <ChevronRight size={14} className="ml-auto opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-80" />}
              </NavLink>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-4 rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4">
            <p className="eyebrow text-[0.62rem]">Flow Tip</p>
            <p className="mt-2 text-sm text-slate-200/88">Treat the timer as the hero screen. Open it quickly and keep everything else secondary.</p>
          </div>
        )}
      </aside>

      <nav className="glass fixed bottom-4 left-1/2 z-30 flex w-[95%] -translate-x-1/2 items-center justify-around rounded-[26px] px-2 py-2 shadow-glow ring-1 ring-white/20 md:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-[58px] flex-col items-center rounded-2xl px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  isActive ? "nav-pill text-white" : "text-slate-300"
                }`
              }
              end={item.to === "/"}
            >
              <Icon size={18} />
              <span className="mt-1">{item.label.slice(0, 4)}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
