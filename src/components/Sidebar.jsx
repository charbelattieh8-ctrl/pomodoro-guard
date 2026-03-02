import { useEffect, useRef, useState } from "react";
import { Award, Clock3, ShoppingBag, Users, TrendingUp, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: Clock3 },
  { to: "/timer", label: "Timer", icon: Clock3 },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/rooms", label: "Rooms", icon: Users },
  { to: "/challenges", label: "Challenges", icon: Award },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/milestones", label: "Badges", icon: Award },
  { to: "/stats", label: "Stats", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Wrench },
];

const itemClass = ({ isActive }, collapsed) =>
  `flex items-center rounded-xl px-3 py-2 transition ${
    collapsed ? "justify-center" : "gap-3"
  } ${isActive ? "bg-white/20 text-white" : "text-slate-200/90 hover:bg-white/10"}`;

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
        className={`glass hidden h-fit rounded-2xl p-3 shadow-glow ring-1 ring-white/20 transition-[width] duration-300 ease-out will-change-[width] md:block ${
          collapsed ? "w-[78px]" : "w-64"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="space-y-1">
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
                <Icon size={17} />
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${
                    collapsed ? "pointer-events-none w-0 opacity-0" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <nav className="glass fixed bottom-4 left-1/2 z-30 flex w-[95%] -translate-x-1/2 items-center justify-around rounded-2xl px-2 py-2 shadow-glow ring-1 ring-white/20 md:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "text-white" : "text-slate-300")} end={item.to === "/"}>
              <Icon size={19} />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
