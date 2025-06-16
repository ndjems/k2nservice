import { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function EtatdefondsPage() {
  const [typeRapport, setTypeRapport] = useState("mois");
  const [dateUnique, setDateUnique] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [aucuneDonnee, setAucuneDonnee] = useState(false);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"bar", number[], string> | null>(null);

  const genererRapport = () => {
    let labels: string[] = [];
    let data: number[] = [];

    if (typeRapport === "jour" && dateUnique) {
      labels = [dateUnique];
      data = [Math.floor(Math.random() * 100)];
    } else if (typeRapport === "periode" && dateDebut && dateFin) {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      const jours = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 3600 * 24)) + 1;
      for (let i = 0; i < jours; i++) {
        const jour = new Date(debut);
        jour.setDate(debut.getDate() + i);
        labels.push(jour.toISOString().split("T")[0]);
        data.push(Math.floor(Math.random() * 100));
      }
    } else if (typeRapport === "mois" && mois && annee) {
      for (let i = 1; i <= 30; i++) {
        labels.push(`${i}/${mois}/${annee}`);
        data.push(Math.floor(Math.random() * 100));
      }
    } else if (typeRapport === "annee" && annee) {
      labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
    }

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
            label: "Fonds",
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

  return (
    <div className="min-h-screen w-full bg-gray-50 py-0 px-0">
      <header className="max-w-6xl mx-auto my-8 bg-[#138735] text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">État des Fonds</h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 space-y-12 pb-12">
        <section className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-[#00866e]">Options du Rapport</h2>

          <fieldset className="space-y-4 border border-[#00866e] rounded-md p-4">
            <legend className="text-lg font-semibold text-[#00866e]">Choix du type</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type de Rapport :</label>
              <select
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

            {typeRapport === "jour" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Choisir une Date :</label>
                <input
                  type="date"
                  value={dateUnique}
                  onChange={(e) => setDateUnique(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
              </div>
            )}

            {typeRapport === "periode" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Début :</label>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Fin :</label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
              </div>
            )}

            {typeRapport === "mois" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mois :</label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700">Année :</label>
                  <input
                    type="number"
                    min="2010"
                    max="2100"
                    value={annee}
                    onChange={(e) => setAnnee(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
              </div>
            )}

            {typeRapport === "annee" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Année :</label>
                <input
                  type="number"
                  min="2010"
                  max="2100"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
              </div>
            )}
          </fieldset>
        </section>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
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

        <section className="mt-12">
          <div className="max-w-4xl mx-auto bg-[#138735] text-white p-4 rounded-xl shadow overflow-x-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Statistiques des Fonds</h2>
            <div className="w-full flex justify-center">
              {aucuneDonnee ? (
                <div className="text-center text-lg text-white font-semibold py-20">
                  Aucune donnée disponible pour cette période.
                </div>
              ) : (
                <canvas ref={chartRef} className="w-full max-w-3xl h-96 bg-white rounded-lg shadow-md" />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EtatdefondsPage;
