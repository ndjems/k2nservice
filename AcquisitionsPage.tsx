import { useState, useEffect } from "react";

type Acquisition = {
  id: number;
  natureAcquisition: string;
  quantiteAcquise: number | string;
  fraisAcquisition: number;
  fraisAnnexes: number;
  totalFrais: number;
  typeAcquisition: string;
  dateAcquisition: string;
  datesAcquisitionTranches: string[];
};

const AcquisitionsPage = () => {
  const [formData, setFormData] = useState({
    natureAcquisition: "",
    quantiteAcquise: "",
    fraisAcquisition: 0,
    fraisAnnexes: 0,
    totalFrais: 0,
    typeAcquisition: "",
    dateAcquisition: "",
    datesAcquisitionTranches: [""],
  });

  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const showTranches = formData.typeAcquisition === "tranches";

  useEffect(() => {
    const total =
      (parseFloat(formData.fraisAcquisition.toString()) || 0) +
      (parseFloat(formData.fraisAnnexes.toString()) || 0);
    setFormData((fd) => ({ ...fd, totalFrais: total }));
  }, [formData.fraisAcquisition, formData.fraisAnnexes]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }

  function ajouterDateTranche() {
    setFormData((prev) => ({
      ...prev,
      datesAcquisitionTranches: [...prev.datesAcquisitionTranches, ""],
    }));
  }

  function handleDateTrancheChange(index: number, value: string) {
    setFormData((prev) => {
      const newDates = [...prev.datesAcquisitionTranches];
      newDates[index] = value;
      return { ...prev, datesAcquisitionTranches: newDates };
    });
  }

  function validate() {
    if (!formData.natureAcquisition.trim()) {
      alert("Veuillez entrer la nature du produit acquis.");
      return false;
    }
    if (
      !formData.quantiteAcquise ||
      Number(formData.quantiteAcquise) <= 0
    ) {
      alert("Veuillez entrer une quantité acquise valide (> 0).");
      return false;
    }
    if (!formData.typeAcquisition) {
      alert("Veuillez sélectionner le type d'acquisition.");
      return false;
    }
    if (!formData.dateAcquisition) {
      alert("Veuillez entrer la date d'acquisition.");
      return false;
    }
    if (showTranches) {
      for (let date of formData.datesAcquisitionTranches) {
        if (!date) {
          alert(
            "Veuillez remplir toutes les dates d'acquisition pour les tranches."
          );
          return false;
        }
      }
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newAcquisition: Acquisition = {
      id: Date.now(),
      natureAcquisition: formData.natureAcquisition,
      quantiteAcquise: formData.quantiteAcquise,
      fraisAcquisition: Number(formData.fraisAcquisition),
      fraisAnnexes: Number(formData.fraisAnnexes),
      totalFrais: Number(formData.totalFrais),
      typeAcquisition: formData.typeAcquisition,
      dateAcquisition: formData.dateAcquisition,
      datesAcquisitionTranches: [...formData.datesAcquisitionTranches],
    };

    setAcquisitions((prev) => [...prev, newAcquisition]);
    setFormData({
      natureAcquisition: "",
      quantiteAcquise: "",
      fraisAcquisition: 0,
      fraisAnnexes: 0,
      totalFrais: 0,
      typeAcquisition: "",
      dateAcquisition: "",
      datesAcquisitionTranches: [""],
    });
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
            <div className="flex flex-col md:flex-row gap-6">
              <fieldset className="flex-1 space-y-4 border border-[#00866e] rounded-md p-4">
                <legend className="text-lg font-semibold text-[#00866e]">
                  Produit Acquis
                </legend>
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
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantite-acquise"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantité Acquise:
                  </label>
                  <input
                    type="number"
                    id="quantite-acquise"
                    name="quantiteAcquise"
                    value={formData.quantiteAcquise}
                    onChange={handleChange}
                    required
                    min={1}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
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
                    Frais d'Acquisition:
                  </label>
                  <input
                    type="number"
                    id="frais-acquisition"
                    name="fraisAcquisition"
                    step="0.01"
                    value={formData.fraisAcquisition}
                    onChange={handleChange}
                    min={0}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="frais-annexes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Frais Annexes:
                  </label>
                  <input
                    type="number"
                    id="frais-annexes"
                    name="fraisAnnexes"
                    step="0.01"
                    value={formData.fraisAnnexes}
                    onChange={handleChange}
                    min={0}
                    className="mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="total-frais"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total des Frais:
                  </label>
                  <input
                    type="number"
                    id="total-frais"
                    name="totalFrais"
                    step="0.01"
                    value={formData.totalFrais}
                    readOnly
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
                  />
                </div>
                {showTranches && (
                  <div className="mb-4 border-t pt-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Dates d'Acquisition (si en tranches):
                    </label>
                    {formData.datesAcquisitionTranches.map((date, index) => (
                      <input
                        key={index}
                        type="date"
                        className="mb-2 mt-1 block w-full rounded-md border-2 border-[#00866e] shadow-sm focus:ring-[#00809f] focus:border-[#00809f]"
                        value={date}
                        onChange={(e) =>
                          handleDateTrancheChange(index, e.target.value)
                        }
                        required
                      />
                    ))}
                    <button
                      type="button"
                      onClick={ajouterDateTranche}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ajouter Date
                    </button>
                  </div>
                )}
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
                Enregistrer l'Acquisition
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
            <table className="min-w-full divide-y divide-[#00866e] text-sm">
              <thead className="bg-[#00866e] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Nature du Produit</th>
                  <th className="px-4 py-2 text-left">Quantité</th>
                  <th className="px-4 py-2 text-left">Frais Acquisition</th>
                  <th className="px-4 py-2 text-left">Frais Annexes</th>
                  <th className="px-4 py-2 text-left">Total Frais</th>
                  <th className="px-4 py-2 text-left">Type Acquisition</th>
                  <th className="px-4 py-2 text-left">Dates Acquisition</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {acquisitions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center px-4 py-6 text-gray-500 italic"
                    >
                      Aucune acquisition enregistrée.
                    </td>
                  </tr>
                ) : (
                  acquisitions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.dateAcquisition}</td>
                      <td className="px-4 py-2">{item.natureAcquisition}</td>
                      <td className="px-4 py-2">{item.quantiteAcquise}</td>
                      <td className="px-4 py-2">
                        {item.fraisAcquisition.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {item.fraisAnnexes.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {item.totalFrais.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 capitalize">
                        {item.typeAcquisition}
                      </td>
                      <td className="px-4 py-2">
                        {item.typeAcquisition === "tranches"
                          ? item.datesAcquisitionTranches.join(", ")
                          : item.dateAcquisition}
                      </td>
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

export default AcquisitionsPage;