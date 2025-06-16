const Menu = [
    {
      id: 'enregistre-submenu',
      icon: 'fas fa-plus',
      label: 'Dashboard',
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
      label: ' gerer les acquitisions',
      links: [
        { href: '/rapport', text: 'Rapports' },
        { href: '/etat-des-fonds', text: 'État des fonds' },
        { href: '/stock', text: 'Les stocks' },
      ],
    },
    {
      id: 'exporter-submenu',
      icon: 'fas fa-upload',
      label: 'gérer les fonds',
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
  

export default Menu;