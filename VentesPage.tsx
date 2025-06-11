import { useState } from 'react';

type Vente = {
  responsable: string;
  livreur: string;
  quantite: number;
  montantNet: number;
  montantRecu: number;
  modePaiement: number;
  frais: number;
  dateVente: string;
};

type FormData = {
  responsable: string;
  livreur: string;
  quantite: number; 
  montantNet: number;
  montantRecu: number;
  modePaiement: number;
  frais: number;
  dateVente: string;
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
    dateVente: '',
  });

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [showFrais, setShowFrais] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Conversion des champs numériques en nombres
    const nouvelleVente: Vente = {
      responsable: formData.responsable,
      livreur: formData.livreur,
      quantite: formData.quantite,
      montantNet: formData.montantNet,
      montantRecu: formData.montantRecu,
      modePaiement: formData.modePaiement,
      frais: formData.frais,
      dateVente: formData.dateVente,
    };

    const nouvellesVentes = [...ventes, nouvelleVente].sort((a, b) =>
      b.dateVente.localeCompare(a.dateVente)
    );
    setVentes(nouvellesVentes);

    setFormData({
      responsable: '',
      livreur: '',
      quantite: 0,
      montantNet: 0,
      montantRecu: 0,
      modePaiement: 0,
      frais: 0,
      dateVente: '',
    });
    setShowFrais(false);
  };

  const getModePaiementLabel = (mode: number): string => {
    switch (mode) {
      case 1:
        return 'Cash';
      case 2:
        return 'Orange Money';
      case 3:
        return 'Mobile Money';
      default:
        return '';
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
              >
                Enregistrer la Vente
              </button>
            </div>
          </form>
        </section>

        <section id="liste-ventes" className="mt-12">
          <div className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-center">Liste des Ventes</h2>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-[#00866e] text-sm">
              <thead className="bg-[#00866e] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Responsable</th>
                  <th className="px-4 py-2 text-left">Quantité</th>
                  <th className="px-4 py-2 text-left">Montant Net</th>
                  <th className="px-4 py-2 text-left">Montant Reçu</th>
                  <th className="px-4 py-2 text-left">Mode Paiement</th>
                  <th className="px-4 py-2 text-left">Frais</th>
                  <th className="px-4 py-2 text-left">Livreur</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-6 text-gray-500 italic">
                      Aucune vente enregistrée.
                    </td>
                  </tr>
                ) : (
                  ventes.map((vente, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{vente.dateVente}</td>
                      <td className="px-4 py-2">{vente.responsable}</td>
                      <td className="px-4 py-2">{vente.quantite}</td>
                      <td className="px-4 py-2">{vente.montantNet}</td>
                      <td className="px-4 py-2">{vente.montantRecu}</td>
                      <td className="px-4 py-2">{getModePaiementLabel(vente.modePaiement)}</td>
                      <td className="px-4 py-2">{vente.frais}</td>
                      <td className="px-4 py-2">{vente.livreur}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VentesPage;
