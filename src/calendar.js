/* eslint-disable */
// https://github.com/jalaali/moment-jalaali
// https://github.com/alibaba-aero/jalaliday
// https://github.com/BaseMax/gregorian_to_jalali/blob/main/gregorian_to_jalali.js
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}
var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
  , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ]
function mod(a, b) {
return a - ~~(a / b) * b;
}
function div(a, b) {
return ~~(a / b);
}
function jalCal(jy, withoutLeap) {
var bl = breaks.length,
  gy = jy + 621,
  leapJ = -14,
  jp = breaks[0],
  jm,
  jump,
  leap,
  leapG,
  march,
  n,
  i;

if (jy < jp || jy >= breaks[bl - 1])
  throw new Error("Invalid Jalaali year " + jy);

// Find the limiting years for the Jalaali year jy.
for (i = 1; i < bl; i += 1) {
  jm = breaks[i];
  jump = jm - jp;
  if (jy < jm) break;
  leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
  jp = jm;
}
n = jy - jp;

// Find the number of leap years from AD 621 to the beginning
// of the current Jalaali year in the Persian calendar.
leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

// And the same in the Gregorian calendar (until the year gy).
leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

// Determine the Gregorian date of Farvardin the 1st.
march = 20 + leapJ - leapG;

// return with gy and march when we don't need leap
if (withoutLeap) return { gy: gy, march: march };

// Find how many years have passed since the last leap year.
if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
leap = mod(mod(n + 1, 33) - 1, 4);
if (leap === -1) {
  leap = 4;
}

return { leap: leap, gy: gy, march: march };
}
function j2d(jy, jm, jd) {
var r = jalCal(jy, true);
return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}
function d2g(jdn) {
var j, i, gd, gm, gy;
j = 4 * jdn + 139361631;
j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
i = div(mod(j, 1461), 4) * 5 + 308;
gd = div(mod(i, 153), 5) + 1;
gm = mod(div(i, 153), 12) + 1;
gy = div(j, 1461) - 100100 + div(8 - gm, 6);
return [gy, gm, gd]
}
function toGregorian(jy, jm, jd) {
return d2g(j2d(jy, jm, jd));
}

const toJalaali = (year, month, day) => {

	let result = [],
        array = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
        days;

	if(year <= 1600) {
		year -= 621;
		result["year"] = 0;
	} else {
		year -= 1600;
		result["year"] = 979;
	}

	const temp = (year > 2) ? (year + 1) : year;
	days = (parseInt((temp + 3) / 4)) + (365 * year) - (parseInt((temp + 99) / 100)) - 80 + array[month - 1] + (parseInt((temp + 399) / 400)) + day;
	result["year"] += 33 * (parseInt(days / 12053));
	days %= 12053;
	result["year"] += 4 * (parseInt(days / 1461));
	days %= 1461;

	if(days > 365){
		result["year"] += parseInt((days - 1) / 365);
		days = (days-1) % 365;
	}

	result["month"] = (days < 186)
							? 1 + parseInt(days / 31)
							: 7 + parseInt((days - 186) / 30);

	result["day"] = 1 + ((days < 186)
							? (days % 31)
							: ((days - 186) % 30));

	return [result["year"], result["month"], result["day"]];
}


export default {
  J: (y, m, d) => toJalaali(y, m, d),
  G: (y, m, d) => toGregorian(y, m, d)
}
