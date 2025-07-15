// src/components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  bgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, bgColor }) => {
  return (
    <div className={`p-4 rounded-xl text-white shadow-md w-full ${bgColor}`}>
      <div className="text-base font-medium">{title}</div>
      {/* Zone vide pour la valeur */}
      <div className="text-2xl font-bold mt-3">--</div>
    </div>
  );
};

export default DashboardCard;
