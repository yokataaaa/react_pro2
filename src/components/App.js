import Reviewlist from "./ReviewList";
import { useEffect, useState } from "react";
import { getReviews } from "../api";
import ReviewForm from "./ReviewForm";

const LIMIT = 6;

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");
  const handleBestClick = () => setOrder("rating");
  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { reviews, paging } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm />
      <Reviewlist items={sortedItems} onDelete={handleDelete} />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;

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
