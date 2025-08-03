export const mockJSBlob = `const isEven = (num) => {
  if(num == 1) return false;
  else if(num == 2) return true;
  else if(num == 3) return false;
  else if(num == 4) return true;
  else if(num == 5) return false;
  else if(num == 5) return true;
  else if(num == 6) return false;
  else if(num == 7) return true;
  else if(num == 8) return false;
  else if(num == 9) return true;
  else if(num == 10) return false;
  else return 'out of scope';
}

// Returns true if:
//
//    n is an integer that is evenly divisible by 2
//
// Zero (+/-0) is even
// Returns false if n is not an integer, not even or NaN
// Guard against empty string

(function (global) {

  function basicTests(n) {

    // Deal with empty string
    if (n === '')
      return false;

    // Convert n to Number (may set to NaN)
    n = Number(n);

    // Deal with NaN
    if (isNaN(n))
      return false;

    // Deal with infinity -
    if (n === Number.NEGATIVE_INFINITY || n === Number.POSITIVE_INFINITY || n === Number.POSITIVE_INFINITY)
return false;

    // Return n as a number
    return n;
  }

  function isEven(n) {

    // Do basic tests
    if (basicTests(n) === false)
      return false;

    // Convert to Number and proceed
    n = Number(n);

    // Return true/false
    return n === 0 || !!(n && !(n%2));
  }
  global.isEven = isEven;

  // Returns true if n is an integer and (n+1) is even Returns false if n is not an integer or (n+1) is not even
  // Empty string evaluates to zero so returns false (zero is even)
  function isOdd(n) {

    // Do basic tests
    if (basicTests(n) === false)
      return false;

    // Return true/false
    return n === 0 || !!(n && (n%2));
  }
  global.isOdd = isOdd;

}(this));`;
