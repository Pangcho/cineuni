$(function() {
    $.get('/api/posts', function(posts) {
      posts.forEach(function(post) {
        var row = '<tr>' +
          '<td>' + post.title + '</td>' +
          '<td>' + post.memo + '</td>' +
          '<td>' + post.regdate + '</td>' +
          '</tr>';
        $('#postsTable').append(row);
      });
    });
  });

