// 1. Seleção de temas (claro/escuro)
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

if(localStorage.getItem('theme') === 'light') {
    htmlElement.classList.remove('dark');
    themeIcon.className = 'fa-solid fa-sun text-blue-600';
} else {
    htmlElement.classList.add('dark');
    themeIcon.className = 'fa-solid fa-moon text-yellow-400';
}

themeToggleBtn.addEventListener('click',() => {
    if(htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        themeIcon.className = 'fa-solid fa-sun text-blue-600';
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark');
        themeIcon.className = 'fa-solid fa-moon text-yellow-400';
        localStorage.setItem('theme', 'dark');
    }
});

// 2. Envio do Formulário de Contacto Integrado com a API Web3Forms
window.handleContactSubmit = async function(event) {
    event.preventDefault(); // Impede o recarregamento padrão da página
    
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    
    // Lê a chave de acesso diretamente do campo oculto no index.html
    const accessKeyInput = document.getElementById('web3formsKey');
    const WEB3FORMS_ACCESS_KEY = accessKeyInput ? accessKeyInput.value : '';

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // Altera temporariamente o estado do botão para evitar múltiplos envios
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Enviando... <i class="fa-solid fa-circle-notch animate-spin ml-2"></i>`;

    try {
        // Estrutura o payload de dados exigido pela API
        const payload = {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            message: message,
            subject: `Novo Contacto do Portfólio: ${name}`
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
            // Transição visual de sucesso no botão
            submitBtn.innerHTML = `Mensagem Enviada! <i class="fa-solid fa-check ml-2"></i>`;
            submitBtn.className = "px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm transition duration-200 shadow-md";
            
            // Exibe mensagem informativa de sucesso no ecrã
            feedback.classList.remove('hidden', 'bg-red-500/10', 'text-red-500');
            feedback.classList.add('bg-emerald-500/10', 'text-emerald-500');
            feedback.innerHTML = "✨ Mensagem enviada com sucesso! Entrarei em contacto em breve.";
            
            // Limpa automaticamente os campos do formulário
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
        } else {
            throw new Error(result.message || "Erro ao processar a mensagem.");
        }

    } catch (error) {
        // Tratamento elegante em caso de queda de rede ou erro na API
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Tentar Novamente <i class="fa-solid fa-rotate-right ml-2"></i>`;
        
        feedback.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-500');
        feedback.classList.add('bg-red-500/10', 'text-red-500');
        feedback.innerHTML = `❌ Falha ao enviar: ${error.message || "Por favor, tente novamente mais tarde."}`;
    } finally {
        // Restaura o botão ao design premium padrão após 5 segundos
        setTimeout(() => {
            if (submitBtn.innerHTML.includes('Enviada')) {
                feedback.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Enviar Mensagem <i class="fa-solid fa-paper-plane ml-2"></i>`;
                submitBtn.className = "px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white font-semibold rounded-xl text-sm transition duration-200 shadow-md";
            }
        }, 5000);
    }
};