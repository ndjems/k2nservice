import React from "react";
import { motion } from "framer-motion";
import UilBars from "@iconscout/react-unicons/icons/uil-bars";
import { Link, useLocation } from "react-router-dom";
import UilShoppingCart from "@iconscout/react-unicons/icons/uil-shopping-cart";
import UilBox from "@iconscout/react-unicons/icons/uil-box";
import UilEdit from "@iconscout/react-unicons/icons/uil-edit";
import UilWallet from "@iconscout/react-unicons/icons/uil-wallet";
import UilExport from "@iconscout/react-unicons/icons/uil-export";
import UilSignOutAlt from "@iconscout/react-unicons/icons/uil-signout";
import UilEstate from "@iconscout/react-unicons/icons/uil-estate";



interface SidebarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ expanded, setExpanded }: SidebarProps) {
  const location = useLocation();

  // Fonction de déconnexion
  const handleLogout = () => {
    ['access_token', 'refresh_token', 'email', 'role', 'denomination_magasin', 'token'].forEach(item => {
      localStorage.removeItem(item);
    });
    window.location.href = '/connexion';
  }

  const sidebarVariants = {
    true: { width: '200px', left: 0 }, // étendu 
    false: { width: '100px', left: 0 } // réduit 
  };

  const menuItems = [
    { icon: (size: number) => <UilEstate size={size} />, label: "Dashboard", to: "/dashboard" },
    { icon: (size: number) => <UilShoppingCart size={size} />, label: "Ventes", to: "/ventes" },
    { icon: (size: number) => <UilBox size={size} />, label: "Acquisitions", to: "/acquisitions" },
    { icon: (size: number) => <UilWallet size={size} />, label: "Fonds", to: "/fonds" },
    { icon: (size: number) => <UilExport size={size} />, label: "Sortie", to: "/sorties" },
    { icon: (size: number) => <UilEdit size={size} />, label: "Formulaire", to: "/formulaire" },
  ];

  return (
    <>
      <motion.div
        className={`sidebar flex flex-col pt-4 transition-all duration-300 bg-pink-200 h-full min-h-0`}
        animate={expanded ? "true" : "false"}
        variants={sidebarVariants}
        style={{ top: 0 }}
      >
        {/* Bouton pour ouvrir/fermer la sidebar */}
        <div
          className={`bars self-end m-3 bg-pink-300 p-3 rounded-lg z-10 cursor-pointer`}
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          aria-label="Ouvrir ou fermer le menu latéral"
        >
          <UilBars />
        </div>

        <div className="menu mt-6 flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              to={item.to}
              key={item.label}
              className={`menuItem flex items-center gap-4 h-10 ml-4 rounded-lg transition-all duration-300 px-3 cursor-pointer text-base ${location.pathname === item.to ? "bg-[#00866e] text-white" : "hover:bg-[#00866e] hover:text-white"}`}
            >
              {item.icon(expanded ? 37 : 40)}
              {expanded ? <span>{item.label}</span> : null}
            </Link>
          ))}
          {/* Déconnexion */}
          <div className="menuItem flex items-center gap-4 h-10 ml-8 cursor-pointer" onClick={handleLogout}>
            <UilSignOutAlt size={expanded ? 37 : 40} />
            {expanded ? <span>Déconnexion</span> : null}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;
