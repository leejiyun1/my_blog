// 블로그 리스트 관리
let currentPage = 1;
let isLoading = false;
let hasMorePosts = true;
let searchQuery = '';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
    checkAuthAndShowButton(); // 로그인 체크 후 버튼 표시
});

// 로그인 상태 확인 및 버튼 표시
async function checkAuthAndShowButton() {
    try {
        const response = await fetch('/api/users/check-auth/', {
            credentials: 'include'
        });

        const newPostBtn = document.querySelector('.new-post-btn'); // querySelector로 변경
        if (response.ok && newPostBtn) {
            newPostBtn.style.display = 'inline-block'; // 로그인 시 버튼 표시
        }
    } catch (error) {
        console.log('인증 체크 실패:', error);
        // 실패 시 버튼 숨김 (기본값)
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 기능
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 더보기 버튼
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', loadMorePosts);
}

// 포스트 목록 로드
async function loadPosts(reset = false) {
    if (isLoading) return;

    isLoading = true;
    const postsContainer = document.getElementById('posts-list');
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (reset) {
        currentPage = 1;
        hasMorePosts = true;
        postsContainer.innerHTML = '<div class="loading">포스트를 불러오는 중...</div>';
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.textContent = '로딩 중...';
        loadMoreBtn.disabled = true;
    }

    try {
        const url = buildApiUrl();
        console.log('API 요청 URL:', url); // 디버깅용
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            console.log('API 응답 데이터:', data); // 디버깅용

            if (reset) {
                postsContainer.innerHTML = '';
            }

            // API 응답 구조에 따른 처리
            if (Array.isArray(data)) {
                // 단순 배열인 경우 (메인 페이지와 동일)
                if (data.length > 0) {
                    displayPosts(data, reset);
                    hasMorePosts = false; // 페이지네이션 없음
                } else if (reset) {
                    showEmptyState();
                }
            } else if (data.results && Array.isArray(data.results)) {
                // 페이지네이션된 응답인 경우
                if (data.results.length > 0) {
                    displayPosts(data.results, reset);
                    hasMorePosts = !!data.next;

                    if (hasMorePosts) {
                        loadMoreBtn.style.display = 'block';
                        loadMoreBtn.textContent = '더 보기';
                        loadMoreBtn.disabled = false;
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                } else if (reset) {
                    showEmptyState();
                }
            } else {
                // 예상하지 못한 응답 구조
                console.error('예상하지 못한 API 응답 구조:', data);
                showError('포스트 데이터 형식이 올바르지 않습니다.');
            }
        } else {
            console.error('API 응답 오류:', response.status, response.statusText);
            showError(`포스트를 불러오는데 실패했습니다. (${response.status})`);
        }
    } catch (error) {
        console.error('포스트 로딩 실패:', error);
        showError('포스트 로딩 중 오류가 발생했습니다.');
    }

    isLoading = false;
}

// API URL 구성
function buildApiUrl() {
    const baseUrl = '/api/blogs/posts/';

    // 검색어가 없고 첫 페이지면 간단한 URL 사용 (메인 페이지와 동일)
    if (!searchQuery && currentPage === 1) {
        return baseUrl;
    }

    // 검색어나 페이지네이션이 있으면 파라미터 추가
    const params = new URLSearchParams();

    if (currentPage > 1) {
        params.append('page', currentPage);
    }

    if (searchQuery) {
        params.append('search', searchQuery);
    }

    const paramString = params.toString();
    return paramString ? `${baseUrl}?${paramString}` : baseUrl;
}

// 포스트 표시
function displayPosts(posts, reset = false) {
    const postsContainer = document.getElementById('posts-list');
    const emptyState = document.getElementById('empty-state');

    emptyState.style.display = 'none';

    const postsHTML = posts.map(post => createPostCard(post)).join('');

    if (reset) {
        postsContainer.innerHTML = postsHTML;
    } else {
        postsContainer.innerHTML += postsHTML;
    }

    // 애니메이션 제거 - 바로 보이게 함
}

// 포스트 카드 생성
function createPostCard(post) {
    const createdDate = new Date(post.created_at).toLocaleDateString('ko-KR');

    // content 필드가 없으므로 기본 텍스트 사용
    const excerpt = '내용 미리보기가 없습니다.';

    return `
        <article class="post-card" onclick="goToPost(${post.id})">
            <h2 class="post-title">${escapeHtml(post.title)}</h2>
            <p class="post-excerpt">${excerpt}</p>
            <div class="post-meta">
                <span class="post-date">${createdDate}</span>
            </div>
        </article>
    `;
}

// HTML에서 텍스트만 추출
function extractTextFromHTML(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 포스트 상세 페이지로 이동
function goToPost(postId) {
    window.location.href = `/static/post.html?id=${postId}`;
}

// 검색 실행
function performSearch() {
    const searchInput = document.getElementById('search-input');
    searchQuery = searchInput.value.trim();
    loadPosts(true);
}

// 더 많은 포스트 로드
function loadMorePosts() {
    if (hasMorePosts && !isLoading) {
        currentPage++;
        loadPosts();
    }
}

// 빈 상태 표시
function showEmptyState() {
    const postsContainer = document.getElementById('posts-list');
    const emptyState = document.getElementById('empty-state');
    const loadMoreBtn = document.getElementById('load-more-btn');

    postsContainer.innerHTML = '';
    emptyState.style.display = 'block';
    loadMoreBtn.style.display = 'none';
}

// 오류 메시지 표시
function showError(message) {
    const postsContainer = document.getElementById('posts-list');
    const loadMoreBtn = document.getElementById('load-more-btn');

    postsContainer.innerHTML = `
        <div class="error-message" style="text-align: center; color: #e74c3c; padding: 2rem;">
            <h3>오류가 발생했습니다</h3>
            <p>${message}</p>
            <button onclick="loadPosts(true)" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                다시 시도
            </button>
        </div>
    `;

    loadMoreBtn.style.display = 'none';
}

// 무한 스크롤 (선택사항)
function setupInfiniteScroll() {
    let isNearBottom = false;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 1000) {
            if (!isNearBottom && hasMorePosts && !isLoading) {
                isNearBottom = true;
                loadMorePosts();
            }
        } else {
            isNearBottom = false;
        }
    });
}

// 무한 스크롤 활성화 (선택사항 - 원하면 주석 해제)
// setupInfiniteScroll();