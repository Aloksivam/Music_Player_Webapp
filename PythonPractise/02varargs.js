function sum(...num){
    let sum = 0
    for (i of num){
        sum+=i
    }
    return sum;
}
console.log(sum(11,12,13))