// 포스트 작성
document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    try {
        const response = await fetch('/api/blogs/posts/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        if (response.ok) {
            alert('포스트가 작성되었습니다!');
            window.location.href = '/static/blog.html';
        } else {
            alert('포스트 작성에 실패했습니다.');
        }
    } catch (error) {
        console.error('포스트 작성 실패:', error);
        alert('포스트 작성 중 오류가 발생했습니다.');
    }
});