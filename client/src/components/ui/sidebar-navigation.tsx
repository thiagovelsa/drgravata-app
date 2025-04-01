import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  Users, 
  FileText, 
  Calendar, 
  FileSignature, 
  MessageSquare, 
  Settings,
  Scale
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
    <aside className="w-[240px] h-screen flex flex-col bg-[#1e293b] text-white">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center">
        <div className="bg-[#3498db] p-2 rounded-lg mr-3">
          <Scale className="h-5 w-5" />
        </div>
        <h1 className="font-heading font-bold text-xl tracking-wide">DrGravata</h1>
      </div>
      
      {/* Navigation */}
      <div className="mt-8 flex-1">
        <nav className="space-y-1">
          <NavItem href="/" icon={<Home className="h-5 w-5" />} isActive={isActive("/")} isOpen={true}>
            Início
          </NavItem>
          
          <NavItem href="/clients" icon={<Users className="h-5 w-5" />} isActive={isActive("/clients")} isOpen={true}>
            Clientes
          </NavItem>
          
          <NavItem href="/cases" icon={<FileText className="h-5 w-5" />} isActive={isActive("/cases")} isOpen={true}>
            Processos
          </NavItem>
          
          <NavItem href="/deadlines" icon={<Calendar className="h-5 w-5" />} isActive={isActive("/deadlines")} isOpen={true}>
            Prazos
          </NavItem>
          
          <NavItem href="/documents" icon={<FileSignature className="h-5 w-5" />} isActive={isActive("/documents")} isOpen={true}>
            Peças Jurídicas
          </NavItem>
          
          <NavItem href="/assistant" icon={<MessageSquare className="h-5 w-5" />} isActive={isActive("/assistant")} isOpen={true}>
            Assistente IA
          </NavItem>
        </nav>
      </div>
      
      {/* Footer */}
      <div className="mt-auto mb-6">
        <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} isActive={isActive("/settings")} isOpen={true}>
          Configurações
        </NavItem>
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
      "flex items-center px-6 py-3 text-white/80 hover:text-white",
      "transition-all duration-200 ease-in-out",
      isActive 
        ? "bg-white/10 text-white border-l-4 border-[#3498db]" 
        : "hover:bg-white/5"
    )}
  >
    <span className="mr-3 flex items-center justify-center w-6">{icon}</span>
    <span className="font-medium">{children}</span>
  </Link>
);

export default SidebarNavigation;
