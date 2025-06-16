import logo from '../assets/images/k2n.png'; // adapte le chemin selon la structure exacte


// src/Components/Header/Header.tsx
import { Menu } from "lucide-react";
import SearchComponent from "./Search";
import Profile from "./Profile";
import Notification from "./Notification";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <div className="w-full flex items-center justify-between bg-white px-4 py-3  border-gray-200">
            <div className="flex-shrink-0 flex items-center flex-col ml">
                            <img
                                className="h-20 w-20"
                                src={logo}
                                alt="Logo"
                            />
                        </div>
      <div className="flex items-center gap-4">
        <button 
          className="text-gray-600 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <SearchComponent />
      </div>
      
      <div className="flex items-center space-x-4 ">
        <Notification />
        <Profile />
      </div>
    </div>
  );
};

export default Header;

/**
 * 
 * 
 * const Header = () => {

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center flex-col ml">
                            <img
                                className="h-20 w-20"
                                src={logo}
                                alt="Logo"
                            />
                        </div>
                        <div className="hidden sm:-my-px sm:ml-6 sm:flex space-x-4">
                            </div>
                            </div>
                        </div>
                    </div>
                </header>
            );
        }
        export default Header;
 * 
 * 
 * 
 * 
*/