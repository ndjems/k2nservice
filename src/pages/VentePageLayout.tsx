import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Menu from '../components/Menu'; // Assuming Menu is an array of menu items
import VentesPage from './VentesPage';


const VentePageLayout = () => {
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
 
      <Header />
      <div className="flex flex-1">
        <nav className="w-64 bg-gray-100 border-r">
          <ul className="space-y-4 p-4">
            {Menu.map((mod) => (
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
            <VentesPage/>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default VentePageLayout;
