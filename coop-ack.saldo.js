// Visa ackumulerat saldo i kontoutdraget på coop.se
// https://0x539.se/ackumulerat-saldo-pa-coop-se/
//
// Author: Rickard Andersson <rickard a 0x593.se>
// License: WTFPL
//
// 2012-02-05: Release
//


(function() {

	// http://phpjs.org/functions/number_format:481
	function number_format (number, decimals, dec_point, thousands_sep) {
		// http://kevin.vanzonneveld.net
		// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +     bugfix by: Michael White (http://getsprink.com)
		// +     bugfix by: Benjamin Lupton
		// +     bugfix by: Allan Jensen (http://www.winternet.no)
		// +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// +     bugfix by: Howard Yeend
		// +    revised by: Luke Smith (http://lucassmith.name)
		// +     bugfix by: Diogo Resende
		// +     bugfix by: Rival
		// +      input by: Kheang Hok Chin (http://www.distantia.ca/)
		// +   improved by: davook
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Jay Klehr
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Amir Habibi (http://www.residence-mixte.com/)
		// +     bugfix by: Brett Zamir (http://brett-zamir.me)
		// +   improved by: Theriault
		// +      input by: Amirouche
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: number_format(1234.56);
		// *     returns 1: '1,235'
		// *     example 2: number_format(1234.56, 2, ',', ' ');
		// *     returns 2: '1 234,56'
		// *     example 3: number_format(1234.5678, 2, '.', '');
		// *     returns 3: '1234.57'
		// *     example 4: number_format(67, 2, ',', '.');
		// *     returns 4: '67,00'
		// *     example 5: number_format(1000);
		// *     returns 5: '1,000'
		// *     example 6: number_format(67.311, 2);
		// *     returns 6: '67.31'
		// *     example 7: number_format(1000.55, 1);
		// *     returns 7: '1,000.6'
		// *     example 8: number_format(67000, 5, ',', '.');
		// *     returns 8: '67.000,00000'
		// *     example 9: number_format(0.9, 0);
		// *     returns 9: '1'
		// *    example 10: number_format('1.20', 2);
		// *    returns 10: '1.20'
		// *    example 11: number_format('1.20', 4);
		// *    returns 11: '1.2000'
		// *    example 12: number_format('1.2000', 3);
		// *    returns 12: '1.200'
		// *    example 13: number_format('1 000,50', 2, '.', ' ');
		// *    returns 13: '100 050.00'
		// Strip all characters but numerical ones.
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
				dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
				s = '',
				toFixedFix = function (n, prec) {
					var k = Math.pow(10, prec);
					return '' + Math.round(n * k) / k;
				};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}


	// Strip formatting chars and parse as float
	function parsePrice(input) {

		if ( !input )
			return false;

		return parseFloat( input.replace(/kr/,'').replace(/\./, '').replace(/\,/, '.').trim() );
	}

	// Round with two decimals
	function round(input) {

		if ( !input )
			return false;

		return Math.round( input * 100 ) / 100;
	}

	// Get the table heading element and set label + class
	var header = document.querySelector("th.number + th");
	header.innerHTML = '<a>Ack. saldo</a>';
	header.classList.add('number');

	// Remove the transaction summary since I've never been able to figure out what the number actually means
	var summary = document.getElementById('TransactionsSummary');
	summary.innerHTML = '';

	// Get the current total amount
	var currentPrice = parsePrice( $(".saldo").html() );

	// Get all the cells in the table where the result should go
	var tds = document.querySelectorAll("td.number + td");

	for (var i = 0, len = tds.length - 1; i < len; i++ ) {

		// The amount for this row was calculated in the previous iteration
		tds[i].innerHTML = number_format( currentPrice, 2, ',', '.' ) + " kr";

		// Adds proper formatting
		tds[i].classList.add('number');

		// Which element contains the transaction amount. If the amount isn't a link it's the
		// previous element in the DOM, the td.number element...
		var $elem = $(tds[i]).prev();

		// ..but some rows also include an anchor tag which we've got to check for
		if ( $elem.children().length > 0 ) {
			$elem = $elem.find("a");
		}

		// Add the amount of this transaction to the current total
		currentPrice += (-1 * parsePrice( $elem.html() ));
		currentPrice = round(currentPrice);
	}
})();