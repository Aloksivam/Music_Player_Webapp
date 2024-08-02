# def sum(num1=0,num2):#Non-default argument follows default arguments
def sum(num1,num2):
    return num1+num2
def sumvar(*num):
    sum=0
    for i in num:
        sum+=i
    return sum
print(sum(11,65))
print(sumvar(11))
