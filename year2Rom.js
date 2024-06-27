function year2Rom(num) {
    let dec = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    let rom = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    let res = ""
    for (let i in dec) {
        let cur = dec[i];
        while (cur <= num) {
            res += rom[i];
            console.log("adding", rom[i])
            num -= cur;
        }
    }
    return res;
}

console.log("REZ", year2Rom(1984))