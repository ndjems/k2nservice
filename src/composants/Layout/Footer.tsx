
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Package size={24} />
              </div>
              <span className="text-xl font-bold">GestionApp</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Votre solution complète pour la gestion d'entreprise. Gérez vos ventes, acquisitions, stocks et finances en toute simplicité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ventes" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Ventes
                </Link>
              </li>
              <li>
                <Link to="/acquisitions" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Acquisitions
                </Link>
              </li>
              <li>
                <Link to="/stock" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Stock
                </Link>
              </li>
              <li>
                <Link to="/rapport" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Rapports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-300">contact@gestionapp.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-300">Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 GestionApp. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;