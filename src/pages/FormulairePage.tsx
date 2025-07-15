import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
    
    const defaultPieces = [
      { value: 'carte_identite', label: "Carte d'identité" },
      { value: 'recipisse', label: 'Récépissé' },
      { value: 'passport', label: 'Passeport' },
    ];
    
    const defaultStatusOptions = [
      { value: 'employe', label: 'Employé' },
      { value: 'associe', label: 'Associé' },
      { value: 'fournisseur', label: 'Fournisseur' },
      { value: 'client', label: 'client' },
    ];
    
    export default function FormulairePage() {
      const [pieceOptions, setPieceOptions] = useState(defaultPieces);
      const [newPiece, setNewPiece] = useState('');
      const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);
      const [newStatus, setNewStatus] = useState('');
      const [form, setForm] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        typePiece: '',
        numeroPiece: '',
        localisation: '',
        statut: '',
        photo: null as File | null,
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
      };
    
      const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setForm({ ...form, photo: e.target.files[0] });
        }
      };
    
      const handleAddPiece = () => {
        if (newPiece.trim()) {
          setPieceOptions([...pieceOptions, { value: newPiece.toLowerCase().replace(/\s+/g, '_'), label: newPiece }]);
          setNewPiece('');
        }
      };
    
      const handleAddStatus = () => {
        if (newStatus.trim()) {
          setStatusOptions([...statusOptions, { value: newStatus.toLowerCase().replace(/\s+/g, '_'), label: newStatus }]);
          setNewStatus('');
        }
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici, tu peux gérer l'envoi du formulaire
        alert('Formulaire soumis !');
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nom</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Prénom</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Numéro de téléphone</label>
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="w-full border rounded px-3 py-2" required pattern="[0-9]{8,15}" title="Numéro de téléphone (8 à 15 chiffres)" />
              </div>
              <div>
                <label className="block font-medium mb-1">Type de pièce</label>
                <div className="flex gap-2 mb-2 items-center">
                  <select name="typePiece" value={form.typePiece} onChange={handleChange} className="border rounded px-3 py-2 flex-1" required>
                    <option value="">Sélectionner...</option>
                    {pieceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input type="text" value={newPiece} onChange={e => setNewPiece(e.target.value)} placeholder="Autre..." className="border rounded px-2 py-2 w-32" />
                  <button
                    type="button"
                    onClick={handleAddPiece}
                    className="bg-pink-500 text-white px-3 py-2 rounded"
                    title="Ajouter ce type de pièce"
                    disabled={!newPiece.trim()}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Photo de la pièce (PNG)</label>
                <input type="file" accept="image/png" onChange={handlePhotoChange} className="w-full" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Numéro de la pièce</label>
                <input type="text" name="numeroPiece" value={form.numeroPiece} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Localisation</label>
                <input type="text" name="localisation" value={form.localisation} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Statut</label>
                <div className="flex gap-2 items-center mb-2">
                  <select name="statut" value={form.statut} onChange={handleChange} className="border rounded px-3 py-2 flex-1" required>
                    <option value="">Sélectionner...</option>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input type="text" value={newStatus} onChange={e => setNewStatus(e.target.value)} placeholder="Autre..." className="border rounded px-2 py-2 w-32" />
                  <button
                    type="button"
                    onClick={handleAddStatus}
                    className="bg-pink-500 text-white px-3 py-2 rounded"
                    title="Ajouter ce statut"
                    disabled={!newStatus.trim()}
                  >
                    +
                  </button>
                </div>
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    