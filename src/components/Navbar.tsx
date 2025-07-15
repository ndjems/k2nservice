import Menu from '../components/Menu'; //
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';





const Navbar = () => {
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
    <nav className="w-32 bg-gray-100 border-r">
      <ul className="space-y-3 p-3">
        {Menu.map((mod) => (
          <li key={mod.id}>
            <div
              className={`cursor-pointer flex items-center space-x-3 p-3 rounded hover:bg-blue-200 text-base ${
                activeSubmenu === mod.id ? 'bg-blue-300' : ''
              }`}
              onClick={() => toggleSubmenu(mod.id)}
            >
              <i className={`${mod.icon} fa-lg`} />
              <span className="text-xs">{mod.label}</span>
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
);
    };

export default Navbar;