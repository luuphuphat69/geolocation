import "../../../css/result.css";

export const AddToFavoriteButton = ({ item, isFavorite, onToggle }) => {
  return (
    <button
      className={`favorite-btn ${isFavorite ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(item);
      }}
    >
      <i className="fas fa-star"></i>
    </button>
  );
};