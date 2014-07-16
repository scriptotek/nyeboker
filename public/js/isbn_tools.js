/*
 * Converts a isbn10 number into a isbn13.
 * The isbn10 is a string of length 10 and must be a legal isbn10. No dashes.
 * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
 */
function ISBN10toISBN13(isbn10) {
     
    var sum = 38 + 3 * (parseInt(isbn10[0]) + parseInt(isbn10[2]) + parseInt(isbn10[4]) + parseInt(isbn10[6]) 
                + parseInt(isbn10[8])) + parseInt(isbn10[1]) + parseInt(isbn10[3]) + parseInt(isbn10[5]) + parseInt(isbn10[7]);
     
    var checkDig = (10 - (sum % 10)) % 10;
     
    return "978" + isbn10.substring(0, 9) + checkDig;
}
 
/*
 * Converts a isbn13 into an isbn10.
 * The isbn13 is a string of length 13 and must be a legal isbn13. No dashes.
 * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
 */
function ISBN13toISBN10(isbn13) {
 
    var start = isbn13.substring(3, 12);
    var sum = 0;
    var mul = 10;
    var i;
     
    for(i = 0; i < 9; i++) {
        sum = sum + (mul * parseInt(start[i]));
        mul -= 1;
    }
     
    var checkDig = 11 - (sum % 11);
    if (checkDig == 10) {
        checkDig = "X";
    } else if (checkDig == 11) {
        checkDig = "0";
    }
     
    return start + checkDig;
}

/*
 * stripISBN
 * Removes hyphens and X from given string.
 */
function stripISBN(isbn) {
    // convert to uppercase, then remove hyphens and X
    return isbn.toUpperCase().replace(/[\-X]/g, '');
}

/*
 * isISBN
 * Removes hyphens and X from given string, then returns true if result has
 * length 10 or 13.
 */
function isISBN(isbn) {
    var stripped = isbn.toUpperCase().replace(/[\-X]/g, '');
    if (stripped.length == 10 || stripped.length == 13) return true;
    return false;
}