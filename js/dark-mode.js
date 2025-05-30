document.addEventListener('DOMContentLoaded', function() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const body = document.body;
    
    // Verifica preferência do usuário ou armazenamento local
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Aplica o tema salvo
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Alternar tema
    themeSwitcher.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Salva preferência
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: currentTheme }
        }));
    });
    
    // Atualiza ícone do tema
    function updateThemeIcon() {
        const isDark = body.classList.contains('dark-mode');
        const moonIcon = themeSwitcher.querySelector('.fa-moon');
        const sunIcon = themeSwitcher.querySelector('.fa-sun');
        
        if (isDark) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateThemeIcon();
            }
        });
    });
    
    observer.observe(body, {
        attributes: true
    });
    
    // Inicializa ícone
    updateThemeIcon();
});