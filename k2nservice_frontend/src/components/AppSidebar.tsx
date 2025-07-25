import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  ShoppingCart,
  TrendingUp,
  Wallet,
  BarChart3,
  FileText,
  UserPlus,
  Package,
  ArrowDown,
  Home,
  Building2,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Accueil',
    url: '/dashboard',
    icon: Home,
    description: 'Tableau de bord principal',
  },
  {
    title: 'Acquisitions',
    url: '/dashboard/acquisitions',
    icon: ShoppingCart,
    description: 'Gestion des acquisitions',
  },
  {
    title: 'Ventes',
    url: '/dashboard/ventes',
    icon: TrendingUp,
    description: 'Suivi des ventes',
  },
  {
    title: 'Fonds',
    url: '/dashboard/fonds',
    icon: Wallet,
    description: 'Gestion des fonds',
  },
  {
    title: 'État des fonds',
    url: '/dashboard/etat-fonds',
    icon: BarChart3,
    description: 'Analyse des fonds',
  },
  {
    title: 'Rapports',
    url: '/dashboard/rapports',
    icon: FileText,
    description: 'Génération de rapports',
  },
  {
    title: 'Enregistrement',
    url: '/dashboard/enregistrement',
    icon: UserPlus,
    description: 'Nouveau enregistrement',
  },
  {
    title: 'Stocks',
    url: '/dashboard/stocks',
    icon: Package,
    description: 'Gestion des stocks',
  },
  {
    title: 'Sorties',
    url: '/dashboard/sorties',
    icon: ArrowDown,
    description: 'Sorties et mouvements',
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Header avec logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-[3rem] h-[3rem] bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src="../public/fish.jpg" alt="logo" className="w-[3rem] h-[3rem] " />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-[#095228]">K2NService</h2>
                <p className="text-xs text-sidebar-foreground/70">Gestion avancée</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu principal */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
           <SidebarMenu className="space-y-3">
  {sidebarItems.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={isActive(item.url)}
        className={`
          ${isCollapsed ? 'justify-center' : 'justify-start'}
          hover:bg-sidebar-accent
          ${isActive(item.url) 
            ? 'bg-[#095228] text-sidebar-primary font-medium' 
            : 'text-sidebar-foreground'
          }
        `}
      >
        <NavLink 
          to={item.url} 
          className="flex items-center gap-3 p-2 rounded-md w-full"
          title={isCollapsed ? item.title : undefined}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="truncate">{item.title}</span>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {item.description}
              </p>
            </div>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>

        {/* Version info */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="text-xs text-[#095228] ">
              <p>Version 1.0.0</p>
              <p>© 2025 K2NService</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}