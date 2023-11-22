$(function() {
  $.get('/api/posts', function(posts) {
    var filteredPosts = posts.filter(function(post) {
      return post.discussion === 1;
    });
    filteredPosts.forEach(function(post) {
      var postDiv = '<div class="post-card">' +
        '<table>' +
        '<tr>' +
        '<th>제목</th>' +
        '<th>내용</th>' +
        '<th>날짜</th>' +
        '</tr>' +
        '<tr>' +
        '<td>' + post.title + '</td>' +
        '<td>' + post.memo + '</td>' +
        '<td>' + post.regdate + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>';
      $('.v93_42').append(postDiv);
    });
  });
});
