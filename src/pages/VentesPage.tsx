// src/pages/VentesPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous que axios est importé

// Configuration d'axios (doit pointer vers votre backend unique)
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Pointe vers le backend unique (FastAPI + SQLite)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types pour les données de vente (DOIVENT MAINTENANT CORRESPONDRE AUX NOMS RÉELS DU BACKEND)
type Vente = {
  id: string; // UUID du backend
  responsable: string;
  livreur: string | null; // Peut être null
  quantite: number;
  montant_net: number; // Changé de montantNet à montant_net
  montant_recu: number; // Changé de montantRecu à montant_recu
  mode_paiement: number; // Changé de modePaiement à mode_paiement
  frais: number | null; // Peut être null
  poids: number; // Nouveau champ pour le poids du poisson
  sale_date: string; // Le backend renvoie un datetime, mais nous le traitons comme string pour l'affichage
  last_modified_at: string;
};

// SaleCreate du backend (données du formulaire) - reste en camelCase pour l'envoi
type FormData = {
  responsable: string;
  livreur: string;
  quantite: number;
  montantNet: number;
  montantRecu: number;
  modePaiement: number;
  frais: number;
  poids: number; // Nouveau champ pour le poids du poisson
  dateVente: string; // Format 'YYYY-MM-DD'
};

const VentesPage = () => {
  const [formData, setFormData] = useState<FormData>({
    responsable: '',
    livreur: '',
    quantite: 0,
    montantNet: 0,
    montantRecu: 0,
    modePaiement: 0,
    frais: 0,
    poids: 0, // Initialisation du nouveau champ
    dateVente: '',
  });

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [showFrais, setShowFrais] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Message de succès

  // Fonction pour charger les ventes depuis le backend
  const fetchSales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Vente[]>('/sales');
      setVentes(response.data.sort((a, b) =>
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime() // Trie par date de vente décroissante
      ));
    } catch (err) {
      console.error('Erreur lors du chargement des ventes:', err);
      setError('Impossible de charger les ventes. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les ventes au premier rendu du composant
  useEffect(() => {
    fetchSales();
  }, []); // Le tableau vide assure que cela ne s'exécute qu'une fois au montage

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convertir les valeurs numériques en nombres
    const parsedValue = ['quantite', 'montantNet', 'montantRecu', 'frais', 'poids'].includes(name) // Ajout de 'poids'
      ? parseFloat(value) || 0 // Utilise parseFloat pour les décimaux, 0 si vide/invalide
      : value;
    
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleModePaiementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let modeValue = 0;
    if (value === 'cash') modeValue = 1;
    else if (value === 'orange-money') modeValue = 2;
    else if (value === 'mobile-money') modeValue = 3;

    setFormData({ ...formData, modePaiement: modeValue });
    setShowFrais(value === 'orange-money' || value === 'mobile-money');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validation simple côté client
    if (!formData.responsable || formData.quantite <= 0 || formData.montantNet <= 0 || !formData.dateVente || formData.poids <= 0) { // Ajout de la validation pour poids
      setError('Veuillez remplir tous les champs obligatoires (Responsable, Quantité, Montant Net, Poids, Date de Vente).');
      setIsLoading(false);
      return;
    }

    try {
      // Envoi des données au backend (les noms de champs ici doivent correspondre au SaleCreate du backend)
      const response = await api.post<Vente>('/sales', {
        responsable: formData.responsable,
        livreur: formData.livreur || null, // Envoyer null si vide
        quantite: formData.quantite,
        montantNet: formData.montantNet, 
        montantRecu: formData.montantRecu,
        modePaiement: formData.modePaiement,
        frais: showFrais ? formData.frais : null, // Envoyer null si les frais ne sont pas affichés
        poids: formData.poids, // Envoi du nouveau champ poids
        dateVente: formData.dateVente, // La date est envoyée comme une chaîne 'YYYY-MM-DD'
      });

      setVentes((prevSales) => [...prevSales, response.data].sort((a, b) =>
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
      )); // Ajoute la nouvelle vente et trie
      
      // Réinitialise le formulaire après succès
      setFormData({
        responsable: '',
        livreur: '',
        quantite: 0,
        montantNet: 0,
        montantRecu: 0,
        modePaiement: 0,
        frais: 0,
        poids: 0, // Réinitialisation du nouveau champ
        dateVente: '',
      });
      setShowFrais(false);
      setSuccessMessage('Vente enregistrée avec succès !');

    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la vente:', err);
      // Gérer les erreurs spécifiques de l'API si nécessaire
      setError('Échec de l\'enregistrement de la vente. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getModePaiementLabel = (mode: number | null): string => { // Accepte null pour le cas où le mode n'est pas défini
    switch (mode) {
      case 1:
        return 'Cash';
      case 2:
        return 'Orange Money';
      case 3:
        return 'Mobile Money';
      default:
        return 'Non spécifié';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
      <header className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center">Enregistrer une Vente</h1>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        <section id="enregistrer">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-md max-w-6xl mx-auto">
            {/* Messages de succès/erreur */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-semibold text-[#00866e]">Acteurs</legend>
                <div>
                  <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">
                    Responsable de la vente:
                  </label>
                  <input
                    type="text"
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
                <div>
                  <label htmlFor="livreur" className="block text-sm font-medium text-gray-700">
                    Nom du Livreur (si livraison):
                  </label>
                  <input
                    type="text"
                    id="livreur"
                    name="livreur"
                    value={formData.livreur}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
              </fieldset>

              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-semibold text-[#00866e]">Détails de la Vente</legend>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
                      Quantité:
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      id="quantite"
                      name="quantite"
                      value={formData.quantite}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="montantNet" className="block text-sm font-medium text-gray-700">
                      Montant Net:
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      id="montantNet"
                      name="montantNet"
                      value={formData.montantNet}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="montantRecu" className="block text-sm font-medium text-gray-700">
                      Montant Reçu:
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      id="montantRecu"
                      name="montantRecu"
                      value={formData.montantRecu}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modePaiement" className="block text-sm font-medium text-gray-700">
                      Mode de Paiement:
                    </label>
                    <select
                      id="modePaiement"
                      name="modePaiement"
                      value={
                        formData.modePaiement === 1
                          ? 'cash'
                          : formData.modePaiement === 2
                          ? 'orange-money'
                          : formData.modePaiement === 3
                          ? 'mobile-money'
                          : ''
                      }
                      onChange={handleModePaiementChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="cash">Cash</option>
                      <option value="orange-money">Orange Money</option>
                      <option value="mobile-money">Mobile Money</option>
                    </select>
                  </div>
                  {showFrais && (
                    <div>
                      <label htmlFor="frais" className="block text-sm font-medium text-gray-700">
                        Frais:
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        id="frais"
                        name="frais"
                        value={formData.frais}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                      />
                    </div>
                  )}
                  {/* Nouveau champ pour le poids */}
                  <div>
                    <label htmlFor="poids" className="block text-sm font-medium text-gray-700">
                      Poids du poisson (kg):
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      id="poids"
                      name="poids"
                      value={formData.poids}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateVente" className="block text-sm font-medium text-gray-700">
                      Date de la Vente:
                    </label>
                    <input
                      type="date"
                      id="dateVente"
                      name="dateVente"
                      value={formData.dateVente}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-300 hover:bg-[#00809f] text-black font-semibold py-2 px-4 rounded-lg transition"
              >
                Retour
              </button>
              <button
                type="submit"
                className="bg-[#00866e] hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                disabled={isLoading} /* Désactiver le bouton pendant le chargement */
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer la Vente'}
              </button>
            </div>
          </form>
        </section>

        <section id="liste-ventes" className="mt-12">
          <div className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-center">Liste des Ventes</h2>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-md">
            {/* Affichage des messages de chargement/erreur/vide */}
            {isLoading && <p className="text-center text-gray-600">Chargement des ventes...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!isLoading && !error && ventes.length === 0 && (
              <p className="text-center px-4 py-6 text-gray-500 italic">
                Aucune vente enregistrée.
              </p>
            )}

            {!isLoading && !error && ventes.length > 0 && (
              <table className="min-w-full divide-y divide-[#00866e] text-sm">
                <thead className="bg-[#00866e] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">ID (court)</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Responsable</th>
                    <th className="px-4 py-2 text-left">Quantité</th>
                    <th className="px-4 py-2 text-left">Montant Net</th>
                    <th className="px-4 py-2 text-left">Montant Reçu</th>
                    <th className="px-4 py-2 text-left">Mode Paiement</th>
                    <th className="px-4 py-2 text-left">Frais</th>
                    <th className="px-4 py-2 text-left">Poids (kg)</th> {/* Nouvelle colonne pour le poids */}
                    <th className="px-4 py-2 text-left">Livreur</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventes.map((vente) => (
                    <tr key={vente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{vente.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2">{new Date(vente.sale_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{vente.responsable}</td>
                      <td className="px-4 py-2">{vente.quantite}</td>
                      <td className="px-4 py-2">{vente.montant_net.toFixed(2)}</td>
                      <td className="px-4 py-2">{vente.montant_recu.toFixed(2)}</td>
                      <td className="px-4 py-2">{getModePaiementLabel(vente.mode_paiement)}</td>
                      <td className="px-4 py-2">{vente.frais !== null ? vente.frais.toFixed(2) : 'N/A'}</td>
                      <td className="px-4 py-2">{vente.poids.toFixed(2)}</td> {/* Affichage du poids */}
                      <td className="px-4 py-2">{vente.livreur || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VentesPage;
