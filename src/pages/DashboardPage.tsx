// src/Pages/DashboardPage.tsx
import DashboardCard from '../components/DashboardCard';

function DashboardPage() {
  return ( 
    <main className="flex-1 p-6 bg-white">

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard title="Stock" bgColor="bg-purple-500" />
        <DashboardCard title="Rappport" bgColor="bg-rose-500" />
        <DashboardCard title="Etat de fonds" bgColor="bg-yellow-500" />
      </div>

      {/* Tableau des commandes (vide) */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Tracking ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {/* Lignes vides comme modèle */}
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">---</td>
                <td className="px-4 py-2">---</td>
                <td className="px-4 py-2">---</td>
                <td className="px-4 py-2">---</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default DashboardPage;
