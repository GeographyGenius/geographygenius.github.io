try {
	let httpResponseStatus
}
catch(err) {
	console.log("Error - " + err)
}

function goToUrl(url) {
	location.href = url
}

function goToQuiz(quiz) {
	location.href = "/geography/quiz.html?quiz=" + quiz
}

// function getElement(element) {               // USELESS!!11!
// 	return document.getElementById(element)
// }

function toTitleCase(str) {
	return str.replace(
	    /\w\S*/g,
	    function(txt) {
		    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    }
	);
}

window.onerror = function(msg, url, linenumber) {
    alert('Error\n————————————————\nError message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

// function binaryToBase36(binaryString) {
// 	let i = 0
// 	let chunk
// 	let parsed
// 	let base36encoded
// 	let encoded = ""
// 	while(i < binaryString.length) {
// 		chunk = binaryString.slice(i, i + 5)
// 		while(chunk.length < 5) {
// 			chunk = "0" + chunk
// 		}
// 		parsed = parseInt(chunk, 2)
// 		base36encoded = parsed.toString(36)
// 		encoded += base36encoded
// 		i += 5
// 	}
// 	return encoded
// }

// function base36ToBinary(input, totalLength) {
// 	let result
// 	let decoded = ""
// 	let i = 0
// 	for (i = 0; i < input.length - 1; i++) {
// 		result = decimal2binary(parseInt(input[i], 36))
// 		while (result.length < 5) {
// 			result = "0" + result
// 		}
// 		decoded += result
// 	};
// 	result = decimal2binary(parseInt(input[i], 36))
// 	while (decoded.length + result.length < totalLength) {
// 		result = "0" + result
// 	}
// 	decoded += result

// 	return decoded
// }

// function decimal2binary(dec) {
// 	return (dec >>> 0).toString(2);
// }

// let base64lookup = "0123456789ABCDEFGHIJKLMNOPQRSTVUWXYZabcdefghijklmnopqrstuvwxyz-_"

function binaryToBase64(binaryString) {
	let base64lookup = "0123456789ABCDEFGHIJKLMNOPQRSTVUWXYZabcdefghijklmnopqrstuvwxyz-_"

	let i = binaryString.length
	let chunk
	let parsed
	let base64Char
	let encoded = ""
	while(i > 0) {
        // console.log(i)
        if (i < 6) {
            chunk = binaryString.slice(0, i)
        } else {
    		chunk = binaryString.slice(i - 6, i)
        }
        // console.log(chunk)
		while(chunk.length < 6) {
			chunk = "0" + chunk
		}
        // console.log(chunk)
		decimal = parseInt(chunk, 2)
        // console.log(decimal)
		b64Char = base64lookup.charAt(decimal)
        // console.log(b64Char)
		encoded = b64Char + encoded
		i -= 6
	}
	return encoded
}

function base64ToBinary(input, totalLength) {
	let base64lookup = "0123456789ABCDEFGHIJKLMNOPQRSTVUWXYZabcdefghijklmnopqrstuvwxyz-_"

	let i = 0
	let decodedBinary = ""
	firstDigitWidth = totalLength % 6
	if (firstDigitWidth == 0) {
		firstDigitWidth = 6
	}
	decimal = base64lookup.indexOf(input.charAt(i))
	binary = decimal.toString(2)
	while (binary.length < firstDigitWidth) {
		binary = "0" + binary
	}
	decodedBinary += binary
	for (i = 1; i < input.length; i++) {
		decimal = base64lookup.indexOf(input.charAt(i))
		// console.log(decimal)
		binary = decimal.toString(2)
		// console.log(binary)
		while (binary.length < 6) {
			binary = "0" + binary
		}
		decodedBinary += binary
	}
	// console.log(decodedBinary.length)
	return decodedBinary
}

function spaceToHyphen(str) {
	return str.replaceAll(" ", "_")
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
	httpResponseStatus = xmlHttp.status
    return xmlHttp.responseText;
}

// if (window.location.pathanme = "/") {
// 	window.location.href = "/home"
// }