type InfoCardProps = {
  title: string;
  value: string;
  color: string;
};

const InfoCard = ({ title, value, color }: InfoCardProps) => {
  return (
    <div className={`bg-${color}-500 text-white rounded-lg p-4 flex-1`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
};

export default InfoCard;
