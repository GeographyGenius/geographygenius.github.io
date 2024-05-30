window.onload = getRandomQuiz()

function getRandomQuiz() {
    $.getJSON("/js/json/quizzes.json")
    .done(function(data) {
        let randomQuiz = data.quizList[Math.floor(Math.random()*items.length)]
        let randomQuizDisplay = toTitleCase(randomQuiz.replaceAll("-", " "))
        $.getJSON("/js/json/maps/" + randomQuiz)
        .done(function(data) {
            let imgUrl = "/images/maps/" + data.info.imgUrl
            let imgElement = document.createElement("img")
            imgElement.src = imgUrl

            let infoElement = document.createElement("p")
            infoElement.innerHTML = "Try out the " + randomQuizDisplay + " quiz!"

            document.getElementById("random-quiz-container").innerHTML = infoElement + "<br>" + imgElement

        })
        .fail(function() {
            alert("failed to load quiz")
        })
    })

    .fail(function() {
        alert("failed to load quiz list")
    })
}