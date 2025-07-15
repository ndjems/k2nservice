import { useState, useEffect } from "react";

type Fonds = {
  id: number;
  nomCrediteur: string;
  sommePercue: number;
  dateFonds: string;
};

type FormData = {
  nomCrediteur: string;
  sommePercue: number;
  dateFonds: string;
};

type Errors = {
  nomCrediteur?: string;
  sommePercue?: string;
  dateFonds?: string;
};

function FondsPage() {
  const [fondsList, setFondsList] = useState<Fonds[]>([]);
  const [pageCourante, setPageCourante] = useState(1);
  const fondsParPage = 7;
  const totalPages = Math.max(1, Math.ceil(fondsList.length / fondsParPage));
  const startIndex = (pageCourante - 1) * fondsParPage;
  const endIndex = startIndex + fondsParPage;
  const currentFonds = fondsList.slice(startIndex, endIndex);
  const [formData, setFormData] = useState<FormData>({
      nomCrediteur: "",
      sommePercue: 0,
      dateFonds: "",
    });
  const [errors, setErrors] = useState<Errors>({});
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    // Suppression de la récupération depuis le localStorage
    setFondsList([]);
  }, []);

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.nomCrediteur.trim()) {
      newErrors.nomCrediteur = "Veuillez entrer le nom du créditeur.";
    }
    if (
      !formData.sommePercue ||
      isNaN(Number(formData.sommePercue)) ||
      Number(formData.sommePercue) <= 0
    ) {
      newErrors.sommePercue = "Veuillez entrer une somme valide (> 0).";
    }
    if (!formData.dateFonds) {
      newErrors.dateFonds = "Veuillez entrer la date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    const nouveauFonds: Fonds = {
      id: Date.now(),
      nomCrediteur: formData.nomCrediteur,
      sommePercue: formData.sommePercue,
      dateFonds: formData.dateFonds,
    };

    // Suppression de l'enregistrement dans le localStorage
    const updatedFondsList = [...fondsList, nouveauFonds];
    setFondsList(updatedFondsList);

    setFeedbackMessage("Fonds enregistré avec succès !");
    setFormData({ nomCrediteur: "", sommePercue: 0, dateFonds: "" });
    setErrors({});

    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
<main className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto mt-20">
        {/* Formulaire */}
        <section className="flex-1 max-w-lg mx-auto md:mx-0">
          <form onSubmit={handleSubmit} noValidate className="bg-white p-6 rounded-2xl shadow-md">
            <fieldset className="border border-[#00866e] rounded-md p-4 space-y-6">
              <legend className="text-lg font-semibold text-[#00866e]">Informations sur le Fonds</legend>

              <div>
                <label htmlFor="nomCrediteur" className="block text-sm font-medium text-gray-700">
                  Nom du Créditeur:
                </label>
                <input
                  type="text"
                  id="nomCrediteur"
                  name="nomCrediteur"
                  value={formData.nomCrediteur}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
                {errors.nomCrediteur && (
                  <p className="text-red-600 text-sm mt-1">{errors.nomCrediteur}</p>
                )}
              </div>

              <div>
                <label htmlFor="sommePercue" className="block text-sm font-medium text-gray-700">
                  Somme Perçue:
                </label>
                <input
                  type="number"
                  id="sommePercue"
                  name="sommePercue"
                  step="0.01"
                  value={formData.sommePercue}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                      setFormData({ ...formData, sommePercue: "" });
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setFormData({ ...formData, sommePercue: 0 });
                    }
                  }}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
                {errors.sommePercue && (
                  <p className="text-red-600 text-sm mt-1">{errors.sommePercue}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateFonds" className="block text-sm font-medium text-gray-700">
                  Date:
                </label>
                <input
                  type="date"
                  id="dateFonds"
                  name="dateFonds"
                  value={formData.dateFonds}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                />
                {errors.dateFonds && (
                  <p className="text-red-600 text-sm mt-1">{errors.dateFonds}</p>
                )}
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
                  Enregistrer le Fonds
                </button>
              </div>
            </fieldset>
          </form>

          {feedbackMessage && (
            <div className="mt-4 text-green-600 font-bold text-center">{feedbackMessage}</div>
          )}
        </section>

        {/* Liste des Fonds */}
        <section id="liste-fonds" className="flex-1 max-w-3xl mx-auto md:mx-0 mt-12 md:mt-0">
  <div className="mb-8 bg-gradient-to-r from-[#138735] to-[#00b86b] text-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 text-center">
    <h2 className="text-3xl font-bold text-center">Liste des Fonds</h2>
  </div>
  <div className="overflow-x-auto rounded-lg shadow-md">
    <table className="min-w-full divide-y divide-[#00866e] text-sm">
      <thead className="bg-[#00866e] text-white">
        <tr>
          <th className="px-4 py-2 text-left">Nom du Créditeur</th>
          <th className="px-4 py-2 text-left">Somme Perçue</th>
          <th className="px-4 py-2 text-left">Date</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {currentFonds.length === 0 ? (
          <tr>
            <td colSpan={3} className="text-center px-4 py-6 text-gray-500 italic">
              Aucun fonds enregistré.
            </td>
          </tr>
        ) : (
          currentFonds.map((fonds) => (
            <tr key={fonds.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{fonds.nomCrediteur}</td>
              <td className="px-4 py-2">{fonds.sommePercue}</td>
              <td className="px-4 py-2">{fonds.dateFonds}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  {fondsList.length > fondsParPage && (
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
}

export default FondsPage;