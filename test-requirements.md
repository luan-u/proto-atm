# Exercício - Simulador Caixa Eletrônico

Desenvolver APIs simulando operações de um caixa eletrônico com os seguintes requisitos:

1. Possibilidade de cadastrar, alterar, excluir e buscar usuários. Os atributos para usuário precisam ser nome, data de nascimento e cpf.
2. Possibilidade de cadastrar contas para usuários com tipo da conta (poupança ou corrente) e saldo.
3. O usuário poderá fazer depósito de qualquer valor em sua conta, exceto centavos.
4. O usuário poderá fazer saque de sua conta apenas utilizando as notas de 20, 50 ou 100.
  - A API de saque deverá priorizar as notas maiores para compor o valor total. Exemplo: Se escolher sacar 150,
    então liberar uma nota de 100 e outra de 50. Se escolher sacar 60, então deverá liberar 3 notas de 20.
  - Se o valor solicitado para saque for maior que o disponível na conta do usuário, retornar erro.
  - Se não houver cédulas disponíveis para o valor solicitado, retornar erro. Por exemplo, se for solicitado o
    saque de 15, não será possível seguir com a operação visto que a nota mínima de saque é 20.
5. Garantir que na concorrência das operações (saque e depósito), um saque, por exemplo, precisa esperar que o outro finalize para executar.

## O que é esperado?
  - Testes automatizados de alguns fluxos
  - Uso de banco de dados
  - Uso dos padrões de API RESTful (verbos, endpoints, status code, etc)
  - Documentação de como executar a aplicação
  - Documentação de como usar os endpoints
  - Uso de git, o código poderá estar no Github ou Bitbucket

## O que deve ser avaliado?
  - Estruturação do banco de dados
  - Estrutura do projeto
  - Design de código
  - Eficiência dos testes
  - Se o projeto está seguindo os padrões API RESTful
  - Clareza da documentação de como executar e utilizar os endpoints
  - Requisitos do escopo entregues (Não precisa ser completo)
