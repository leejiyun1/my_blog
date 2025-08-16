// Quill 에디터 초기화
const quill = new Quill('#editor', {
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    },
    placeholder: '포스트 내용을 입력하세요...',
    theme: 'snow',
});

// 포스트 작성 폼 처리
document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = quill.root.innerHTML; // Quill에서 HTML 내용 가져오기
    const submitBtn = document.querySelector('.submit-btn');
    const messageDiv = document.getElementById('post-message');

    // 유효성 검사
    if (!title.trim()) {
        showMessage('제목을 입력해주세요.', 'error');
        return;
    }

    if (!quill.getText().trim()) {
        showMessage('내용을 입력해주세요.', 'error');
        return;
    }

    // 로딩 상태
    setLoadingState(submitBtn, true);

    try {
        const response = await fetch('/api/blogs/posts/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        if (response.ok) {
            showMessage('포스트가 성공적으로 작성되었습니다! 메인페이지로 이동합니다.', 'success');

            setTimeout(() => {
                window.location.href = '/static/index.html#portfolio';
            }, 1500);
        } else {
            const errorData = await response.json();
            showMessage('포스트 작성에 실패했습니다. 로그인 상태를 확인해주세요.', 'error');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showMessage('포스트 작성 중 오류가 발생했습니다.', 'error');
    }

    // 버튼 상태 복원
    setLoadingState(submitBtn, false);
});

// 메시지 표시 함수
function showMessage(text, type) {
    const messageDiv = document.getElementById('post-message');
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    // 3초 후 메시지 숨기기
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 로딩 상태 관리 함수
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.textContent = '작성 중...';
        button.disabled = true;
    } else {
        button.textContent = '포스트 작성';
        button.disabled = false;
    }
}

// CSRF 토큰 가져오기 함수
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 이미지 업로드 핸들러 (추후 구현)
function handleImageUpload() {
    // TODO: 이미지 업로드 로직 구현
    console.log('Image upload functionality to be implemented');
}