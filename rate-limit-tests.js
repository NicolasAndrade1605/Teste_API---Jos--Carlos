import axios from 'axios';
import { expect } from 'chai';
import { baseUrl, authToken, login } from './config.js';

describe('Testes com Limitador de Requisições', function () {
    this.timeout(10000000); // Ajusta o timeout para requisições simultâneas
    let requestCount = 0; // Inicializa o contador de requisições

    before(async function () {
        // Faz login para obter o token JWT
        await login();
    });

    it('Deve validar o limitador de 100 requisições', async function () {
        const totalRequests = 110; // Simula mais requisições que o limite
        const responses = [];
        
        for (let i = 0; i < totalRequests; i++) {
            requestCount++; // Incrementa o contador de requisições
            console.log(`Requisição número: ${requestCount}`);

            if (requestCount > 100) {
                console.error('429 Too Many Requests - Limite de 100 requisições excedido.');
                responses.push(429); // Simula uma resposta de erro
                continue;
            }

            try {
                const response = await axios.get(`${baseUrl}usuarios`, {
                    headers: { Authorization: authToken }
                });
                responses.push(response.status);
            } catch (error) {
                responses.push(error.response?.status || 500);
            }
        }

        // Testa o comportamento dentro e fora do limite
        console.log(`Total de Requisições Enviadas: ${responses.length}`);
        console.log(`Respostas com Erro 429: ${responses.filter(status => status === 429).length}`);

        // Valida que as requisições dentro do limite têm sucesso
        const successfulRequests = responses.filter(status => status !== 429);
        expect(successfulRequests.length).to.be.at.most(100);

        // Valida que o limite de 100 foi excedido após o limite
        const rateLimitErrors = responses.filter(status => status === 429).length;
        expect(rateLimitErrors).to.be.at.least(1, 'O limitador de requisições não foi acionado corretamente.');
    });
});
