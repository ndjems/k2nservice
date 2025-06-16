import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const modules = [
  {
    id: 'enregistre-submenu',
    icon: 'fas fa-plus',
    label: 'Enregistrer',
    links: [
      { href: '/ventes', text: 'Les ventes' },
      { href: '/fonds', text: 'Les fonds' },
      { href: '/acquisitions', text: 'Les acquisitions' },
      { href: '/sorties', text: 'Les sorties' },
    ],
  },
  {
    id: 'consulter-submenu',
    icon: 'fas fa-search',
    label: 'Consulter',
    links: [
      { href: '/rapport', text: 'Rapports' },
      { href: '/etat-des-fonds', text: 'État des fonds' },
      { href: '/stock', text: 'Les stocks' },
    ],
  },
  {
    id: 'exporter-submenu',
    icon: 'fas fa-upload',
    label: 'Exporter',
    links: [
      { href: '#', text: 'Rapport' },
      { href: '#', text: 'État des fonds' },
      { href: '#', text: 'Les stocks' },
    ],
  },
{
  id: 'gerer-tiers',
  icon: 'fas fa-users',
  label: 'Gérer les tiers',
  links: [
    {  }
  ],
},
{
    id: 'parametres-submenu',
    icon: 'fas fa-cog',
    label: 'Paramètres',
    links: [
      { action: 'logout', text: 'Déconnexion' }, // Action personnalisée
    ],
  },
];

const HomePage = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/connexion');
  };

  const toggleSubmenu = (id: string) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const handleLinkClick = (link: any) => {
    if (link.action === 'logout') {
      handleLogout();
    } else if (link.href) {
      window.location.href = link.href;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="bg-green-800 text-white p-4 text-center text-2xl font-bold">
        K2N Services
      </header>

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-100 border-r">
          <ul className="space-y-4 p-4">
            {modules.map((mod) => (
              <li key={mod.id}>
                <div
                  className={`cursor-pointer flex items-center space-x-2 p-2 rounded hover:bg-blue-200 ${
                    activeSubmenu === mod.id ? 'bg-blue-300' : ''
                  }`}
                  onClick={() => toggleSubmenu(mod.id)}
                >
                  <i className={`${mod.icon} fa-2x`} />
                  <span>{mod.label}</span>
                </div>
                {activeSubmenu === mod.id && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {mod.links.map((link, idx) => (
                      <li key={idx}>
                        {link.action === 'logout' ? (
                          <button
                            onClick={handleLogout}
                            className="text-red-600 hover:underline"
                          >
                            {link.text}
                          </button>
                        ) : (
                          <a
                            href={link.href}
                            className="text-blue-700 hover:underline"
                          >
                            {link.text}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 p-8">
          {/* contenu principal ici */}
        </main>
      </div>

      <footer className="bg-green-800 text-white p-4 text-center py-4 text-white">
        &copy; 2025 K2N Services
      </footer>
    </div>
  );
};

export default HomePage;
