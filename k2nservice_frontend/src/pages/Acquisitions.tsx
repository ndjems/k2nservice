import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ShoppingCart, Search, Filter, Calendar, X } from 'lucide-react';

// Types pour les données d'acquisition
type TrancheData = {
  date: string;
  montant: number;
};

type Acquisition = {
  id: string;
  responsable_acquisition: string;
  nature_acquisition: string;
  quantite_acquise: number;
  prix_unitaire: number;
  frais_acquisition: number;
  frais_connexes: number;
  total_frais: number;
  type_acquisition: string;
  date_acquisition: string;
  dates_acquisition_tranches: TrancheData[] | null;
  details: string | null;
  commentaires: string | null;
  last_modified_at: string;
};

type FormData = {
  responsableAcquisition: string;
  natureAcquisition: string;
  quantiteAcquise: number;
  prixUnitaire: number;
  fraisAcquisition: number;
  fraisConnexes: number;
  totalFrais: number;
  typeAcquisition: string;
  dateAcquisition: string;
  datesAcquisitionTranches: TrancheData[];
  details: string;
  commentaires: string;
};

const Acquisitions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Données d'acquisitions avec état
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    responsableAcquisition: "",
    natureAcquisition: "",
    quantiteAcquise: 0,
    prixUnitaire: 0,
    fraisAcquisition: 0,
    fraisConnexes: 0,
    totalFrais: 0,
    typeAcquisition: "",
    dateAcquisition: "",
    datesAcquisitionTranches: [{ date: "", montant: 0 }],
    details: "",
    commentaires: "",
  });

  const showTranches = formData.typeAcquisition === "tranches";

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      responsableAcquisition: "",
      natureAcquisition: "",
      quantiteAcquise: 0,
      prixUnitaire: 0,
      fraisAcquisition: 0,
      fraisConnexes: 0,
      totalFrais: 0,
      typeAcquisition: "",
      dateAcquisition: "",
      datesAcquisitionTranches: [{ date: "", montant: 0 }],
      details: "",
      commentaires: "",
    });
  };

  // Fonction pour récupérer les acquisitions depuis l'API
  const fetchAcquisitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9001/acquisitions');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des acquisitions');
      }
      const data: Acquisition[] = await response.json();
      setAcquisitions(data);
      setError(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la récupération des acquisitions');
      // Données de test pour le développement
      setAcquisitions([
        {
          id: "ACQ001",
          responsable_acquisition: "Jean Dupont",
          nature_acquisition: "Matériel informatique",
          quantite_acquise: 5,
          prix_unitaire: 150000,
          frais_acquisition: 750000,
          frais_connexes: 25000,
          total_frais: 775000,
          type_acquisition: "totale",
          date_acquisition: "2025-01-20",
          dates_acquisition_tranches: null,
          details: null,
          commentaires: null,
          last_modified_at: new Date().toISOString(),
        },
        {
          id: "ACQ002",
          responsable_acquisition: "Marie Claire",
          nature_acquisition: "Fournitures de bureau",
          quantite_acquise: 100,
          prix_unitaire: 2500,
          frais_acquisition: 250000,
          frais_connexes: 10000,
          total_frais: 260000,
          type_acquisition: "tranches",
          date_acquisition: "2025-01-15",
          dates_acquisition_tranches: [
            { date: "2025-01-15", montant: 130000 },
            { date: "2025-02-15", montant: 130000 }
          ],
          details: "Commande spéciale",
          commentaires: "Livraison en deux fois",
          last_modified_at: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupération des données d'acquisition au chargement du composant
  useEffect(() => {
    fetchAcquisitions();
  }, []);

  // Filtrage des acquisitions
  const filteredAcquisitions = acquisitions.filter(acq =>
    acq.nature_acquisition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acq.responsable_acquisition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAcquisitions = filteredAcquisitions.reduce((sum, acq) => sum + acq.total_frais, 0);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'totale':
        return 'bg-green-100 text-green-800';
      case 'tranches':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Gestion des changements de formulaire
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Fonction pour créer une nouvelle acquisition via POST
  const createAcquisition = async (acquisitionData: any) => {
    const response = await fetch('http://localhost:9001/acquisitions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(acquisitionData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  };

  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      // Calculer le total des frais
      const totalCalculated = (formData.quantiteAcquise * formData.prixUnitaire) + formData.fraisConnexes;
      
      // Préparer les données pour l'API (format backend)
      const acquisitionData = {
        responsable_acquisition: formData.responsableAcquisition,
        nature_acquisition: formData.natureAcquisition,
        quantite_acquise: formData.quantiteAcquise,
        prix_unitaire: formData.prixUnitaire,
        frais_acquisition: formData.quantiteAcquise * formData.prixUnitaire,
        frais_connexes: formData.fraisConnexes,
        total_frais: totalCalculated,
        type_acquisition: formData.typeAcquisition,
        date_acquisition: formData.dateAcquisition,
        dates_acquisition_tranches: showTranches ? formData.datesAcquisitionTranches : null,
        details: formData.details || null,
        commentaires: formData.commentaires || null,
      };

      // Envoyer les données au backend
      const createdAcquisition = await createAcquisition(acquisitionData);
      
      setSuccessMessage("Acquisition enregistrée avec succès !");
      
      // Récupérer les données mises à jour depuis le backend
      await fetchAcquisitions();
      
      // Réinitialiser le formulaire et fermer le modal après 2 secondes
      setTimeout(() => {
        resetForm();
        setShowModal(false);
        setSuccessMessage(null);
      }, 2000);

    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'acquisition:", err);
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement de l'acquisition. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  // Fermer le modal et réinitialiser
  function closeModal() {
    setShowModal(false);
    setError(null);
    setSuccessMessage(null);
    resetForm();
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Acquisitions
          </h1>
          <p className="text-green-700">
            Gestion des achats et acquisitions
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4" />
          Nouvelle acquisition
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total acquisitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalAcquisitions.toLocaleString()} XAF</div>
            <p className="text-xs text-green-600">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Nombre d'acquisitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{filteredAcquisitions.length}</div>
            <p className="text-xs text-green-600">Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <Card className="mb-6 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                <Input
                  placeholder="Rechercher une acquisition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-300 focus:border-green-500"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-100">
              <Filter className="w-4 h-4" />
              Filtrer
            </Button>
            <Button variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-100">
              <Calendar className="w-4 h-4" />
              Période
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acquisitions table */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Liste des acquisitions ({filteredAcquisitions.length})</CardTitle>
          <CardDescription className="text-green-600">
            Historique de toutes les acquisitions effectuées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-green-200">
                  <TableHead className="text-left p-4 text-green-800 font-semibold">ID</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Responsable</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Article</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Quantité</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Prix unitaire</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Total</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Type</TableHead>
                  <TableHead className="text-left p-4 text-green-800 font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAcquisitions.map((acquisition) => (
                  <TableRow key={acquisition.id} className="border-b border-green-100 hover:bg-green-50">
                    <TableCell className="p-4 font-medium text-green-700">{acquisition.id}</TableCell>
                    <TableCell className="p-4">{acquisition.responsable_acquisition}</TableCell>
                    <TableCell className="p-4">{acquisition.nature_acquisition}</TableCell>
                    <TableCell className="p-4">{acquisition.quantite_acquise}</TableCell>
                    <TableCell className="p-4">{acquisition.prix_unitaire.toLocaleString()} XAF</TableCell>
                    <TableCell className="p-4 font-medium">{acquisition.total_frais.toLocaleString()} XAF</TableCell>
                    <TableCell className="p-4">
                      <Badge className={getStatusColor(acquisition.type_acquisition)}>
                        {acquisition.type_acquisition}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      {new Date(acquisition.date_acquisition).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAcquisitions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune acquisition trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal pour nouvelle acquisition */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800">Nouvelle Acquisition</DialogTitle>
            <DialogDescription className="text-green-600">
              Enregistrez une nouvelle acquisition dans le système
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Messages de succès/erreur */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Responsable de l'Acquisition <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="responsableAcquisition"
                value={formData.responsableAcquisition}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Nature du Produit Acquis <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="natureAcquisition"
                value={formData.natureAcquisition}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Quantité Acquise <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="quantiteAcquise"
                value={formData.quantiteAcquise}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Prix Unitaire (XAF) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="prixUnitaire"
                value={formData.prixUnitaire}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Frais Connexes (XAF)
              </label>
              <Input
                type="number"
                name="fraisConnexes"
                value={formData.fraisConnexes}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Type d'Acquisition <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.typeAcquisition}
                onValueChange={(value) => handleSelectChange('typeAcquisition', value)}
                required
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
                  <SelectValue placeholder="Sélectionner le type d'acquisition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="totale">Totale</SelectItem>
                  <SelectItem value="tranches">En Tranches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Date d'Acquisition <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="dateAcquisition"
                value={formData.dateAcquisition}
                onChange={handleChange}
                className="border-green-300 focus:border-green-500"
                required
              />
            </div>

            {/* Affichage du total calculé */}
            {formData.quantiteAcquise > 0 && formData.prixUnitaire > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Total calculé:</strong> {((formData.quantiteAcquise * formData.prixUnitaire) + formData.fraisConnexes).toLocaleString()} XAF
                </p>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Acquisitions;