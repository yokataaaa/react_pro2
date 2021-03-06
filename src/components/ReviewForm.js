import { useState } from "react";
import useAsync from "../hooks/useAsync";
import useTranslate from "../hooks/useTranslate";
import FileInput from "./FileInput";
import RatingInput from "./RatingInput";
import "./ReviewForm.css";

const INITIAL_VALUES = {
  title: "",
  rating: 0,
  content: "",
  imgFile: null,
};

function ReviewForm({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onCancel,
  onSubmit,
  onSubmitSuccess,
}) {
  const translate = useTranslate();

  const [values, setValues] = useState(initialValues);
  const [isSubmit, submitError, onSubmitAsync] = useAsync(onSubmit);

  // const [title, setTitle] = useState("");
  // const [rating, setRating] = useState(0);
  // const [content, setContent] = useState("");
  // const [isSubmit, setIsSubmit] = useState(false);
  // const [submitError, setSubmitError] = useState(null);

  // const handleTitleChange = (e) => {
  //   setTitle(e.target.value);
  // };

  // const handleRatingChange = (e) => {
  //   const nextRating = Number(e.target.value) || 0;
  //   setRating(nextRating);
  // };

  // const handleContentChange = (e) => {
  //   setContent(e.target.value);
  // };

  const handleChange = (name, value) => {
    setValues((preValues) => ({
      ...preValues,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);
    const result = await onSubmitAsync(formData);
    if (!result) return;

    // let result;
    // try {
    //   setSubmitError(null);
    //   setIsSubmit(true);
    //   result = await onSubmit(formData);
    // } catch (error) {
    //   setSubmitError(error);
    //   return;
    // } finally {
    //   setIsSubmit(false);
    // }

    const { review } = result;
    onSubmitSuccess(review);
    setValues(INITIAL_VALUES);
  };

  return (
    <form className="ReviewForm" onSubmit={handleSubmit}>
      <FileInput
        name="imgFile"
        value={values.imgFile}
        onChange={handleChange}
        initialPreview={initialPreview}
      />
      <input
        name="title"
        value={values.title}
        onChange={handleInputChange}
      ></input>
      <RatingInput
        name="rating"
        value={values.rating}
        onChange={handleChange}
      />
      <textarea
        name="content"
        value={values.content}
        onChange={handleInputChange}
      ></textarea>
      <button type="submit" disabled={isSubmit}>
        {translate("confirm button")}
      </button>
      {onCancel && (
        <button onClick={onCancel}>{translate("cancel button")}</button>
      )}
      {submitError?.message && <div>{submitError.message}</div>}
    </form>
  );
}

export default ReviewForm;
