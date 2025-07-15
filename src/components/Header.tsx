import logo from '../assets/images/Profish.jpg'; // adapte le chemin selon la structure exacte


// src/Components/Header.tsx
import { Menu } from "lucide-react";
import SearchComponent from "./Search";
import Profile from "./Profile";
import Notification from "./Notification";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <div className="w-full flex items-center justify-between bg-white px-4 py-3 border-gray-200">
      <div className="flex-shrink-0 flex items-center flex-col ml-0">
        <img
          className="h-12 w-12"
          src={logo}
          alt="Logo"
        />
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="text-gray-600 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
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
