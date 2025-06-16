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
        <h1 className="text-3xl font-bold text-center">Enregistrer un fonds</h1>

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
          <div className="mb-8 bg-[#138735] text-white p-4 rounded-xl shadow">
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
                {fondsList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center px-4 py-6 text-gray-500 italic">
                      Aucun fonds enregistré.
                    </td>
                  </tr>
                ) : (
                  fondsList.map((fonds) => (
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
        </section>
      </main>
    </div>
  );
}

export default FondsPage;