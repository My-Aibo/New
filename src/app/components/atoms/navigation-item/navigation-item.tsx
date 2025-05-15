"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isCollapsed?: boolean;
}

/**
 * Reusable navigation item component that can be used in sidebars, headers, etc.
 * Supports both Link and button behavior with consistent styling
 */
export function NavigationItem({
  icon,
  label,
  href,
  onClick,
  isActive,
  isCollapsed = false,
}: NavigationItemProps) {
  const pathname = usePathname();
  
  // If isActive is not explicitly provided, determine it based on href and pathname
  const active = isActive ?? (href ? pathname === href : false);
  
  // Common classes for both link and button variants
  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
    "hover:bg-muted/50",
    active ? "bg-muted font-medium text-primary" : "text-muted-foreground",
    isCollapsed && "justify-center p-2"
  );

  // If href is provided, render as a Link
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <button onClick={onClick} className={className}>
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
}
