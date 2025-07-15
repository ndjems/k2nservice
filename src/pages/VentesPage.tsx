import { useState } from 'react';
import Sidebar from '../components/Sidebar';


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

const ventesParPage = 7;

const VentesPage = () => {
  const [expanded, setExpanded] = useState(true);

  const [pageCourante, setPageCourante] = useState(1);
  const [ventes, setVentes] = useState<Vente[]>([]);
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

  const [formError, setFormError] = useState("");

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validation stricte : tous les champs obligatoires et nombres entiers
  if (
    !formData.responsable.trim() ||
    !formData.livreur.trim() ||
    formData.quantite === "" ||
    formData.montantNet === "" ||
    formData.montantRecu === "" ||
    formData.modePaiement === 0 ||
    formData.frais === "" ||
    !formData.dateVente
  ) {
    setFormError("Tous les champs sont obligatoires.");
    return;
  }

  // Vérifie que les champs numériques sont des entiers strictement positifs
  if (
    !Number.isInteger(Number(formData.quantite)) || Number(formData.quantite) <= 0 ||
    !Number.isInteger(Number(formData.montantNet)) || Number(formData.montantNet) <= 0 ||
    !Number.isInteger(Number(formData.montantRecu)) || Number(formData.montantRecu) <= 0 ||
    !Number.isInteger(Number(formData.frais)) || Number(formData.frais) < 0
  ) {
    setFormError("Seuls les nombres entiers positifs sont acceptés pour les champs numériques.");
    return;
  }

  setFormError("");

  const nouvelleVente: Vente = {
    responsable: formData.responsable,
    livreur: formData.livreur,
    quantite: Number(formData.quantite),
    montantNet: Number(formData.montantNet),
    montantRecu: Number(formData.montantRecu),
    modePaiement: formData.modePaiement,
    frais: Number(formData.frais),
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

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(ventes.length / ventesParPage));
  const startIndex = (pageCourante - 1) * ventesParPage;
  const endIndex = startIndex + ventesParPage;
  const currentVentes = ventes.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">

        {/* Formulaire toujours en haut */}
        <section id="enregistrer" className="mb-12">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white/95 p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-gray-100 flex flex-col gap-6">

            <div className="flex flex-col md:flex-row gap-8">
              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-bold text-[#00866e]">Acteurs</legend>
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
                    Nom du Livreur (si livraison) :
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
                <legend className="text-lg font-bold text-[#00866e]">Détails de la Vente</legend>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
                      Quantité:
                    </label>
                    <input
                      type="number"
                      min="0"
                      id="quantite"
                      name="quantite"
                      value={formData.quantite}
                      onChange={e => {
                        if (e.target.value === "" || /^\d+$/.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      onFocus={e => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                          setFormData({ ...formData, quantite: "" });
                        }
                      }}
                      onBlur={e => {
                        if (e.target.value === "") {
                          setFormData({ ...formData, quantite: 0 });
                        }
                      }}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="montantNet" className="block text-sm font-medium text-gray-700">
                      Montant Net :
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
                      onFocus={e => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                          setFormData({ ...formData, montantNet: "" });
                        }
                      }}
                      onBlur={e => {
                        if (e.target.value === "") {
                          setFormData({ ...formData, montantNet: 0 });
                        }
                      }}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="montantRecu" className="block text-sm font-medium text-gray-700">
                      Montant Reçu :
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
                      onFocus={e => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                          setFormData({ ...formData, montantRecu: "" });
                        }
                      }}
                      onBlur={e => {
                        if (e.target.value === "") {
                          setFormData({ ...formData, montantRecu: 0 });
                        }
                      }}
                      required
                      className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modePaiement" className="block text-sm font-medium text-gray-700">
                      Mode de Paiement :
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
                        Frais :
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
                        onFocus={e => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                            setFormData({ ...formData, frais: "" });
                          }
                        }}
                        onBlur={e => {
                          if (e.target.value === "") {
                            setFormData({ ...formData, frais: 0 });
                          }
                        }}
                        className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="dateVente" className="block text-sm font-medium text-gray-700">
                      Date de la Vente :
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
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-white text-[#00866e] border-2 border-[#00866e] font-semibold py-2 px-4 rounded-lg transition hover:bg-[#00866e] hover:text-white hover:border-[#00866e]"
              >
                Retour
              </button>
              <button
                type="submit"
                className="bg-[#00866e] text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-400 hover:text-white hover:border-[#00866e] border-2 border-[#00866e]"
              >
                Enregistrer la Vente
              </button>
            </div>
          </form>
        </section>

        <section id="liste-ventes" className="mt-12">
          <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-[#138735] to-[#00b86b] text-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 text-center">
  <span className="text-3xl"></span>
  <h2 className="text-3xl font-bold text-center">Liste des Ventes</h2>

</div>
          <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-100">
            <table className="min-w-full divide-y divide-[#00866e] text-sm">
              <colgroup>
                <col span="1" className="w-24" />
                <col span="1" className="w-32" />
                <col span="1" className="w-16" />
                <col span="1" className="w-28" />
                <col span="1" className="w-28" />
                <col span="1" className="w-32" />
                <col span="1" className="w-20" />
                <col span="1" className="w-28" />
              </colgroup>
              <thead className="bg-gradient-to-r from-[#00866e] to-[#00b86b] text-white text-base">
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
              <tbody className="bg-white divide-y divide-gray-100">
                {ventes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-6 text-gray-500 italic">
                      Aucune vente enregistrée.
                    </td>
                  </tr>
                ) : (
                  currentVentes.map((vente, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-green-100 transition' : 'bg-white hover:bg-green-100 transition'}>
                      <td className="px-4 py-2">{vente.dateVente}</td>
                      <td className="px-4 py-2">{vente.responsable}</td>
                      <td className="px-4 py-2">{vente.quantite}</td>
                      <td className="px-4 py-2 text-right">{vente.montantNet}</td>
                      <td className="px-4 py-2 text-right">{vente.montantRecu}</td>
                      <td className="px-4 py-2">
                        <span className={
                          vente.modePaiement === 1 ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold" :
                          vente.modePaiement === 2 ? "bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold" :
                          vente.modePaiement === 3 ? "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold" :
                          "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold"
                        }>
                          {getModePaiementLabel(vente.modePaiement)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{vente.frais}</td>
                      <td className="px-4 py-2">{vente.livreur}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {ventes.length > ventesParPage && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
  onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
  disabled={pageCourante === 1}
  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-[#00b86b] hover:text-white disabled:opacity-50 text-base font-bold border border-gray-300 shadow transition-all"
  title="Page précédente"
>
  ◀️
</button>
<span className="px-4 py-2 rounded-full text-white font-bold bg-[#00b86b] border-2 border-[#00866e] shadow">{pageCourante} / {totalPages}</span>
<button
  onClick={() => setPageCourante((p) => Math.min(totalPages, p + 1))}
  disabled={pageCourante === totalPages}
  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-[#00b86b] hover:text-white disabled:opacity-50 text-base font-bold border border-gray-300 shadow transition-all"
  title="Page suivante"
>
  ▶️
</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VentesPage;
