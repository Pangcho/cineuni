// 영화진흥위원회 서비스 키 값
const key = '031e1d70e8b0e11dcd4dda52211e854a';
// 영화 진흥 위원회 API
const BOX_OFFICE_URL = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}`;



/*API에 인물 이미지 없어 대기*/


// 일별 박스 오피스 값
const getpeopleList = async () => {


    //API 요청 위한 URL 생성
    const url = `${BOX_OFFICE_URL}&targetDt=${today}`;
    //응답 요청 및 처리
    const response = await fetch(url);
    const json = await response.json();
    const boxOfficeResult = json.boxOfficeResult.dailyBoxOfficeList;
    return boxOfficeResult;
};

export { getpeopleList };