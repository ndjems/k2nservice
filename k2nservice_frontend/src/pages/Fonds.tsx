import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Wallet, Search, Filter, Calendar, ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface FondCreate {
  nomCrediteur: string;
  sommePercue: number;
  dateFonds: string; // YYYY-MM-DD
}

interface FondResponse {
  id: string;
  nom_crediteur: string;
  somme_percue: number;
  date_fonds: string;
  created_at: string;
}

const Fonds = () => {

  const [openEditModal, setOpenEditModal] = useState(false);
const [selectedFond, setSelectedFond] = useState<Fond | null>(null);

const [editNomCrediteur, setEditNomCrediteur] = useState('');
const [editSommePercue, setEditSommePercue] = useState('');
const [editDateFonds, setEditDateFonds] = useState('');

const handleEditClick = (fond: Fond) => {
  setSelectedFond(fond);
  setEditNomCrediteur(fond.nom_crediteur);
  setEditSommePercue(fond.somme_percue.toString());
  setEditDateFonds(fond.date_fonds);
  setOpenEditModal(true);
};


  const [searchQuery, setSearchQuery] = useState('');
  const [fonds, setFonds] = useState<FondResponse[]>([]); // État pour stocker les fonds récupérés
  const [showNewFondForm, setShowNewFondForm] = useState(false);
  const [newFond, setNewFond] = useState<FondCreate>({
    nomCrediteur: '',
    sommePercue: 0,
    dateFonds: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const totalFonds = fonds.reduce((sum, fond) => sum + fond.somme_percue, 0);
  const fondsActifs = fonds.filter(f => f.somme_percue > 0).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-success text-success-foreground';
      case 'Bloqué':
        return 'bg-destructive text-destructive-foreground';
      case 'En attente':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleUpdateFond = async () => {
  if (!selectedFond) return;

  try {
    const response = await fetch(`http://localhost:9001/fonds/${selectedFond.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom_crediteur: editNomCrediteur,
        somme_percue: parseFloat(editSommePercue),
        date_fonds: editDateFonds,
      }),
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour');

    setOpenEditModal(false);
    fetchFonds(); // recharge les données
  } catch (error) {
    console.error('Erreur MAJ:', error);
  }
};

const handleDeleteFond = async () => {
  if (!selectedFond) return;

  try {
    const response = await fetch(`http://localhost:9001/fonds/${selectedFond.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression');

    setOpenEditModal(false);
    fetchFonds(); // recharge la liste après suppression
  } catch (error) {
    console.error('Erreur suppression:', error);
  }
};


  const handleNewFondChange = (field: keyof FondCreate, value: string | number) => {
    setNewFond(prev => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleAddNewFond = async () => {
  if (!newFond.nomCrediteur || !newFond.dateFonds || newFond.sommePercue <= 0) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  try {
    const response = await fetch('http://localhost:9001/fonds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomCrediteur: newFond.nomCrediteur,
        sommePercue: newFond.sommePercue,
        dateFonds: newFond.dateFonds,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du fonds");
    }

    const savedFond = await response.json(); // Fond renvoyé par le backend (avec l'ID réel)
    fetchFonds(); // recharge toute la liste à jour depuis le backend

    setShowNewFondForm(false);
    setNewFond({
      nomCrediteur: '',
      sommePercue: 0,
      dateFonds: '',
    });

  } catch (error) {
    console.error(error);
    alert("Impossible d'ajouter le fond. Veuillez réessayer.");
  }
};

const fetchFonds = async () => {
  try {
    const response = await fetch('http://localhost:9001/fonds');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des fonds');
    }
    const data = await response.json();
    setFonds(data); // Tu mets à jour l’état avec les fonds depuis le backend
  } catch (error) {
    console.error('Erreur fetchFonds:', error);
  }
};

useEffect(() => {
  fetchFonds();
}, []);


  // Filtrage des fonds
  const filteredFonds = fonds.filter(fond => {
    const matchesSearch = fond.nom_crediteur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStartDate = startDate ? new Date(fond.date_fonds) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(fond.date_fonds) <= new Date(endDate) : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <Wallet className="w-8 h-8" />
              Fonds
            </h1>
            <p className="text-muted-foreground">
              Gestion des fonds et comptes
            </p>
          </div>
          <Button className="gap-2 bg-green-700 hover:bg-green-900" onClick={() => setShowNewFondForm(true)}>
            <Plus className="w-4 h-4" />
            Nouveau fonds
          </Button>
        </div>

        {showNewFondForm && (
          <Card className="mb-6 p-4 bg-white border border-gray-300 rounded-md max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ajouter un nouveau fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Nom du créditeur"
                  value={newFond.nomCrediteur}
                  onChange={(e) => handleNewFondChange('nomCrediteur', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Somme perçue"
                  value={newFond.sommePercue}
                  onChange={(e) => handleNewFondChange('sommePercue', parseFloat(e.target.value))}
                />
                <Input
                  type="date"
                  placeholder="Date des fonds"
                  value={newFond.dateFonds}
                  onChange={(e) => handleNewFondChange('dateFonds', e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewFondForm(false)}>Annuler</Button>
                  <Button onClick={handleAddNewFond}>Ajouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFonds.toLocaleString()} XAF</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-success" />
                +5.2% ce mois
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fondsActifs}</div>
              <p className="text-xs text-muted-foreground">Sur {fonds.length} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fonds.find(f => f.nom_crediteur === 'Fonds principal')?.somme_percue.toLocaleString()} XAF
              </div>
              <p className="text-xs text-muted-foreground">Disponible</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fonds de réserve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fonds.find(f => f.nom_crediteur === 'Fonds de réserve')?.somme_percue.toLocaleString()} XAF
              </div>
              <p className="text-xs text-muted-foreground">Sécurisé</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un fonds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="date"
                  placeholder="Date de début"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="date"
                  placeholder="Date de fin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
                <Filter className="w-4 h-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="gap-2 bg-green-700 hover:bg-green-900">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </CardContent>
        </Card>

<Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modifier le fond</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-3">
      <div>
        <Label>Nom du créditeur</Label>
        <Input
          value={editNomCrediteur}
          onChange={(e) => setEditNomCrediteur(e.target.value)}
        />
      </div>
      <div>
        <Label>Somme perçue</Label>
        <Input
          type="number"
          value={editSommePercue}
          onChange={(e) => setEditSommePercue(e.target.value)}
        />
      </div>
      <div>
        <Label>Date du fonds</Label>
        <Input
          type="date"
          value={editDateFonds}
          onChange={(e) => setEditDateFonds(e.target.value)}
        />
      </div>
    </div>

    <DialogFooter className="flex justify-between pt-4">
      <Button variant="destructive" onClick={handleDeleteFond}>Supprimer</Button>
      <Button onClick={handleUpdateFond}>Enregistrer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


        {/* Fonds table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des fonds</CardTitle>
            <CardDescription>
              Aperçu de tous les fonds gérés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom du fonds</TableHead>
                  <TableHead>Somme perçue</TableHead>
                  <TableHead>Date des fonds</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFonds.map((fond) => (
                  <TableRow key={fond.id}>
                    <TableCell className="font-medium">{fond.id}</TableCell>
                    <TableCell>{fond.nom_crediteur}</TableCell>
                    <TableCell className="font-medium">
                      {fond.somme_percue.toLocaleString()} XAF
                    </TableCell>
                    <TableCell>{new Date(fond.date_fonds).toLocaleDateString()}</TableCell>
                    <TableCell>
                     <Button variant="outline" size="sm" onClick={() => handleEditClick(fond)}>
                         Gérer
                     </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Fonds;
