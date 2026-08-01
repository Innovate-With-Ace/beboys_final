// components/admin/QuickActions.tsx
import Link from "next/link";
import { Soup, Carrot, ClipboardList, Receipt } from "lucide-react";

const actions = [
  {
    label: "Dishes",
    href: "/admin/dishes",
    icon: Soup,
    bg: "bg-success/15",
    color: "text-success",
  },
  {
    label: "Ingredients",
    href: "/admin/inventory",
    icon: Carrot,
    bg: "bg-warning/15",
    color: "text-warning",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: Receipt,
    bg: "bg-brand-secondary/15",
    color: "text-brand-secondary",
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="bg-bg-muted border border-border rounded-xl p-3.5 flex flex-col items-center gap-1.5 text-center hover:border-border-strong transition-colors"
          >
            <div
              className={`h-8.5 w-8.5 rounded-[9px] flex items-center justify-center ${action.bg}`}
            >
              <Icon className={`h-4 w-4 ${action.color}`} />
            </div>
            <span className="text-[11.5px] font-medium">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
