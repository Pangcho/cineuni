// 영화진흥위원회 서비스 키 값
const key = '031e1d70e8b0e11dcd4dda52211e854a';
// 영화 진흥 위원회 API
const BOX_OFFICE_URL = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}`;


// 일별 박스 오피스 값
const getBoxOfficeList = async () => {
    // 날짜 만들기
    // 현재 날짜
    const now = new Date();
    // 어제 날짜로 당일 자료는 나오지 않아서 하루 전날 값으로 대체
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    const year = yesterday.getFullYear();
    const month = ('0' + (1 + yesterday.getMonth())).slice(-2);
    const day = yesterday.getDate() < 10
        ? '0' + yesterday.getDate()
        : yesterday.getDate();
    const today = year + month + day;

    //API 요청 위한 URL 생성
    const url = `${BOX_OFFICE_URL}&targetDt=${today}`;
    //응답 요청 및 처리
    const response = await fetch(url);
    const json = await response.json();
    const boxOfficeResult = json.boxOfficeResult.dailyBoxOfficeList;
    return boxOfficeResult;
};

export { getBoxOfficeList };