import "../../decalrations.ts"
import "./statCard.css"

interface IStatCardDetails {
name:string;
value: string | number;
}

const StatCard = (statDetails: IStatCardDetails) => {
  return (
  <div className="stat-card-container">
    <div className="stat-card-title">
        {statDetails.name}
    </div>
    <div className="stat-card-value">
        {statDetails.value}
    </div>
  </div>
)
}

export default StatCard;