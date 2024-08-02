var minimizeSet = function(divisor1, divisor2, uniqueCnt1, uniqueCnt2) {
    let count1 = 0, count2 = 0;
  let arr1 = [];
  let arr2 = [];
  let i ;

  if (divisor1>uniqueCnt1 && divisor1>divisor2) {
//   if (divisor1>divisor2) {
//   if (uniqueCnt1<uniqueCnt2) {
      for (i = 1; count1 < uniqueCnt1 || count2 < uniqueCnt2; i++) {
          if (i % divisor1 && count1 < uniqueCnt1) {
              arr1.push(i);
              count1++;
          }
          else {
              if (i % divisor2 && count2 < uniqueCnt2) {
                  arr2.push(i);
                  count2++;
              }
          }
      }
  }
  else {  
          for (i = 1; count1 < uniqueCnt1 || count2 < uniqueCnt2; i++) {
              if (i % divisor2 && count2 < uniqueCnt2) {
                  arr2.push(i);
                  count2++;
              }
              else {
                  if (i % divisor1 && count1 < uniqueCnt1) {
                      arr1.push(i);
                      count1++;

                  }
              }

          }
      }
      console.log(arr1)
      console.log(arr2)
      return Math.max(Math.max(...arr1), Math.max(...arr2));
};
console.log(minimizeSet(12,3,2,10))
console.log(minimizeSet(2,4,8,2))
// console.log(minimizeSet(9,4,8,3))
// console.log(minimizeSet(3,5,2,1))