import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';

type Sortie = {
  article: string;
  quantite: number;
  unite: 'nombre' | 'kg';
  motif: string;
  responsable: string;
  date: string;
};

const SortiePage: React.FC = () => {
  const [article, setArticle] = useState('');
  const [quantite, setQuantite] = useState<number | ''>('');
  const [quantiteUnite, setQuantiteUnite] = useState<'nombre' | 'kg'>('nombre');
  const [motif, setMotif] = useState('');
  // Initialise la date au format yyyy-mm-dd (compatible input type=date)
  function getTodayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  }
  const [dateSortie, setDateSortie] = useState(getTodayISO());
  const [responsable, setResponsable] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState<string>("");
  const [sorties, setSorties] = useState<Sortie[]>([]);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!responsable.trim() || !article.trim() || quantite === '' || !motif.trim() || !dateSortie) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }
    // Validation quantité selon unité
    if (quantiteUnite === 'nombre') {
      if (!Number.isInteger(Number(quantite)) || Number(quantite) <= 0) {
        setFormError("La quantité doit être un nombre entier positif.");
        return;
      }
    } else {
      if (isNaN(Number(quantite)) || Number(quantite) <= 0) {
        setFormError("La quantité en kilogramme doit être un nombre positif.");
        return;
      }
    }

    setFormError("");
    const sortie: Sortie = {
      article,
      quantite: Number(quantite),
      motif,
      responsable,
      date: dateSortie,
      unite: quantiteUnite,
    };

    setSorties((prev) => [...prev, sortie].sort((a, b) => b.date.localeCompare(a.date)));
    setArticle('');
    setQuantite('');
    setMotif('');
    setResponsable('');
    setDateSortie(getTodayISO());
    setSuccessMessage('Sortie enregistrée avec succès !');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
        <main className="max-w-3xl mx-auto space-y-10">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsable</label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Article</label>
              <input
                type="text"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantité</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  step={quantiteUnite === 'nombre' ? 1 : 0.01}
                  value={quantite}
                  onChange={e => {
                    const val = e.target.value;
                    if (quantiteUnite === 'nombre') {
                      // Entier uniquement
                      if (val === '' || /^\d+$/.test(val)) {
                        setQuantite(val === '' ? '' : Number(val));
                      }
                    } else {
                      // Décimal accepté
                      if (val === '' || /^\d*(\.\d{0,2})?$/.test(val)) {
                        setQuantite(val === '' ? '' : Number(val));
                      }
                    }
                  }}
                  onFocus={e => {
                    if (e.target.value === '0') {
                      e.target.value = '';
                      setQuantite('');
                    }
                  }}
                  onBlur={e => {
                    if (e.target.value === '') {
                      setQuantite(0);
                    }
                  }}
                  inputMode={quantiteUnite === 'nombre' ? 'numeric' : 'decimal'}
                  pattern={quantiteUnite === 'nombre' ? '[0-9]*' : undefined}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
                <select
                  value={quantiteUnite}
                  onChange={e => setQuantiteUnite(e.target.value)}
                  className="mt-1 block rounded-md border-2 border-[#00866e] bg-white text-gray-700 px-2 py-1"
                >
                  <option value="nombre">Nombre</option>
                  <option value="kg">Kilogramme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Motif</label>
              <input
                type="text"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
              />
            </div>

            <div>
              <label htmlFor="dateSortie" className="block text-sm font-medium text-gray-700">
                Date de sortie
              </label>
              <input
                type="date"
                id="dateSortie"
                name="dateSortie"
                value={dateSortie}
                onChange={e => setDateSortie(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
              />

            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white text-[#00866e] border-2 border-[#00866e] font-semibold py-2 px-4 rounded-lg transition hover:bg-[#00866e] hover:text-white hover:border-[#00866e]"
              >
                Retour
              </button>
              <button
                type="submit"
                className="bg-[#00866e] text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-400 hover:text-white hover:border-[#00866e] border-2 border-[#00866e]"
              >
                Enregistrer
              </button>
            </div>

            {formError && (
              <div className="text-red-600 font-medium text-center">{formError}</div>
            )}
            {successMessage && (
              <div className="text-green-600 font-medium text-center">{successMessage}</div>
            )}
          </form>

          <section>
            <div className="max-w-4xl mx-auto mb-6 bg-[#138735] text-white p-4 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-center">Historique des Sorties</h2>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-[#00866e] text-sm">
                <thead className="bg-[#00866e] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Responsable</th>
                    <th className="px-4 py-2 text-left">Article</th>
                    <th className="px-4 py-2 text-left">Quantité</th>
                    <th className="px-4 py-2 text-left">Unité</th>
                    <th className="px-4 py-2 text-left">Motif</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sorties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center px-4 py-6 text-gray-500 italic">
                        Aucune sortie enregistrée.
                      </td>
                    </tr>
                  ) : (
                    sorties.map((sortie, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{sortie.date ? sortie.date.split('-').reverse().join('/') : ''}</td>
                        <td className="px-4 py-2">{sortie.responsable}</td>
                        <td className="px-4 py-2">{sortie.article}</td>
                        <td className="px-4 py-2">{sortie.quantite}</td>
                        <td className="px-4 py-2">{sortie.unite === 'kg' ? 'Kilogramme' : 'Nombre'}</td>
                        <td className="px-4 py-2">{sortie.motif}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SortiePage;
