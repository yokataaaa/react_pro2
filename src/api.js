export async function getReviews({
  order = "createdAt",
  offset = 0,
  limit = 6,
}) {
  // throw new Error("테스트 에러");
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const response = await fetch(
    `https://learn.codeit.kr/api/film-reviews?${query}`
  );
  if (!response.ok) {
    throw new Error("리뷰를 불러오지 못했습니다.");
  }
  const body = await response.json();
  return body;
}
