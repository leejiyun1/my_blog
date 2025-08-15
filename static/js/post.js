// URL에서 포스트 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// 포스트 상세 정보 로드
async function loadPost() {
    try {
        const response = await fetch(`/api/blogs/posts/${postId}/`);
        const post = await response.json();
        displayPost(post);
    } catch (error) {
        console.error('포스트 로딩 실패:', error);
    }
}

function displayPost(post) {
    const container = document.getElementById('post-detail');
    container.innerHTML = `
        <header class="post-header">
            <h1>${post.title}</h1>
            <time>${new Date(post.created_at).toLocaleDateString()}</time>
        </header>
        <div class="post-content">
            ${post.content.replace(/\n/g, '<br>')}
        </div>
    `;
}

// 댓글 작성
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('author-name').value;
    const content = document.getElementById('comment-content').value;

    try {
        const response = await fetch('/api/blogs/comments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post: postId,
                author: author,
                content: content
            })
        });

        if (response.ok) {
            // 댓글 폼 초기화
            document.getElementById('comment-form').reset();
            // 댓글 목록 새로고침
            loadComments();
        }
    } catch (error) {
        console.error('댓글 작성 실패:', error);
    }
});

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
});