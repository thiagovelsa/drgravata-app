import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Calendar, 
  FileSignature, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarNavigationProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarNavigation = ({ isOpen, toggleSidebar }: SidebarNavigationProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={cn(
      "flex flex-col bg-primary text-white shadow-xl z-10",
      "transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="px-6 py-6 flex items-center">
        <div className="bg-gradient-to-r from-accent to-accent-light p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        {isOpen && <h1 className="font-heading font-bold text-xl tracking-wide">DrGravata</h1>}
      </div>
      
      <div className="mt-8 flex-1 overflow-y-auto">
        <nav className="px-4">
          <NavItem href="/" icon={<LayoutDashboard className="h-5 w-5" />} isActive={isActive("/")} isOpen={isOpen}>
            Dashboard
          </NavItem>
          
          <NavItem href="/clients" icon={<Users className="h-5 w-5" />} isActive={isActive("/clients")} isOpen={isOpen}>
            Clientes
          </NavItem>
          
          <NavItem href="/cases" icon={<FileText className="h-5 w-5" />} isActive={isActive("/cases")} isOpen={isOpen}>
            Processos
          </NavItem>
          
          <NavItem href="/deadlines" icon={<Calendar className="h-5 w-5" />} isActive={isActive("/deadlines")} isOpen={isOpen}>
            Prazos
          </NavItem>
          
          <NavItem href="/documents" icon={<FileSignature className="h-5 w-5" />} isActive={isActive("/documents")} isOpen={isOpen}>
            Peças Jurídicas
          </NavItem>
          
          <NavItem href="/assistant" icon={<MessageSquare className="h-5 w-5" />} isActive={isActive("/assistant")} isOpen={isOpen}>
            Assistente IA
          </NavItem>
        </nav>
      </div>
      
      <div className="px-4 py-4 border-t border-primary-light">
        <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} isActive={isActive("/settings")} isOpen={isOpen}>
          Configurações
        </NavItem>

        <button
          onClick={toggleSidebar}
          className="mt-4 w-full flex items-center justify-center p-2 text-white/70 hover:text-white rounded-md transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  isOpen: boolean;
}

const NavItem = ({ href, icon, children, isActive, isOpen }: NavItemProps) => (
  <Link 
    href={href}
    className={cn(
      "sidebar-link flex items-center px-4 py-3 rounded-lg mb-1",
      "transition-all duration-300 ease-in-out",
      isActive 
        ? "border-l-4 border-accent bg-accent/10" 
        : "hover:bg-accent/5"
    )}
  >
    <span className="mr-3">{icon}</span>
    {isOpen && <span className="font-medium">{children}</span>}
  </Link>
);

export default SidebarNavigation;
