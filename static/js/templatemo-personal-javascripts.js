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
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
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

        // Observe all animation elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            animatedElements.forEach(el => observer.observe(el));

            const portfolioSection = document.querySelector('.portfolio-grid');
            if (portfolioSection) {
                portfolioObserver.observe(portfolioSection);
            }
        });

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

        // Enhanced form submission with better UX
        document.querySelector('.contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Add loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'linear-gradient(135deg, #94a3b8, #64748b)';
            
            // Simulate form submission with better feedback
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent! ✓';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Show success animation
                submitBtn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    submitBtn.style.transform = 'scale(1)';
                }, 200);
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    document.querySelector('.contact-form').reset();
                }, 3000);
            }, 2000);
        });

        // Enhanced parallax effect for hero background
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Add subtle hover effects to skill tags
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
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
                // 세션 기반 인증 확인 (Django 기본 방식)
                const response = await fetch('/api/users/check-auth/', {
                    credentials: 'include' // 쿠키 포함
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
                    <a href="/static/blog.html" class="cta-button">더 많은 포스트 보기</a>
                    <a href="/static/create.html" class="cta-button" style="background: transparent; border: 2px solid #333; color: #333;">새 포스트 작성</a>
                `;
            } else {
                actionsContainer.innerHTML = `
                    <a href="/static/blog.html" class="cta-button">더 많은 포스트 보기</a>
                `;
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

        // 기존 DOMContentLoaded를 수정
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            animatedElements.forEach(el => observer.observe(el));

            const portfolioSection = document.querySelector('.portfolio-grid');
            if (portfolioSection) {
                portfolioObserver.observe(portfolioSection);
            }

            // 최근 포스트 로드 추가
            loadRecentPosts();
        });