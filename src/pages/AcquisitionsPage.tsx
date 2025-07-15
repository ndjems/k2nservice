// src/pages/AcquisitionsPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Configuration d'axios (doit pointer vers votre backend unique)
const api = axios.create({
  baseURL: "http://localhost:3001/api", // Pointe vers le backend unique (FastAPI + SQLite)
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types pour les données d'acquisition (doivent correspondre aux modèles Pydantic du backend)
type TrancheData = {
  date: string;
  montant: number; // Maintenant un entier
};

type Acquisition = {
  id: string; // UUID du backend
  responsable_acquisition: string; // Nouveau champ
  nature_acquisition: string;
  quantite_acquise: number; // Reste un nombre décimal pour la quantité
  prix_unitaire: number; // Maintenant un entier
  frais_acquisition: number; // Maintenant un entier
  frais_connexes: number; // Maintenant un entier
  total_frais: number; // Maintenant un entier
  type_acquisition: string;
  date_acquisition: string;
  dates_acquisition_tranches: TrancheData[] | null; // Array of objects
  details: string | null;
  commentaires: string | null;
  last_modified_at: string;
};

type FormData = {
  responsableAcquisition: string; // Nouveau champ
  natureAcquisition: string;
  quantiteAcquise: number; // Reste un nombre décimal pour la quantité
  prixUnitaire: number; // Maintenant un entier
  fraisAcquisition: number; // Calculé, mais gardé dans formData pour l'affichage (entier)
  fraisConnexes: number; // Maintenant un entier
  totalFrais: number; // Calculé, mais gardé dans formData pour l'affichage (entier)
  typeAcquisition: string;
  dateAcquisition: string;
  datesAcquisitionTranches: TrancheData[]; // Array of objects
  details: string;
  commentaires: string;
};

const AcquisitionsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    responsableAcquisition: "", // Initialisation du nouveau champ
    natureAcquisition: "",
    quantiteAcquise: 0,
    prixUnitaire: 0,
    fraisAcquisition: 0,
    fraisConnexes: 0,
    totalFrais: 0,
    typeAcquisition: "",
    dateAcquisition: "",
    datesAcquisitionTranches: [{ date: "", montant: 0 }], // Initial avec une tranche vide
    details: "",
    commentaires: "",
  });

  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showTranches = formData.typeAcquisition === "tranches";

  // Calcul des frais d'acquisition et du total des frais
  useEffect(() => {
    // Assurez-vous que les calculs donnent des entiers pour les montants
    const calculatedFraisAcquisition = Math.round(formData.quantiteAcquise * formData.prixUnitaire);
    const total = calculatedFraisAcquisition + formData.fraisConnexes; // fraisConnexes est déjà un entier
    setFormData((fd) => ({
      ...fd,
      fraisAcquisition: calculatedFraisAcquisition,
      totalFrais: total,
    }));
  }, [formData.quantiteAcquise, formData.prixUnitaire, formData.fraisConnexes]);

  // Fonction pour charger les acquisitions depuis le backend
  const fetchAcquisitions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Acquisition[]>("/acquisitions");
      setAcquisitions(
        response.data.sort(
          (a, b) =>
            new Date(b.date_acquisition).getTime() -
            new Date(a.date_acquisition).getTime()
        )
      );
    } catch (err) {
      console.error("Erreur lors du chargement des acquisitions:", err);
      setError("Impossible de charger les acquisitions. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les acquisitions au premier rendu du composant
  useEffect(() => {
    fetchAcquisitions();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      let parsedValue: string | number;
      if (type === "number") {
        // Pour les quantités (float)
        if (name === "quantiteAcquise") {
          parsedValue = value === "" ? 0 : parseFloat(value);
        } else { // Pour tous les autres montants (entiers)
          parsedValue = value === "" ? 0 : parseInt(value, 10);
        }
      } else {
        parsedValue = value;
      }
      return { ...prev, [name]: parsedValue };
    });
  }

  function ajouterDateTranche() {
    setFormData((prev) => ({
      ...prev,
      datesAcquisitionTranches: [...prev.datesAcquisitionTranches, { date: "", montant: 0 }],
    }));
  }

  function handleTrancheChange(index: number, field: 'date' | 'montant', value: string | number) {
    setFormData((prev) => {
      const newTranches = [...prev.datesAcquisitionTranches];
      if (field === 'montant') {
        newTranches[index] = { ...newTranches[index], [field]: parseInt(value as string, 10) || 0 }; // Parse en entier
      } else {
        newTranches[index] = { ...newTranches[index], [field]: value as string };
      }
      return { ...prev, datesAcquisitionTranches: newTranches };
    });
  }

  function validate(): boolean {
    if (!formData.responsableAcquisition.trim()) { // Validation du nouveau champ
      setError("Veuillez entrer le nom du responsable de l'acquisition.");
      return false;
    }
    if (!formData.natureAcquisition.trim()) {
      setError("Veuillez entrer la nature du produit acquis.");
      return false;
    }
    if (formData.quantiteAcquise <= 0) {
      setError("Veuillez entrer une quantité acquise valide (> 0).");
      return false;
    }
    if (formData.prixUnitaire <= 0) {
      setError("Veuillez entrer un prix unitaire valide (> 0).");
      return false;
    }
    if (!formData.typeAcquisition) {
      setError("Veuillez sélectionner le type d'acquisition.");
      return false;
    }
    if (!formData.dateAcquisition) {
      setError("Veuillez entrer la date d'acquisition.");
      return false;
    }
    if (showTranches) {
      for (let i = 0; i < formData.datesAcquisitionTranches.length; i++) {
        const tranche = formData.datesAcquisitionTranches[i];
        if (!tranche.date) {
          setError(`Veuillez remplir la date de la tranche ${i + 1}.`);
          return false;
        }
        if (tranche.montant <= 0) {
          setError(`Veuillez entrer un montant valide (> 0) pour la tranche ${i + 1}.`);
          return false;
        }
      }
    }
    setError(null); // Clear previous errors if validation passes
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      // Préparer les données pour l'envoi au backend
      const payload = {
        responsableAcquisition: formData.responsableAcquisition, // Nouveau champ
        natureAcquisition: formData.natureAcquisition,
        quantiteAcquise: formData.quantiteAcquise,
        prixUnitaire: formData.prixUnitaire,
        fraisConnexes: formData.fraisConnexes,
        typeAcquisition: formData.typeAcquisition,
        dateAcquisition: formData.dateAcquisition,
        datesAcquisitionTranches: showTranches ? formData.datesAcquisitionTranches : null, // Envoyer null si pas en tranches
        details: formData.details || null,
        commentaires: formData.commentaires || null,
      };

      const response = await api.post<Acquisition>("/acquisitions", payload);
      setAcquisitions((prev) =>
        [...prev, response.data].sort(
          (a, b) =>
            new Date(b.date_acquisition).getTime() -
            new Date(a.date_acquisition).getTime()
        )
      );
      setSuccessMessage("Acquisition enregistrée avec succès !");
      
      // Réinitialiser le formulaire
      setFormData({
        responsableAcquisition: "", // Réinitialisation du nouveau champ
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
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'acquisition:", err);
      setError("Échec de l'enregistrement de l'acquisition. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
      <header className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center">
          Enregistrer une Acquisition
        </h1>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        <section>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-2xl shadow-md max-w-6xl mx-auto"
          >
            {/* Messages de succès/erreur */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-semibold text-[#00866e]">
                  Produit Acquis
                </legend>
                {/* Nouveau champ: Responsable Acquisition */}
                <div>
                  <label
                    htmlFor="responsable-acquisition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Responsable de l'Acquisition:
                  </label>
                  <input
                    type="text"
                    id="responsable-acquisition"
                    name="responsableAcquisition"
                    value={formData.responsableAcquisition}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nature-acquisition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nature du Produit Acquis:
                  </label>
                  <input
                    type="text"
                    id="nature-acquisition"
                    name="natureAcquisition"
                    value={formData.natureAcquisition}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantite-acquise"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantité Acquise :
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step="0.01" // La quantité peut avoir des décimales (ex: 1.5)
                    id="quantite-acquise"
                    name="quantiteAcquise"
                    value={formData.quantiteAcquise}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                {/* Nouveau champ: Prix Unitaire */}
                <div>
                  <label
                    htmlFor="prix-unitaire"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Prix Unitaire (XAF):
                  </label>
                  <input
                    type="number"
                    inputMode="numeric" // Pas de décimales
                    min={0}
                    id="prix-unitaire"
                    name="prixUnitaire"
                    value={formData.prixUnitaire}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                {/* Nouveau champ: Détails */}
                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Détails (ex: type de poisson, taille):
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  ></textarea>
                </div>
                {/* Nouveau champ: Commentaires */}
                <div>
                  <label
                    htmlFor="commentaires"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Commentaires:
                  </label>
                  <textarea
                    id="commentaires"
                    name="commentaires"
                    value={formData.commentaires}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  ></textarea>
                </div>
              </fieldset>

              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-semibold text-[#00866e]">
                  Détails de l'Acquisition
                </legend>
                <div>
                  <label
                    htmlFor="frais-acquisition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Frais d'Acquisition (Quantité * Prix Unitaire) (XAF):
                  </label>
                  <input
                    type="number"
                    id="frais-acquisition"
                    name="fraisAcquisition"
                    value={formData.fraisAcquisition} // Pas de toFixed(2) car entier
                    readOnly // Rendu en lecture seule car calculé
                    className="mt-1 block w-full bg-gray-100 border-2 border-[#00866e] rounded-md px-3 py-2 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="frais-connexes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Frais Connexes (XAF):
                  </label>
                  <input
                    type="number"
                    inputMode="numeric" // Pas de décimales
                    min={0}
                    id="frais-connexes"
                    name="fraisConnexes"
                    value={formData.fraisConnexes}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="total-frais"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total des Frais (Frais Acquisition + Frais Connexes) (XAF):
                  </label>
                  <input
                    type="number"
                    id="total-frais"
                    name="totalFrais"
                    value={formData.totalFrais} // Pas de toFixed(2) car entier
                    readOnly // Rendu en lecture seule car calculé
                    className="mt-1 block w-full bg-gray-100 border-2 border-[#00866e] rounded-md px-3 py-2 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type-acquisition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type d'Acquisition:
                  </label>
                  <select
                    id="type-acquisition"
                    name="typeAcquisition"
                    value={formData.typeAcquisition}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="totale">Totale</option>
                    <option value="tranches">En Tranches</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="date-acquisition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date d'Acquisition:
                  </label>
                  <input
                    type="date"
                    id="date-acquisition"
                    name="dateAcquisition"
                    value={formData.dateAcquisition}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    disabled={isLoading}
                  />
                </div>
                {showTranches && (
                  <div className="mb-4 border-t pt-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Dates et Montants des Tranches (XAF):
                    </label>
                    {formData.datesAcquisitionTranches.map((tranche, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="date"
                          className="flex-1 rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                          value={tranche.date}
                          onChange={(e) =>
                            handleTrancheChange(index, "date", e.target.value)
                          }
                          required
                          disabled={isLoading}
                        />
                        <input
                          type="number"
                          inputMode="numeric" // Pas de décimales
                          min={0}
                          className="w-1/3 rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                          value={tranche.montant}
                          onChange={(e) =>
                            handleTrancheChange(index, "montant", e.target.value)
                          }
                          required
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={ajouterDateTranche}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      Ajouter Tranche
                    </button>
                  </div>
                )}
              </fieldset>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-300 hover:bg-[#00809f] text-black font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Retour
              </button>
              <button
                type="submit"
                className="bg-[#00866e] hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer l'Acquisition"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-12">
          <div className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-center">
              Liste des Acquisitions
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-md">
            {isLoading && <p className="text-center text-gray-600">Chargement des acquisitions...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!isLoading && !error && acquisitions.length === 0 && (
              <p className="text-center px-4 py-6 text-gray-500 italic">
                Aucune acquisition enregistrée.
              </p>
            )}

            {!isLoading && !error && acquisitions.length > 0 && (
              <table className="min-w-full divide-y divide-[#00866e] text-sm">
                <thead className="bg-[#00866e] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">ID (court)</th>
                    <th className="px-4 py-2 text-left">Responsable</th> {/* Nouveau champ */}
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Nature</th>
                    <th className="px-4 py-2 text-left">Quantité </th>
                    <th className="px-4 py-2 text-left">Prix Unitaire (XAF)</th>
                    <th className="px-4 py-2 text-left">Frais Acquisition (XAF)</th>
                    <th className="px-4 py-2 text-left">Frais Connexes (XAF)</th>
                    <th className="px-4 py-2 text-left">Total Frais (XAF)</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Tranches (Date/Montant)</th>
                    <th className="px-4 py-2 text-left">Détails</th>
                    <th className="px-4 py-2 text-left">Commentaires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acquisitions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2">{item.responsable_acquisition}</td> {/* Affichage nouveau champ */}
                      <td className="px-4 py-2">{new Date(item.date_acquisition).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{item.nature_acquisition}</td>
                      <td className="px-4 py-2">{item.quantite_acquise.toFixed(2)}</td>
                      <td className="px-4 py-2">{item.prix_unitaire}</td> {/* Pas de toFixed(2) */}
                      <td className="px-4 py-2">{item.frais_acquisition}</td> {/* Pas de toFixed(2) */}
                      <td className="px-4 py-2">{item.frais_connexes}</td> {/* Pas de toFixed(2) */}
                      <td className="px-4 py-2">{item.total_frais}</td> {/* Pas de toFixed(2) */}
                      <td className="px-4 py-2 capitalize">{item.type_acquisition}</td>
                      <td className="px-4 py-2">
                        {item.type_acquisition === "tranches" && item.dates_acquisition_tranches
                          ? item.dates_acquisition_tranches
                              .map((t) => `${new Date(t.date).toLocaleDateString()} (${t.montant})`) // Pas de toFixed(2)
                              .join(", ")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2">{item.details || "N/A"}</td>
                      <td className="px-4 py-2">{item.commentaires || "N/A"}</td>
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

export default AcquisitionsPage;
