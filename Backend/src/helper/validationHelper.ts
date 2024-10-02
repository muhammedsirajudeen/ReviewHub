// const validationHelper = (validationType: string) => {
//   switch (validationType) {
//     case 'space':
//       return spaceValidator;
//     case 'specialchar':
//       return specialCharValidator;
//     case 'minlength':
//       return minLengthValidator;
//     default:
//       break;
//   }
// };

export function spaceValidator(argument: string):boolean {
  if(argument){
    if (argument.trim() === '') {
      return true;
    } else {
      return false;
    }
  }else{
    return true
  }
}

export function specialCharValidator(argument: string): boolean {
  const specialCharRegex = /[!#$%^&*(),.?":{}|<>]/g;
  if (argument && specialCharRegex.test(argument)) {
    return true; 
  }
  return false; 
}

export function minLengthValidator(argument: string) {
  if (argument.length <= 8) {
    return true;
  } else {
    return false;
  }
}

