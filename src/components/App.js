import Reviewlist from "./ReviewList";
import { useCallback, useEffect, useState } from "react";
import { createReviews, deleteReview, getReviews, updateReview } from "../api";
import ReviewForm from "./ReviewForm";
import useAsync from "../hooks/useAsync";
import { LocaleProvider } from "../contexts/LocaleContext";
import LocaleSelect from "./LocaleSelect";

const LIMIT = 6;

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, loadingError, getReviewsAsync] = useAsync(getReviews);
  // const [isLoading, setIsLoading] = useState(false);
  // const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");

  const handleBestClick = () => setOrder("rating");

  const handleDelete = async (id) => {
    const result = await deleteReview(id);

    if (!result) return;
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLoad = useCallback(
    async (options) => {
      let result = await getReviewsAsync(options);
      if (!result) return;

      const { reviews, paging } = result;
      if (options.offset === 0) {
        setItems(reviews);
      } else {
        setItems((prevItems) => [...prevItems, ...reviews]);
      }
      setOffset(options.offset + reviews.length);
      setHasNext(paging.hasNext);
    },
    [getReviewsAsync]
  );

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order, handleLoad]);

  return (
    <LocaleProvider
      defaultValue="ko"
      childern={
        <div>
          <LocaleSelect />
          <div>
            <button onClick={handleNewestClick}>최신순</button>
            <button onClick={handleBestClick}>베스트순</button>
          </div>
          <ReviewForm
            onSubmit={createReviews}
            onSubmitSuccess={handleCreateSuccess}
          />
          <Reviewlist
            items={sortedItems}
            onDelete={handleDelete}
            onUpdate={updateReview}
            onUpdateSuccess={handleUpdateSuccess}
          />
          {hasNext && (
            <button disabled={isLoading} onClick={handleLoadMore}>
              더보기
            </button>
          )}
          {loadingError?.message && <span>{loadingError.message}</span>}
        </div>
      }
    />
  );
}

export default App;

// sideEffect 예제
// import { useEffect, useState } from "react";

// function Timer() {
//   const [second, setSecond] = useState(0);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       console.log("타이머 실행중 ... ");
//       setSecond((prevSecond) => prevSecond + 1);
//     }, 1000);
//     console.log("타이머 시작 🏁");

//     return () => {
//       clearInterval(timerId);
//       console.log("타이머 멈춤 ✋");
//     };
//   }, []);

//   return <div>{second}</div>;
// }

// function App() {
//   const [show, setShow] = useState(false);

//   const handleShowClick = () => setShow(true);
//   const handleHideClick = () => setShow(false);

//   return (
//     <div>
//       {show && <Timer />}
//       <button onClick={handleShowClick}>보이기</button>
//       <button onClick={handleHideClick}>감추기</button>
//     </div>
//   );
// }

// useCallback 예제
// import { useCallback, useEffect, useState } from "react";

// function App() {
//   const [count, setCount] = useState(0);
//   const [num, setNum] = useState(0);

//   const addCount = useCallback(() => {
//     setCount((c) => c + 1);
//     console.log(`num: ${num}`);
//   }, [num]);

//   const addNum = () => setNum((n) => n + 1);

//   useEffect(() => {
//     console.log("timer start");
//     const timerId = setInterval(() => {
//       addCount();
//     }, 1000);

//     return () => {
//       clearInterval(timerId);
//       console.log("timer end");
//     };
//   }, [addCount]);

//   return (
//     <div>
//       <button onClick={addCount}>count: {count}</button>
//       <button onClick={addNum}>num: {num}</button>
//     </div>
//   );
// }

// export default App;
