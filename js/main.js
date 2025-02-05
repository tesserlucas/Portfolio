// js/main.js

AOS.init({
    duration: 1000,
    once: true
  });
  document.getElementById('contatoForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
  
    // Coleta os dados do formulário
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    // Envia os dados como JSON para o endpoint desejado
    fetch('https://formspree.io/f/mvgzreqg', { // Substitua pela URL do seu endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Sucesso:', result);
      // Aqui você pode exibir uma mensagem de sucesso para o usuário
    })
    .catch(error => {
      console.error('Erro:', error);
      // Aqui você pode exibir uma mensagem de erro para o usuário
    });
  });
  
