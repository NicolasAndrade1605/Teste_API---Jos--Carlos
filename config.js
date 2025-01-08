import axios from 'axios';

// Configurações básicas
export const baseUrl = 'https://serverest.dev/';
export let authToken = ''; // Token de autenticação
export let userId = '';    // ID do usuário criado

// Função para login e obtenção do token JWT
export async function login() {
    try {
        const response = await axios.post(`${baseUrl}login`, {
            email: 'teste@teste.com',
            password: '123senha'
        });

        authToken = response.data.authorization;
        console.log('Token JWT obtido:', authToken);
        return authToken;
    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error.message);
        throw error;
    }
}

// Função para criar um novo usuário
export async function createUser() {
    try {
        const uniqueEmail = `testeqa${Date.now()}@qa.com`;
        const response = await axios.post(`${baseUrl}usuarios`, {
            nome: 'Teste QA',
            email: uniqueEmail,
            password: '123456',
            administrador: 'true'
        }, {
            headers: { Authorization: authToken }
        });

        userId = response.data._id;
        console.log('Usuário criado com sucesso. ID:', userId);
        return userId;
    } catch (error) {
        console.error('Erro ao criar usuário:', error.response?.data || error.message);
        throw error;
    }
}
