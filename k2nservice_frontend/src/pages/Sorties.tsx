import React, { useState, useEffect } from 'react';
import { Plus, ArrowDown, Search, Filter, Calendar, X, Table } from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button'; // Assurez-vous d'importer le bon composant Button
import { Label } from '@/components/ui/label'; // Assurez-vous d'importer le bon composant Label

const Sorties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sorties, setSorties] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    article: '',
    quantite: '',
    motif: '',
    responsable: '',
    date_sortie: ''
  });

  // Fonction pour récupérer les sorties depuis l'API
  const fetchSorties = async () => {
    try {
      setIsLoading(true);
      // Remplacez par votre URL d'API
      const response = await fetch('http://localhost:9001/sorties');
      if (response.ok) {
        const data = await response.json();
        setSorties(data);
      } else {
        console.error('Erreur lors de la récupération des sorties');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Données de démonstration en cas d'erreur
      setSorties([
        {
          id: 'SO001',
          article: 'Ordinateurs portables',
          quantite: 5,
          motif: 'Transfert bureau Paris',
          responsable: 'Jean Dupont',
          date_sortie: '2024-01-15',
        },
        {
          id: 'SO002',
          article: 'Chaises de bureau',
          quantite: 12,
          motif: 'Livraison agence Lyon',
          responsable: 'Marie Martin',
          date_sortie: '2024-01-14',
        },
        {
          id: 'SO003',
          article: 'Imprimantes',
          quantite: 3,
          motif: 'Vente client ABC',
          responsable: 'Pierre Leroy',
          date_sortie: '2024-01-13',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSorties();
  }, []);

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Préparer les données pour l'API
      const sortieData = {
        article: formData.article,
        quantite: parseInt(formData.quantite),
        motif: formData.motif,
        responsable: formData.responsable,
        date_sortie: formData.date_sortie
      };

      // Remplacez par votre URL d'API
      const response = await fetch('http://localhost:9001/sorties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sortieData),
      });

      if (response.ok) {
        const newSortie = await response.json();
        setSorties(prev => [newSortie, ...prev]);
        setFormData({
          article: '',
          quantite: '',
          motif: '',
          responsable: '',
          date_sortie: ''
        });
        setIsFormOpen(false);
      } else {
        console.error('Erreur lors de la création de la sortie');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      article: '',
      quantite: '',
      motif: '',
      responsable: '',
      date_sortie: ''
    });
  };

  // Filtrage des sorties
  const filteredSorties = sorties.filter(sortie =>
    sortie.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sortie.motif.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sortie.responsable.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSorties = filteredSorties.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowDown className="w-8 h-8" />
              Sorties
            </h1>
            <p className="text-gray-600">
              Gestion des sorties et mouvements
            </p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
             <Button
  className="gap-2"
  style={{ backgroundColor: '#095228' }}
  onMouseOver={(e) =>
    (e.currentTarget.style.backgroundColor = '#074020')
  }
  onMouseOut={(e) =>
    (e.currentTarget.style.backgroundColor = '#095228')
  }
>
  <Plus className="w-4 h-4" />
  Nouvelle sortie
</Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nouvelle sortie</DialogTitle>
                <DialogDescription>
                  Enregistrer une nouvelle sortie de stock
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="article">Article</Label>
                    <Input
                      id="article"
                      name="article"
                      value={formData.article}
                      onChange={handleInputChange}
                      placeholder="Nom de l'article"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input
                      id="quantite"
                      name="quantite"
                      type="number"
                      min="1"
                      value={formData.quantite}
                      onChange={handleInputChange}
                      placeholder="Nombre d'unités"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motif">Motif</Label>
                  <Textarea
                    id="motif"
                    name="motif"
                    value={formData.motif}
                    onChange={handleInputChange}
                    placeholder="Raison de la sortie"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsable">Responsable</Label>
                    <Input
                      id="responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      placeholder="Nom du responsable"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date_sortie}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsFormOpen(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
  type="submit"
  disabled={isLoading}
  className="bg-[#095228] hover:bg-[#074020] disabled:opacity-60"
>
  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
</Button>

                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total sorties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSorties}</div>
              <p className="text-xs text-gray-600">Mouvements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredSorties.filter(s => 
                  new Date(s.date_sortie).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-gray-600">Sorties</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ce mois-ci</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredSorties.filter(s => {
                  const sortieDate = new Date(s.date_sortie);
                  const now = new Date();
                  return sortieDate.getMonth() === now.getMonth() && 
                         sortieDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-gray-600">Sorties</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une sortie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sorties table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des sorties</CardTitle>
            <CardDescription>
              Historique des mouvements sortants
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des données...</p>
              </div>
            ) : (
         <table className="w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
  <thead className="bg-gray-900 text-white">
    <tr>
      <th className="px-4 py-3">ID</th>
      <th className="px-4 py-3">Article</th>
      <th className="px-4 py-3">Quantité</th>
      <th className="px-4 py-3">Motif</th>
      <th className="px-4 py-3">Responsable</th>
      <th className="px-4 py-3">Date</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {filteredSorties.map((sortie, index) => (
      <tr
        key={sortie.id}
        className="hover:bg-gray-100 transition-colors duration-150"
      >
        <td className="px-4 py-2">{sortie.id}</td>
        <td className="px-4 py-2">{sortie.article}</td>
        <td className="px-4 py-2">{sortie.quantite}</td>
        <td className="px-4 py-2">{sortie.motif}</td>
        <td className="px-4 py-2">{sortie.responsable}</td>
        <td className="px-4 py-2">
          {new Date(sortie.date_sortie).toLocaleDateString("fr-FR")}
        </td>
      </tr>
    ))}
  </tbody>
</table>


            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Sorties;
