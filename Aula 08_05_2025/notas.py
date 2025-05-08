# Um caixa registrador precisa retornar o número de notas correto (notas de 1, 2, 5, 10, 20, 50, 100 e 200) para um saque
# Faça um programa em Python que receba um valor de saque inteiro e imprime o número de notas respectivas
# Exemplo:
## Entrada: 516
## Saída:
### Notas de 1: 1
### Notas de 2: 0
### Notas de 5: 1
### Notas de 10: 1
### ...
### Notas de 100: 1
### Notas de 200: 2

str_cashout = input("Digite o valor que deseja sacar: ")

int_cashout = int(str_cashout) # 516
bills_of_200 = int_cashout // 200 # 2
reminder_of_200 = int_cashout % 200 #  116

bills_of_100 = reminder_of_200 // 100 # 1
reminder_of_100 = reminder_of_200 % 100 # 16

bills_of_50 = reminder_of_100 // 50 # 0
reminder_of_50 = reminder_of_100 % 50 # 16

bills_of_20 = reminder_of_50 // 20 # 0
reminder_of_20 = reminder_of_50 % 20 # 16

bills_of_10 = reminder_of_20 // 10 # 1
reminder_of_10 = reminder_of_20 % 10 # 6

bills_of_5 = reminder_of_10 // 5 # 1
reminder_of_5 = reminder_of_10 % 5 # 1

bills_of_2 = reminder_of_5 // 2 # 0
reminder_of_2 = reminder_of_5 % 2 #1

bills_of_1 = reminder_of_2 // 1 # 1

print("Notas de 1: " + str(bills_of_1))
print("Notas de 2: " + str(bills_of_2))
print("Notas de 5: " + str(bills_of_5))
print("Notas de 10: " + str(bills_of_10))
print("Notas de 20: " + str(bills_of_20))
print("Notas de 50: " + str(bills_of_50))
print("Notas de 100: " + str(bills_of_100))
print("Notas de 200: " + str(bills_of_200))