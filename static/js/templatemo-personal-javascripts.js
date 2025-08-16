/*

TemplateMo 593 personal shape

https://templatemo.com/tm-593-personal-shape

*/

// JavaScript Document

        // Mobile menu functionality
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (navbar && window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (navbar) {
                navbar.classList.remove('scrolled');
            }
        });

        // Enhanced Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Staggered animation for portfolio items
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.portfolio-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.1 });

        // Enhanced smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // 로그인 상태 확인 함수
        async function checkLoginStatus() {
            try {
                const response = await fetch('/api/users/check-auth/', {
                    credentials: 'include'
                });
                return response.ok;
            } catch (error) {
                return false;
            }
        }

        // 최근 포스트 로드 함수
        async function loadRecentPosts() {
            try {
                const response = await fetch('/api/blogs/posts/');
                const posts = await response.json();
                displayRecentPosts(posts.slice(0, 6));

                // 로그인 상태 확인 후 버튼 표시
                const isLoggedIn = await checkLoginStatus();
                showBlogActions(isLoggedIn);
            } catch (error) {
                console.error('포스트 로딩 실패:', error);
                const container = document.getElementById('recent-posts');
                if (container) {
                    container.innerHTML = '<div class="error">포스트를 불러올 수 없습니다.</div>';
                }
            }
        }

        // 블로그 액션 버튼 표시 함수
        function showBlogActions(isLoggedIn) {
            const actionsContainer = document.querySelector('.blog-actions');
            if (!actionsContainer) return;

            if (isLoggedIn) {
                actionsContainer.innerHTML = `
                    <a href="/static/create.html" class="cta-button" style="background: transparent; border: 2px solid #333; color: #333;">새 포스트 작성</a>
                `;
            } else {
                actionsContainer.innerHTML = '';  // 로그인 안 했으면 버튼 없음
            }
        }

        // 포스트 표시 함수
        function displayRecentPosts(posts) {
            const container = document.getElementById('recent-posts');
            if (!container) return;

            if (posts.length === 0) {
                container.innerHTML = '<div class="no-posts">아직 작성된 포스트가 없습니다.</div>';
                return;
            }

            container.innerHTML = posts.map(post => `
                <div class="portfolio-item">
                    <div class="portfolio-content">
                        <h4>${post.title}</h4>
                        <p>${post.content && post.content.length > 150 ? post.content.substring(0, 150) + '...' : (post.content || '내용 미리보기가 없습니다.')}</p>
                        <div class="portfolio-tech">
                            <span class="tech-tag">${new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <a href="/static/post.html?id=${post.id}" class="read-more" style="color: inherit; text-decoration: none;">읽어보기 →</a>
                    </div>
                </div>
            `).join('');
        }

        // 네비게이션 인증 상태 업데이트
        async function updateAuthNavigation() {
            const authNavItem = document.getElementById('auth-nav-item');
            if (!authNavItem) return;

            try {
                const response = await fetch('/api/users/check-auth/', {
                    credentials: 'include'
                });

                if (response.ok) {
                    authNavItem.innerHTML = '<a href="#" onclick="logout()">logout</a>';
                    authNavItem.style.display = 'block';
                } else {
                    authNavItem.innerHTML = '<a href="/static/login.html">login</a>';
                    authNavItem.style.display = 'block';
                }
            } catch (error) {
                authNavItem.innerHTML = '<a href="/static/login.html">login</a>';
                authNavItem.style.display = 'block';
            }
        }
        // 로그아웃 함수 추가
        async function logout() {
            try {
                await fetch('/api/users/logout/', {
                    method: 'POST',
                    credentials: 'include'
                });
                window.location.reload();
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        }

        // 페이지 로드 시 실행
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            animatedElements.forEach(el => observer.observe(el));

            const portfolioSection = document.querySelector('.portfolio-grid');
            if (portfolioSection) {
                portfolioObserver.observe(portfolioSection);
            }

            // 최근 포스트 로드
            loadRecentPosts();

            // 네비게이션 업데이트
            updateAuthNavigation();
        });