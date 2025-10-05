
document.addEventListener('DOMContentLoaded', function() {
    const PortfolioApp = {
        settings: {
            scrollOffset: 80,
            animationOffset: 100,
            localStorageKey: 'portfolioFormData'
        },

        // Elementos DOM
        elements: {
            mobileMenuIcon: document.querySelector('.mobile-menu-icon'),
            navMenu: document.querySelector('.nav-menu ul'),
            navLinks: document.querySelectorAll('.nav-menu a'),
            contactForm: document.getElementById('contact-form'),
            formInputs: document.querySelectorAll('#contact-form input, #contact-form textarea'),
            sections: document.querySelectorAll('section'),
            projectCards: document.querySelectorAll('.project-card'),
            articleCards: document.querySelectorAll('.article-card')
        },

        init: function() {
            this.setupEventListeners();
            this.checkLocalStorage();
            this.setupAnimations();
            this.setupIntersectionObserver();
        },

        setupEventListeners: function() {
            const { mobileMenuIcon, navLinks, contactForm, formInputs } = this.elements;

            // Menu mobile
            if (mobileMenuIcon) {
                mobileMenuIcon.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Links de navegação
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavLinkClick(e));
            });

            // Formulário de contato
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }

            // Salva dados do formulário enquanto digita
            formInputs.forEach(input => {
                input.addEventListener('input', () => this.saveFormData());
            });

            // Header scroll effect
            window.addEventListener('scroll', () => this.handleScroll());
        },

        // Menu mobile
        toggleMobileMenu: function() {
            const { navMenu } = this.elements;
            navMenu.classList.toggle('show');
            const icon = this.elements.mobileMenuIcon.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        },

        // Navegação suave
        handleNavLinkClick: function(e) {
            e.preventDefault();
            
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                this.elements.navMenu.classList.remove('show');
                this.elements.mobileMenuIcon.querySelector('i').classList.replace('fa-times', 'fa-bars');
                window.scrollTo({
                    top: targetElement.offsetTop - this.settings.scrollOffset,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
            }
        },

        // Formulário de contato
        handleFormSubmit: function(e) {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }
            
            const formData = new FormData(this.elements.contactForm);
            const data = Object.fromEntries(formData);
            const submitButton = this.elements.contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            this.sendFormData(data)
                .then(response => {
                    this.showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                    this.elements.contactForm.reset();
                    localStorage.removeItem(this.settings.localStorageKey);
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.showNotification('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.', 'error');
                    this.saveFormData();
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        },
        // Validação do formulário
        validateForm: function() {
            let isValid = true;
            const { contactForm } = this.elements;

            const nameInput = contactForm.querySelector('#name');
            if (!nameInput.value.trim()) {
                this.showInputError(nameInput, 'Por favor, insira seu nome');
                isValid = false;
            } else {
                this.clearInputError(nameInput);
            }
            const emailInput = contactForm.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                this.showInputError(emailInput, 'Por favor, insira seu e-mail');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                this.showInputError(emailInput, 'Por favor, insira um e-mail válido');
                isValid = false;
            } else {
                this.clearInputError(emailInput);
            }
            const messageInput = contactForm.querySelector('#message');
            if (!messageInput.value.trim()) {
                this.showInputError(messageInput, 'Por favor, insira sua mensagem');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                this.showInputError(messageInput, 'A mensagem deve ter pelo menos 10 caracteres');
                isValid = false;
            } else {
                this.clearInputError(messageInput);
            }
            
            return isValid;
        },

        // Mostra erro no input
        showInputError: function(input, message) {
            const formGroup = input.closest('.form-group');
            let errorElement = formGroup.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('p');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('error');
        },

        // Remove erro do input
        clearInputError: function(input) {
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            input.classList.remove('error');
        },

        sendFormData: function(data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        console.log('Dados enviados:', data);
                        resolve({ status: 'success' });
                    } else {
                        reject(new Error('Falha na conexão'));
                    }
                }, 1500);
            });
        },

        // Mostra notificação
        showNotification: function(message, type) {
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        },

        // Salva dados do formulário no localStorage
        saveFormData: function() {
            const { contactForm } = this.elements;
            if (!contactForm) return;
            
            const formData = new FormData(contactForm);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            localStorage.setItem(this.settings.localStorageKey, JSON.stringify(data));
        },


        checkLocalStorage: function() {
            const { contactForm } = this.elements;
            if (!contactForm) return;
            
            const savedData = localStorage.getItem(this.settings.localStorageKey);
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    
                    Object.keys(data).forEach(key => {
                        const input = contactForm.querySelector(`[name="${key}"]`);
                        if (input) {
                            input.value = data[key];
                        }
                    });
                    
                    this.showNotification('Recuperamos seu rascunho não enviado.', 'info');
                } catch (e) {
                    console.error('Error parsing saved form data:', e);
                }
            }
        },

        // Efeito de scroll no header
        handleScroll: function() {
            const header = document.querySelector('header');
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > 50) {
                header.style.boxShadow = '0 2px 10px #f1ededff';
                header.style.background = '#faf2f2ff';
                header.style.backdropFilter = 'blur(5px)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = '#f1ededff';
                header.style.backdropFilter = 'none';
            }
        },

        // Propriedade com animações
        setupAnimations: function() {
            const animateOnScroll = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            };
            
            const observer = new IntersectionObserver(animateOnScroll, {
                threshold: 0.1
            });
            
            this.elements.sections.forEach(section => {
                observer.observe(section);
            });
            
            this.elements.projectCards.forEach(card => {
                observer.observe(card);
            });
            
            this.elements.articleCards.forEach(card => {
                observer.observe(card);
            });
        },
        setupIntersectionObserver: function() {
            const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyLoadObserver.observe(img);
            });
        }
    };

    // Inicializa a aplicação
    PortfolioApp.init();
});

document.addEventListener('DOMContentLoaded', function() {
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });
    const codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length > 0 && typeof hljs !== 'undefined') {
        codeBlocks.forEach(block => {
            hljs.highlightElement(block);
        });
    }
    
    // Animação das skills
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});
/**
 * Filtragem e Busca de Artigos
 */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const searchInput = document.getElementById('article-search');
    const paginationButtons = document.querySelectorAll('.page-btn');
    
    // Filtro por categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ativa o botão clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterArticles(filter);
        });
    });
    
    // Busca por texto
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        filterArticles(activeFilter, searchTerm);
    });
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log('Ir para página', this.textContent.trim());
        });
    });
    
    // Função para filtrar artigos
    function filterArticles(filter, searchTerm = '') {
        articleCards.forEach(card => {
            const categories = card.dataset.categories;
            const title = card.dataset.title.toLowerCase();
            const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
            
            // Verifica categoria
            const categoryMatch = filter === 'all' || categories.includes(filter);
            
            // Verifica busca
            const searchMatch = !searchTerm || 
                               title.includes(searchTerm) || 
                               excerpt.includes(searchTerm);
            // Mostra/oculta card baseado nos filtros
            if (categoryMatch && searchMatch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Inicializa com todos os artigos visíveis
    articleCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'opacity 0.3s, transform 0.3s';
    });
});