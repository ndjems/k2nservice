import { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type ResultatStock = {
  nom: string;
  totalAcquis: number;
  quantiteRestante: number;
};

function StockPage() {
  const [typeRapport, setTypeRapport] = useState("mois");
  const [dateUnique, setDateUnique] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [aucuneDonnee, setAucuneDonnee] = useState(false);
  const [resultats, setResultats] = useState<ResultatStock[]>([]);
  const [afficherResultats, setAfficherResultats] = useState(false);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const showDateSpecifique = typeRapport === "jour";
  const showPeriodeSpecifique = typeRapport === "periode";
  const showMensuel = typeRapport === "mois";
  const showAnnuel = typeRapport === "annee";

  const genererDonneesSimulees = () => {
    const articles = [
      { nom: "Sac de riz", totalAcquis: 100, quantiteVendue: 40 },
      { nom: "Huile végétale", totalAcquis: 50, quantiteVendue: 20 },
      { nom: "Savon", totalAcquis: 200, quantiteVendue: 150 },
    ];

    const donnees = articles.map((article) => ({
      nom: article.nom,
      totalAcquis: article.totalAcquis,
      quantiteRestante: article.totalAcquis - article.quantiteVendue,
    }));

    setResultats(donnees);
    setAfficherResultats(true);
    genererRapport();
  };

  const genererRapport = () => {
    let labels: string[] = [];
    let data: number[] = [];

    if (typeRapport === "jour") {
      labels = [dateUnique];
      data = [Math.floor(Math.random() * 100)];
    } else if (typeRapport === "periode") {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      const jours = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 3600 * 24)) + 1;

      for (let i = 0; i < jours; i++) {
        const current = new Date(debut);
        current.setDate(debut.getDate() + i);
        labels.push(current.toISOString().split("T")[0]);
        data.push(Math.floor(Math.random() * 100));
      }
    } else if (typeRapport === "mois") {
      const joursDansMois = 30;
      for (let i = 1; i <= joursDansMois; i++) {
        labels.push(`${i}/${mois}/${annee}`);
        data.push(Math.floor(Math.random() * 100));
      }
    } else if (typeRapport === "annee") {
      labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
    }

    setAucuneDonnee(data.length === 0);

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Ventes",
              data,
              backgroundColor: "rgba(0, 128, 159, 0.7)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-2 md:p-6">
      <header className="text-center text-white bg-[#138735] p-4 md:p-6 rounded-xl shadow-lg mb-4 md:mb-8 w-full">
        <h1 className="text-2xl md:text-3xl font-bold">Suivi du Stock</h1>
      </header>

      <section className="w-full max-w-full md:max-w-6xl mx-auto bg-white p-4 md:p-8 rounded-xl shadow space-y-6">
        <h2 className="text-lg md:text-xl font-bold text-[#00866e]">Options du Rapport</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type de Rapport:</label>
          <select
            value={typeRapport}
            onChange={(e) => setTypeRapport(e.target.value)}
            className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
          >
            <option value="jour">Jour Spécifique</option>
            <option value="periode">Période Spécifique</option>
            <option value="mois">Mensuel</option>
            <option value="annee">Annuel</option>
          </select>
        </div>

        {showDateSpecifique && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={dateUnique}
              onChange={(e) => setDateUnique(e.target.value)}
              className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
            />
          </div>
        )}

        {showPeriodeSpecifique && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de Début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de Fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
              />
            </div>
          </div>
        )}

        {showMensuel && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mois</label>
              <select
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
              >
                <option value="">Choisir un mois</option>
                <option value="01">Janvier</option>
                <option value="02">Février</option>
                <option value="03">Mars</option>
                <option value="04">Avril</option>
                <option value="05">Mai</option>
                <option value="06">Juin</option>
                <option value="07">Juillet</option>
                <option value="08">Août</option>
                <option value="09">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Année</label>
              <input
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
                min="2010"
                max="2100"
              />
            </div>
          </div>
        )}

        {showAnnuel && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Année</label>
            <input
              type="number"
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
              className="mt-1 w-full border-2 border-[#00866e] rounded-md shadow-sm"
              min="2010"
              max="2100"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-300 hover:bg-[#00809f] text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            Retour
          </button>
          <button
            onClick={genererDonneesSimulees}
            className="bg-[#00866e] hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Générer Rapport Stock
          </button>
        </div>
      </section>

      <section className="mt-8 w-full max-w-full md:max-w-6xl mx-auto">
        {afficherResultats && (
          <div className="bg-white p-2 md:p-4 rounded-xl shadow-md mb-8 w-full">
            <h3 className="text-xl font-bold text-center text-[#00866e] mb-4">Résultats</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300 text-xs md:text-base">
                <thead className="bg-[#138735] text-white">
                  <tr>
                    <th className="p-2 border">Article</th>
                    <th className="p-2 border">Total Acquis</th>
                    <th className="p-2 border">Quantité Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {resultats.map((res, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border p-2">{res.nom}</td>
                      <td className="border p-2">{res.totalAcquis}</td>
                      <td className="border p-2">{res.quantiteRestante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white p-2 md:p-4 rounded-xl shadow w-full">
          <h3 className="text-xl font-bold text-center text-[#00866e] mb-4">Graphique des Données</h3>
          {aucuneDonnee ? (
            <div className="text-center text-lg text-[#00866e] py-10">
              Aucune donnée disponible pour cette période.
            </div>
          ) : (
            <div className="w-full h-64 md:h-96">
              <canvas ref={chartRef} className="w-full h-full bg-white rounded-md shadow-md" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StockPage;
