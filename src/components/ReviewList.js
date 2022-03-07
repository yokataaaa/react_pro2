import { useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import useTranslate from "../hooks/useTranslate";
import Rating from "./Rating";
import ReviewForm from "./ReviewForm";
import "./ReviewList.css";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()}`;
}

function ReviewListItem({ item, onDelete, onEdit }) {
  const locale = useLocale();

  const translate = useTranslate();

  const handleDeleteClick = () => onDelete(item.id);

  const handleEditClick = () => onEdit(item.id);

  return (
    <div className="ReviewListItem">
      <img
        className="ReviewListItem-img"
        src={item.imgUrl}
        alt={item.title}
      ></img>
      <div>
        <h1>{item.title}</h1>
        <Rating value={item.rating} />
        <p>{formatDate(item.createdAt)}</p>
        <p>{item.content}</p>
        <p>현재 언어: {locale}</p>
        <button onClick={handleDeleteClick}>
          {translate("delete button")}
        </button>
        <button onClick={handleEditClick}>{translate("edit button")}</button>
      </div>
    </div>
  );
}

function Reviewlist({ items, onDelete, onUpdate, onUpdateSuccess }) {
  const [editingId, setEditingId] = useState(null);

  const handleCancel = () => setEditingId(null);

  return (
    <ul>
      {items.map((item) => {
        if (item.id === editingId) {
          const { id, title, rating, content, imgUrl } = item;
          const initialValues = { title, rating, content };

          const handleSubmit = (formData) => onUpdate(id, formData);

          const handleSubmitSuccess = (review) => {
            onUpdateSuccess(review);
            setEditingId(null);
          };

          return (
            <li key={item.id}>
              <ReviewForm
                initialValues={initialValues}
                initialPreview={imgUrl}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </li>
          );
        }
        return (
          <li key={item.id}>
            <ReviewListItem
              item={item}
              onDelete={onDelete}
              onEdit={setEditingId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default Reviewlist;
