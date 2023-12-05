$(document).ready(function() {
    $('#movie-search').on('input', function() {
        var searchQuery = $(this).val();
        $.ajax({
            url: '/search-movie',  // 서버의 검색 API 엔드포인트
            method: 'GET',
            data: {
                title: searchQuery
            },
            success: function(data) {
                // 검색 결과 처리
                $('#movie-result').html(data);
            }
        });
    });
});
