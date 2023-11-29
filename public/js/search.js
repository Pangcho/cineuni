import { getSearchResult } from '../api/movieApi.js';

//엘리먼트 가져오기
const searchInput = document.getElementById('input-search');
const searchedList = document.querySelector('.container-searched-list');
const gridBox = document.querySelector('.grid-box');
const strong = document.querySelector('strong');

//검색 쿼리 저장 객체 생성
let queryObj = {
    title: '',
    startCount: 0,
};
//현재 검색어 저장 변수
let searchString = '';

//사용자가 입력한 검색어에 따라 검색 결과 얻어 오고, 결과 리스트로 표시
async function search(searchInputValue, startCount = 0) {
    let compare = true;//비교

    //현재 검색어와 이전 검색어 비교
    if (queryObj.title != searchInputValue) {
        compare = false;
    }
    //현재 검색어와 이전 검색어 같고, 시작 카운트도 이전과 동일 -> 검색 다시 수행하지 않도록 방지
    if (
        queryObj.title === searchInputValue &&
        queryObj.startCount === startCount
    ) {
        compare = false;
    }
    //위 조건문 통과시 현재 검색어와 시작 카운트 업데이트
    queryObj.title = searchInputValue;
    queryObj.startCount = startCount;

    //영화 검색 결과 얻어오는 함수(여러 영화 검색)로부터 반환값 가져오기
    const searchResult = await getSearchResult(queryObj);

    //검색어 변수에 담기
    searchString = searchInputValue;

    //여러 영화 검색 결과를 리스트에 표시하는 함수 호출
    createSearchedList(searchResult, compare);

    //gridBox의 마지막 자식이 HTNLElement인지 확인
    if (gridBox.lastElementChild instanceof HTMLLIElement) {
        //맞다면 함수 호출
        createObserver(gridBox.lastElementChild);
    }
}

//검색 결과 받아와 화면에 표시하는 함수
const createSearchedList = (list, compare) => {

    //검색 결과 정의되지 않았다면 함수 종료
    if (list.Result === undefined) return;

    //false(비교하지 않는 경우)라면 gridBox 내용 비우기
    //검색어 변경되었을 때, 이전 검색 결과 지우고 새로운 결과 표시 위해
    if (!compare) {
        gridBox.innerHTML = '';
    }

    //DocumentFragment를 생성
    /*DocumentFragment: 메모리 상에서 DOM 요소들을 담고 있는 일종의 컨테이너
    실제 DOM에 추가되기 전에 여러 노드를 일괄적으로 처리 가능*/
    const fragment = document.createDocumentFragment();


    //결과 개수
    strong.textContent = `총 ${list.TotalCount}개의 검색결과가 있습니다.`;
    
    //검색 결과의 각 항목에 대한 추가 처리
    const result = list.Result.map((result) => {
        //공백 및 다중 공백을 정규식을 사용해 처리
        //title 속성에 반영해 새로운 배열 만들기
        const newResult = Object.assign(Object.assign({}, result), {
            title: result.title
                .replace(/\!HS/g, '')
                .replace(/\!HE/g, '')
                .replace(/^\s+|\s+$/g, '')
                .replace(/ +/g, ' '),
        });
        return newResult;
    });

    // 영화 이름 완전 일치
    const allMatched = result.filter(
        (movie) =>
            movie.title.replace(/[ \!\,\.\?]/g, '') ===
            searchString.replace(/ /g, '')
    );
    // 부분 일치 (제목에 검색어를 포함하는 경우)
    const someMatched = result
        .filter(
            (movie) => movie.title.replace(/[\!\,\.\?]/g, '') !== searchString
        )
        .filter((movie) =>
            movie.title.replace(/[\!\,\.\?]/g, '').includes(searchString)
        );
    // 불일치 (제목에 검색어를 포함하지 않는 경우)
    const notMatched = result
        .filter(
            (movie) => movie.title.replace(/[\!\,\.\?]/g, '') !== searchString
        )
        .filter(
            (movie) =>
                !movie.title.replace(/[\!\,\.\?]/g, '').includes(searchString)
        );

    //완전 일치 - 부분 일치 - 불일치 순으로 정렬된 배열 생성
    //최종 필터링 결과
    const orderedResult = allMatched.concat(someMatched, notMatched);
// 최종 결과 배열 순회하면서 각 항목에 표시할 HTML 요소 만들기
    for (let i = 0; i < Math.min(20, orderedResult.length); i++) { // 상위 20개만 출력하도록 수정
        const li = document.createElement('li');
        const div = document.createElement('div');
        const releaseDate = document.createElement('span');
        const span = document.createElement('span');
        li.classList.add('searched-movie');

        // 이미지 관련 코드 삭제
        // 포스터 이미지 설정
        // 속성 비어 있지 않다면 경로를 src 속성으로 설정

        div.classList.add('title-box');
        span.classList.add('movie-title');
        releaseDate.textContent = ` ${orderedResult[i].prodYear}년`;
        // 검색어와 일치 부분 강조 위해
        // strong 태그로 감싼 HTML 생성
        const filteredTitle = orderedResult[i].title.replace(
            searchInput.value,
            `<strong style="color:#FF5F5F">${searchInput.value}</strong>`
        );
        // 제목에 삽입
        span.insertAdjacentHTML('afterbegin', filteredTitle);

        // 요소들을 DOM에 추가
        fragment.appendChild(li);
        li.appendChild(div);
        div.appendChild(span);
        div.appendChild(releaseDate);
        // 각 영화 요소에 클릭 이벤트 리스너(상세페이지로 이동하는) 추가
        li.addEventListener('click', () => {
            window.location.href = `../html/searchResult.html?movieSeq=${orderedResult[i].movieSeq}&movieId=${orderedResult[i].movieId}`;
        });
    }



    //모든 영화 요소가 포함된 DocumentFragment를 그리드 박스에 추가 -> 화면에 표시
    gridBox.appendChild(fragment);
};


//엘리먼트가 null이거나 undefined일 경우 void 0 반환, 그렇지 않으면 코드 실행
searchInput === null || searchInput === void 0
    ? void 0
    //searchInput이 유효한 DOM 요소일 때만 실행
    //keyup 이벤트 발생시 함수 실행    
    : searchInput.addEventListener('keyup', (e) => {
            //입력 요소에서 이벤트 발생했을 때
          if (e.target instanceof HTMLInputElement) {
                //입력 요소 값이 빈 문자열이거나 공백 문자로만 이루어진 경우
              if (e.target.value === '' || e.target.value.trim() === '') {
                  //화면 초기화 후 함수 종료
                  gridBox.innerHTML = '';
                  strong.textContent = '';
                  return;
              }
              //검색어가 빈 문자열이 아닌 경우(유효) 함수 호출
              search(e.target.value);
          }
      });


//Intersection Observer를 사용 -> 화면에서 특정 요소가 나타나면
//추가 검색 결과를 가져와 -> 화면에 표시하는 Infinite scrolling 기능
const createObserver = (element) => {
    //Infinite scrolling을 구현하기 위한 시작 카운트를 설정
    let startCount = 100;

    //IntersectionObserver를 생성
    //화면에 들어오거나 나갈 때 실행되는 콜백 함수 정의
    const observer = new IntersectionObserver(
        async ([entry], observer) => {
            var _a;

            //관찰 대상 요소가 화면에 진입했을 때 실행되는 블록
            if (entry.isIntersecting) {
                //현재 요소 더 이상 관찰하지 않도록 설정
                observer.unobserve(entry.target);

                //새로운 검색을 위한 객체 설정
                let queryObj = {
                    title: searchInput.value,
                    startCount: startCount,
                };
                //현재 검색어 업데이트
                searchString = searchInput.value;
                
                //새로운 영화 검색 결과 얻어오는 함수(여러 영화 검색) 결과 가져오기
                const newSearchList = await getSearchResult(queryObj);
                //새로운 검색 결과 없으면 함수 종료
                if (newSearchList && newSearchList.Result && newSearchList.Result.length === 0) return;
                //새로운 검색 결과를 이전 결과에 추가
                createSearchedList(newSearchList, true);

                //마지막 검색 결과 항목의 마지막 자식이 HTMLElement인지 확인
                //맞다면 이 요소 관찰 대상으로 추가
                if (
                    ((_a = searchedList.lastElementChild) === null ||
                    _a === void 0
                        ? void 0
                        : _a.lastElementChild) instanceof HTMLLIElement
                ) {
                    observer.observe(
                        searchedList.lastElementChild.lastElementChild
                    );
                }

                //다음 Infinite scrolling에 대비하여 startCount를 100 증가
                startCount += 100;
                //가져온 검색 결과가 100개보다 적다면 Intersection Observer를 중단
                if (newSearchList && newSearchList.Result && newSearchList.Result.length < 100) {
                    observer.disconnect();
                }                
            }
        },
        {
            //화면에 50% 이상 나타나면 콜백 함수 실행
            threshold: 0.5,
        }
    );

    //함수의 인자로 전달된 요소를 Intersection Observer에 등록하여 관찰
    if (element) {
        observer.observe(element);
    }
};
//Infinite scrolling -> 추가 검색 결과를 가져와
//화면에 동적으로 추가하는 기능을 구현하는 함수