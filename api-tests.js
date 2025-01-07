import axios from 'axios';
import { expect } from 'chai';

const baseUrl = 'https://serverest.dev/';
let authToken = '';
let userId = '';

describe('Testes de API - ServeRest', function () {
    this.timeout(5000);

    //Login para token JWT
    before(async function () {
        const response = await axios.post(`${baseUrl}login`, {
            email: 'teste@teste.com',
            password: '123senha'
        });
        authToken = response.data.authorization;
        expect(response.status).to.equal(200);
        expect(authToken).to.be.a('string');
        console.log('Token JWT obtido:', authToken);
    });

    // 1. Lista de Usuários
    it('Deve retornar a lista de usuários', async function () {
        const response = await axios.get(`${baseUrl}usuarios`, {
            headers: { Authorization: authToken }
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('quantidade');
        console.log('Lista de usuários retornada com sucesso.');
    });

    // 2. Criar Novo Usuário
    it('Deve criar um novo usuário', async function () {
        const response = await axios.post(`${baseUrl}usuarios`, {
            nome: 'José Carlos',
            email: 'jose.carlos@teste.com',
            password: '123senha',
            administrador: 'false'
        }, {
            headers: { Authorization: authToken }
        });

        expect(response.status).to.equal(201);
        expect(response.data.message).to.equal('Cadastro realizado com sucesso');
        userId = response.data._id;
        console.log('Usuário criado com sucesso. ID:', userId);
    });

    // 3. Usuários por ID
    it('Deve buscar usuário pelo ID', async function () {
        const response = await axios.get(`${baseUrl}usuarios/${userId}`, {
            headers: { Authorization: authToken }
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('_id', userId);
        console.log('Usuário retornado com sucesso:', response.data);
    });

    it('Deve atualizar os dados do usuário pelo ID', async function () {
        const response = await axios.put(`${baseUrl}usuarios/${userId}`, {
            nome: 'José Carlos Atualizado',
            email: 'jose.carlos.atualizado@teste.com',
            password: 'novaSenha123',
            administrador: 'true'
        }, {
            headers: { Authorization: authToken }
        });

        expect(response.status).to.equal(200);
        expect(response.data.message).to.equal('Registro alterado com sucesso');
        console.log('Usuário atualizado com sucesso.');
    });

    it('Deve excluir o usuário pelo ID', async function () {
        const response = await axios.delete(`${baseUrl}usuarios/${userId}`, {
            headers: { Authorization: authToken }
        });

        expect(response.status).to.equal(200);
        expect(response.data.message).to.equal('Registro excluído com sucesso');
        console.log('Usuário excluído com sucesso.');
    });

    // 4. Validação de Erros
    it('Deve retornar erro ao criar um usuário com email já existente', async function () {
        try {
            await axios.post(`${baseUrl}usuarios`, {
                nome: 'José Carlos',
                email: 'jose.carlos@teste.com',
                password: '123senha',
                administrador: 'false'
            }, {
                headers: { Authorization: authToken }
            });
        } catch (error) {
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.equal('Este email já está sendo usado');
            console.log('Erro validado com sucesso ao tentar criar um usuário com email duplicado.');
        }
    });
});
