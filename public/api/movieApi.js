//KMDB 서비스 키 값
const serviceKey = 'SN8H400BBH563TC18O85';
// 한국 영화 자료원 API
const MOVIE_URL = `https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey=${serviceKey}`;


// 영화 정보 얻어오는 함수(개별 영화 정보)
const getMovieInfo = async (queryObj) => {
    let queryString = '';
    //키-값 쌍을 쿼리 스트링으로 변환환
    Object.entries(queryObj).map(([key, value]) => {
        queryString += `&${key}=${value}`;
    });

    //API에 요청할 url
    const url = `${MOVIE_URL}&detail=Y${queryString}`;
    try {
        //GET 요청 및 처리
        const response = await fetch(url, {
            method: 'GET',
        });
        const json = await response.json();
        if (json.TotalCount !== 0) {//검색 결과 있으면 첫 번째 결과 반환
            return json.Data[0].Result[0];
        }
        else {//검색 결과 없으면 전체 JSON 응답 반환
            return json;
        }
    }
    //에러 발생시 처리
    catch (err) {
        window.location.href = './notFound.html';
        console.error(err);
    }
};


// 영화 검색 결과 얻어오는 함수(여러 영화 검색)
const getSearchResult = async (queryObj) => {
    let queryString = '';
    //키-값 쌍을 쿼리 스트링으로 변환환
    Object.entries(queryObj).map(([key, value]) => {
        queryString += `&${key}=${value}`;
    });
    //API에 요청할 url
    const url = `${MOVIE_URL}&detail=Y&listCount=100&sort=prodYear,1${queryString}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const json = await response.json();
        return json.Data[0];
    }
    catch (err) {
        location.href = '/pages/notFound.html';
        console.error(err);
    }
};
export { getMovieInfo, getSearchResult };
