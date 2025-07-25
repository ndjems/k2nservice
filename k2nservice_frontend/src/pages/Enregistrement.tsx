import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios'; // Assure-toi que tu l'as installé : `npm install axios`

const Enregistrement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
    categorie: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.nom || !formData.email || !formData.categorie) {
    toast({
      title: "Erreur",
      description: "Veuillez remplir tous les champs obligatoires",
      variant: "destructive",
    });
    return;
  }

  try {
    await axios.post("http://localhost:9001/contact", {
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      entreprise: formData.adresse, // Ou adapte selon ton backend
      message: formData.notes,
    });

    toast({
      title: "Succès",
      description: "Enregistrement effectué avec succès",
    });

    handleReset();
  } catch (error) {
    console.error(error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement",
      variant: "destructive",
    });
  }
};


  function handleReset() {
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      categorie: '',
      notes: '',
    });
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <DashboardHeader onSearch={setSearchQuery} />
      
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <UserPlus className="w-8 h-8" />
              Enregistrement
            </h1>
            <p className="text-muted-foreground">
              Formulaire d'enregistrement de nouvelles données
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2 bg-green-700 hover:bg-green-900">
              <X className="w-4 h-4" />
              Réinitialiser
            </Button>
            <Button form="enregistrement-form" type="submit" className="gap-2 bg-green-700 hover:bg-green-900">
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Formulaire d'enregistrement */}
        <Card>
          <CardHeader>
            <CardTitle>Nouveau enregistrement</CardTitle>
            <CardDescription>
              Saisissez les informations pour créer un nouvel enregistrement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="enregistrement-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom et prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorie">Catégorie *</Label>
                  <Select value={formData.categorie} onValueChange={(value) => handleInputChange('categorie', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="fournisseur">Fournisseur</SelectItem>
                      <SelectItem value="employe">Employé</SelectItem>
                      <SelectItem value="partenaire">Partenaire</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Adresse</h3>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    placeholder="123 rue de la Paix"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Paris"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input
                      id="codePostal"
                      value={formData.codePostal}
                      onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      placeholder="75001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Input
                      id="pays"
                      value={formData.pays}
                      onChange={(e) => handleInputChange('pays', e.target.value)}
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes supplémentaires</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informations complémentaires..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Informations obligatoires */}
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-sm text-primary font-medium">
                  * Champs obligatoires
                </p>
                <p className="text-xs text-primary mt-1">
                  Assurez-vous de remplir tous les champs marqués d'un astérisque
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>
              Conseils pour un enregistrement optimal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Conseils de saisie</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vérifiez l'orthographe des noms et emails</li>
                  <li>• Utilisez des formats standards pour les téléphones</li>
                  <li>• Soyez précis dans la catégorisation</li>
                  <li>• Ajoutez des notes pour faciliter le suivi</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sécurité des données</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Toutes les données sont chiffrées</li>
                  <li>• Accès restreint aux utilisateurs autorisés</li>
                  <li>• Sauvegarde automatique des informations</li>
                  <li>• Respect des réglementations RGPD</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Enregistrement;
