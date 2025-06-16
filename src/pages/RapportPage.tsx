import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function RapportPage() {
  const [typeRapport, setTypeRapport] = useState("mois");
  const [dateUnique, setDateUnique] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [aucuneDonnee, setAucuneDonnee] = useState(false);
  // const [statsData, setStatsData] = useState<number[]>([12, 19, 3, 5, 2, 3]); // Remplace par [] pour tester le message
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const showDateSpecifique = typeRapport === "jour";
  const showPeriodeSpecifique = typeRapport === "periode";
  const showMensuel = typeRapport === "mois";
  const showAnnuel = typeRapport === "annee";

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
    const joursDansMois = 30; // simplification
    for (let i = 1; i <= joursDansMois; i++) {
      labels.push(`${i}/${mois}/${annee}`);
      data.push(Math.floor(Math.random() * 100));
    }
  } else if (typeRapport === "annee") {
    labels = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
    data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
  }

// const data = []; // ← simule l’absence de données pour tester
setAucuneDonnee(data.length === 0);


  if (chartInstance.current) {
    chartInstance.current.data.labels = labels;
    chartInstance.current.data.datasets[0].data = data;
    chartInstance.current.update();
  } else if (chartRef.current) {
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Ventes",
          data,
          backgroundColor: "rgba(0, 128, 159, 0.7)",
        }],
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

  const handleRetour = () => {
    window.location.href = "pageprincipale.html";
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 py-0 px-0">
        <header className="max-w-6xl mx-auto my-8 bg-[#138735] text-white p-6 rounded-xl shadow-lg">
             <h1 className="text-3xl font-bold text-center">Rapport des Ventes</h1>
        </header>

      <main className="max-w-5xl mx-h-auto px-4 space-y-12 pb-12">
        <section id="options-rapport" className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-[#00866e]">Options du Rapport</h2>

          <fieldset className="space-y-4 border border-[#00866e] rounded-md p-4">
            <legend className="text-lg font-semibold text-[#00866e]">Choix du type</legend>

            <div>
              <label htmlFor="type-rapport" className="block text-sm font-medium text-gray-700">
                Type de Rapport:
              </label>
              <select
                id="type-rapport"
                value={typeRapport}
                onChange={(e) => setTypeRapport(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
              >
                <option value="jour">Jour Spécifique</option>
                <option value="periode">Période Spécifique</option>
                <option value="mois">Mensuel</option>
                <option value="annee">Annuel</option>
              </select>
            </div>

            {showDateSpecifique && (
              <div>
                <label htmlFor="date-unique" className="block text-sm font-medium text-gray-700">
                  Choisir un Jour:
                </label>
                <input
                  type="date"
                  id="date-unique"
                  value={dateUnique}
                  onChange={(e) => setDateUnique(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
              </div>
            )}

            {showPeriodeSpecifique && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date-debut" className="block text-sm font-medium text-gray-700">
                    Date de Début:
                  </label>
                  <input
                    type="date"
                    id="date-debut"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
                <div>
                  <label htmlFor="date-fin" className="block text-sm font-medium text-gray-700">
                    Date de Fin:
                  </label>
                  <input
                    type="date"
                    id="date-fin"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
              </div>
            )}

            {showMensuel && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mois" className="block text-sm font-medium text-gray-700">
                    Mois:
                  </label>
                  <select
                    id="mois"
                    value={mois}
                    onChange={(e) => setMois(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  >
                    <option value="">Sélectionner un mois</option>
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
                  <label htmlFor="annee-mois" className="block text-sm font-medium text-gray-700">
                    Année:
                  </label>
                  <input
                    type="number"
                    id="annee-mois"
                    value={annee}
                    onChange={(e) => setAnnee(e.target.value)}
                    min="2010"
                    max="2100"
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
              </div>
            )}

            {showAnnuel && (
              <div>
                <label htmlFor="annee" className="block text-sm font-medium text-gray-700">
                  Année:
                </label>
                <input
                  type="number"
                  id="annee"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  min="2010"
                  max="2100"
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
              </div>
            )}
          </fieldset>
        </section>

        <div className="flex justify-between">
          <button
            onClick={handleRetour}
            className="bg-gray-300 hover:bg-[#00809f] text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            Retour
          </button>
          <button
            onClick={genererRapport}
            className="bg-[#00866e] hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Générer le Rapport
          </button>
        </div>

        <section
          id="statistiques-ventes"
          className="mt-12"
        >
          <div className="max-w-4xl mx-auto bg-[#138735] text-white p-4 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-center mb-6">Statistiques des Ventes</h2>
            <div className="w-full flex justify-center">
              {aucuneDonnee ? (
                <div className="text-center text-lg text-white font-semibold py-20">
                  Aucune donnée disponible pour cette période.
                </div>
              ) : (
                <canvas ref={chartRef} className="w-full max-w-4xl h-[400px] bg-white rounded-lg shadow-md" />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RapportPage;
