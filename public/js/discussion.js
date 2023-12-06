$(function() {
  $.get('/api/posts', function(posts) {
    // 게시글 중에서 discussion이 1인 게시글만 필터링합니다.
    var filteredPosts = posts.filter(function(post) {
      return post.discussion === 1;
    });

    // 필터링된 게시글 각각에 대해 작업을 수행
    filteredPosts.forEach(function(post) {
      // post.regdate를 Date 객체로 변환
      var date = new Date(post.regdate);
      // 현지 시간과 UTC 사이의 차이를 분으로 반환
      var offset = date.getTimezoneOffset() * 60000;
      // 한국 시간은 UTC + 9
      var koreanDate = new Date(date.getTime() + offset + (3600000 * 18));
      /*날짜와 시간을 "YYYY-MM-DDTHH:MM:SS.sssZ" 형식의 문자열로 변환 문자열에서 날짜와 시간 부분만을 가져오기 위해 substring 메소드 사용
      T문자는 공백 문자로 변경 날짜와 시간 사이에 공백*/
      var formattedDate = koreanDate.toISOString().substring(0, 16).replace("T", " ");

      var postDiv41 = '<div class="post-card post-card-41">' +  // post-card-41 클래스 추가 각각 css 스타일을 적용시키기 위함
      '<table>' +
      '<tr>' +
      '<td>' + post.name + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' + formattedDate + '</td>' +
      '</tr>' +
      '</table>' +
      '</div>';
      
      var postDiv42 = '<div class="post-card post-card-42">' + // post-card-42 클래스 추가
      '<table>' +
      '<tr>' +
      '<td style="font-size: 20px; font-weight: bold;">' + post.title + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' + post.memo + '</td>' +
      '</tr>' +
      '</table>' +
      '</div>';
      

      var combinedDiv = '<div class="combined-card">' +
        postDiv41 +
        postDiv42 +
        '</div>';

      // 생성된 HTML 코드를 .v93_41에 추가
      $('.v93_41').append(combinedDiv);
    });
  });
});
