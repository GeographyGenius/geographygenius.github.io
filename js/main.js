function goToUrl(url) {
	location.href = url
}

function goToQuiz(quiz) {
	location.href = "/geography/quiz.html?quiz=" + quiz
}

function getElement(element) {
	return document.getElementById(element)
}

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