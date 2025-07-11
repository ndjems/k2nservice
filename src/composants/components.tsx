import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Download, 
  Users, 
  Settings, 
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Wallet,
  Package,
  TrendingUp,
  FileText,
  Archive,
  BarChart3,
  Home
} from 'lucide-react';

// Simulation des composants de pages
const HomePage = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Tableau de bord</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Ventes du jour</p>
            <p className="text-2xl font-bold">245,000 FCFA</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Fonds disponibles</p>
            <p className="text-2xl font-bold">1,250,000 FCFA</p>
          </div>
          <Wallet className="w-8 h-8 text-green-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Stock total</p>
            <p className="text-2xl font-bold">1,847 articles</p>
          </div>
          <Package className="w-8 h-8 text-purple-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100">Bénéfices</p>
            <p className="text-2xl font-bold">45,000 FCFA</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-200" />
        </div>
      </div>
    </div>
  </div>
);

type SamplePageProps = {
  title: string;
  description: string;
};

const SamplePage = ({ title, description }: SamplePageProps) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      component: HomePage
    },
    {
      id: 'enregistrer',
      label: 'Enregistrer',
      icon: Save,
      hasDropdown: true,
      subItems: [
        { id: 'ventes', label: 'Ventes', icon: ShoppingCart },
        { id: 'fonds', label: 'Fonds', icon: Wallet },
        { id: 'acquisitions', label: 'Acquisitions', icon: Package },
        { id: 'sorties', label: 'Sorties', icon: TrendingUp }
      ]
    },
    {
      id: 'consulter',
      label: 'Consulter',
      icon: Eye,
      hasDropdown: true,
      subItems: [
        { id: 'rapports', label: 'Rapports', icon: FileText },
        { id: 'etat-fonds', label: 'État des fonds', icon: Wallet },
        { id: 'stocks', label: 'Stocks', icon: Archive }
      ]
    },
    {
      id: 'exporter',
      label: 'Exporter',
      icon: Download,
      hasDropdown: true,
      subItems: [
        { id: 'export-rapports', label: 'Rapports', icon: FileText },
        { id: 'export-fonds', label: 'État des fonds', icon: BarChart3 },
        { id: 'export-stocks', label: 'Stocks', icon: Archive }
      ]
    },
    {
      id: 'tiers',
      label: 'Gérer les tiers',
      icon: Users,
      component: () => <SamplePage title="Gestion des tiers" description="Gérez vos clients, fournisseurs et partenaires commerciaux." />
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: Settings,
      component: () => <SamplePage title="Paramètres" description="Configurez les paramètres de votre application." />
    }
  ];

  const toggleDropdown = (itemId: string | React.SetStateAction<null>) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handlePageChange = (pageId: React.SetStateAction<string>) => {
    setCurrentPage(pageId);
    setIsSidebarOpen(false);
    setActiveDropdown(null);
  };

  const getCurrentPageComponent = () => {
    const currentItem = menuItems.find(item => item.id === currentPage);
    if (currentItem?.component) {
      return React.createElement(currentItem.component);
    }
    
    // Recherche dans les sous-éléments
    for (const item of menuItems) {
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === currentPage);
        if (subItem) {
          return <SamplePage 
            title={subItem.label} 
            description={`Gestion des ${subItem.label.toLowerCase()}`} 
          />;
        }
      }
    }
    
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fixe */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Gestion Pro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600">Bienvenue,</p>
              <p className="text-sm font-medium text-gray-900">Admin</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16">
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => item.hasDropdown ? toggleDropdown(item.id) : handlePageChange(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${currentPage === item.id 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.id ? 'transform rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  
                  {item.hasDropdown && activeDropdown === item.id && (
                    <div className="ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handlePageChange(subItem.id)}
                          className={`
                            w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                            ${currentPage === subItem.id 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-600 hover:bg-gray-50'
                            }
                          `}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay pour mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 lg:ml-0 min-h-0">
          <div className="h-full p-4 lg:p-6 pb-20 overflow-y-auto">
            {getCurrentPageComponent()}
          </div>
        </main>
      </div>

      {/* Footer fixe */}
      <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40">
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-600">
              © 2024 Gestion Pro. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <span className="text-sm text-gray-500">Version 1.0.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;