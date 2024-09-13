Funcionalidades

- Validação no Cliente e no Servidor: O formulário realiza a validação no cliente com o Zod e exibe mensagens de erro, além de tratar validações vindas do servidor.
- Botão para Exibir/Ocultar Senha: Um botão interativo permite esconder ou mostrar a senha no formulário.
- Preenchimento Automático de Endereço: Ao inserir o CEP, os campos de endereço e cidade são automaticamente preenchidos com base em dados obtidos de uma API de CEP.
- Máscaras para Telefone, CPF e CEP:
Telefone: (00) 00000-0000

CPF: 000.000.000-00

CEP: 00000-000

# Requisitos de Validação
A validação do formulário segue estas regras:

- name: obrigatório, máximo de 255 caracteres.
- email: obrigatório, deve ser um e-mail válido, máximo de 255 caracteres.
- password: obrigatório, mínimo de 8 caracteres, máximo de 255 caracteres.
- password_confirmation: obrigatório, mínimo de 8 caracteres, máximo de 255 caracteres.
- terms: obrigatório, deve ser um booleano.
- phone: obrigatório, máximo de 20 caracteres.
- cpf: obrigatório, máximo de 14 caracteres, deve seguir o padrão 000.000.000-00 e ser válido.
- zipcode: obrigatório, máximo de 9 caracteres, deve seguir o padrão 00000-000.
- address: obrigatório, máximo de 255 caracteres.
- city: obrigatório, máximo de 255 caracteres.

## Exemplo de formulario preenchido

