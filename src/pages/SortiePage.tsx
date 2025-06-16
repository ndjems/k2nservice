import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Sortie = {
  article: string;
  quantite: number;
  motif: string;
  responsable: string;
  date: string;
};

const SortiePage: React.FC = () => {
  const [article, setArticle] = useState('');
  const [quantite, setQuantite] = useState<number | ''>('');
  const [motif, setMotif] = useState('');
  const [dateSortie, setDateSortie] = useState(new Date().toISOString().split('T')[0]);
  const [responsable, setResponsable] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sorties, setSorties] = useState<Sortie[]>([]);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!article || !quantite || !motif || !responsable) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    const sortie: Sortie = {
      article,
      quantite: Number(quantite),
      motif,
      responsable,
      date: dateSortie,
    };

    setSorties((prev) => [...prev, sortie].sort((a, b) => b.date.localeCompare(a.date)));
    setArticle('');
    setQuantite('');
    setMotif('');
    setResponsable('');
    setSuccessMessage('Sortie enregistrée avec succès !');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
      <header className="max-w-4xl mx-auto mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center">Enregistrement des Sorties</h1>
      </header>

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
            <input
              type="number"
              min="0"
              value={quantite}
              onChange={(e) => setQuantite(Number(e.target.value))}
              required
              className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
            />
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
            <label className="block text-sm font-medium text-gray-700">Date de sortie</label>
            <input
              type="date"
              value={dateSortie}
              onChange={(e) => setDateSortie(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-[#00809f] text-black font-semibold py-2 px-4 rounded-lg transition"
            >
              Retour
            </button>
            <button
              type="submit"
              className="bg-[#00866e] hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Enregistrer
            </button>
          </div>

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
                  <th className="px-4 py-2 text-left">Motif</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center px-4 py-6 text-gray-500 italic">
                      Aucune sortie enregistrée.
                    </td>
                  </tr>
                ) : (
                  sorties.map((sortie, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{sortie.date}</td>
                      <td className="px-4 py-2">{sortie.responsable}</td>
                      <td className="px-4 py-2">{sortie.article}</td>
                      <td className="px-4 py-2">{sortie.quantite}</td>
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
  );
};

export default SortiePage;
