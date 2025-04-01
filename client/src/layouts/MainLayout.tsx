import { useState } from "react";
import { useLocation, Link } from "wouter";
import SidebarNavigation from "@/components/ui/sidebar-navigation";
import UserAvatar from "@/components/ui/user-avatar";
import { 
  Bell, 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  FileSignature, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getPageTitle = () => {
    const path = location.split("/")[1];
    if (path === "") return "Início";
    
    // Mapeamento de rotas para títulos em português
    const pageTitles: Record<string, string> = {
      "clients": "Clientes",
      "cases": "Processos",
      "deadlines": "Prazos",
      "documents": "Peças Jurídicas",
      "assistant": "Assistente IA",
      "settings": "Configurações"
    };
    
    return pageTitles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="h-screen flex overflow-hidden antialiased text-sm">
      {/* Sidebar */}
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white shadow-subtle">
          <div className="flex items-center">
            <h2 className="font-heading text-xl font-semibold text-primary mr-6">{getPageTitle()}</h2>
            
            {/* Quick Access Nav */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <Home className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Início
                  </div>
                </div>
              </Link>
              <Link href="/clients">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <Users className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Clientes
                  </div>
                </div>
              </Link>
              <Link href="/cases">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Processos
                  </div>
                </div>
              </Link>
              <Link href="/deadlines">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Prazos
                  </div>
                </div>
              </Link>
              <Link href="/documents">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <FileSignature className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Peças Jurídicas
                  </div>
                </div>
              </Link>
              <Link href="/assistant">
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Assistente IA
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
              <div className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Notificações
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <UserAvatar name="Maria Gravata" />
          </div>
        </header>
        
        {/* Content area */}
        <main className={cn(
          "flex-1 overflow-y-auto p-6 bg-background",
          "transition-all duration-300 ease-in-out"
        )}>
          {children}
        </main>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 group">
        <Button 
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent 
                    shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all 
                    duration-300 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Button>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          Adicionar Novo
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
