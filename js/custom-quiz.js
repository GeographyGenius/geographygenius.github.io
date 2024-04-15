let questionList
let capitalList
let fullCountryList
let remainingQuestions
let whereIs
let quizOver
let question_box
let feedback_box
let points_box
let guesses_box
let points
let totalQuestionCount
let questionNumber
let loadedData
let possibleQuizzes
let searchParams
let quizName
let doCapitals
let checkBoxes

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    checkBoxes = document.getElementById("check-countries")
    points_box = document.getElementById("points") // get points box
    question_count_box = document.getElementById("questions") // get questions box
    guesses_box = document.getElementById("guesses") // get guesses box
    // guesses_box.innerHTML = "0/0 guesses correct"

    correctGuesses = 0
    incorrectGuesses = 0
    possibleQuizzes = [  // possible quizzes
                    "africa-countries", 
                    "africa-capitals", 
                    "south-america-countries", 
                    "south-america-captials",
                    "north-america-countries",
                    "north-america-capitals",
                    "central-america-countries",
                    "central-america-capitals",
                    "europe-countries",
                    "europe-capitals",
                    ]
    searchParams = new URLSearchParams(window.location.search);
    quizName = searchParams.get("quiz")
    if (!searchParams.has("quiz")) { // if invalid url, redirect to home
        location.href = "/"
    }
    const urlToLoad = "/js/json/" + quizName + ".json"
    loadFromJSON(urlToLoad)
    }

function finishSetup() {
    let mapScale = 1;
    let map = document.getElementById("main_map");
    if (map.width == 0) {
        location.reload()
    }
    map.width *= mapScale;

    totalQuestionCount = questionList.length
    remainingQuestions = structuredClone(questionList)
    quizOver = false
    points = 0
    questionNumber = 0
    // changeQuestionNumber()

    // setNewRandomCountry("none");
}

function mapLoaded() {
    console.log("map loaded")
    let fancyInnerHTML = ""
    let dataMaphilight
    let extraStyles
    if (searchParams.has("custom")) {
        isCustomQuiz = true
        excludeData = base64ToBinary(searchParams.get("custom"), fullCountryList.length)
    } else {
        isCustomQuiz = false
    }
    for (let i = 0, countryData = loadedData.countryData; i < countryData.length; i++) {
        if (isCustomQuiz) {
            if (excludeData.charAt(fullCountryList.indexOf(countryData[i].countryName)) == "1") {
                dataMaphilight = "data-maphilight='{\"stroke\":false,\"fillColor\":\"000000\",\"fillOpacity\":0.1,\"alwaysOn\":true}'";
                extraStyles = 'style="cursor:default" '
                
                const index = questionList.indexOf(countryData[i].countryName);
                if (index > -1) { // only splice array when item is found
                    questionList.splice(index, 1); // 2nd parameter means remove one item only
                    if (doCapitals) {
                        capitalList.splice(index, 1);
                    }
                }
            } else {
                dataMaphilight = ""
                extraStyles = ""
            }
        } else {
            dataMaphilight = ""
            extraStyles = ""
        }//onclick="submitCountry(' + "'" + countryData[i].countryName + "'" + ')" no more onlick
        fancyInnerHTML = fancyInnerHTML + '<area shape="poly"' + ' id="thing-' + countryData[i].countryName + '" ' + dataMaphilight + ' ' + extraStyles + 'coords="' + countryData[i].countryCoords + '" />'
    }
    let checkboxesString = ""
    let i = 0
    while (i < fullCountryList.length) {
        checkboxesString += '<td valign="top" style="font-size:small;">'
        for (let count = 0; count < 32 && i < fullCountryList.length; i++, count++) {
            checkboxesString += `<input type="checkbox" id="${fullCountryList[i] + "-checkbox"}" name="${fullCountryList[i] + "-checkbox"}" value="${fullCountryList[i]}">\n<label for="${fullCountryList[i] + "-checkbox"}"> ${fullCountryList[i]}</label><br>\n`
        }
        checkboxesString += "</td>"
    }
    checkBoxes.innerHTML = checkboxesString
    generateHighlightJS() // add the highlighting
    document.getElementById("map-land").innerHTML = fancyInnerHTML
    document.getElementById("main_map").hidden = false
    document.getElementById("quiz-ui").hidden = false
    document.getElementById("quiz-footer").hidden = false // so footter isn't visible during loading
    finishSetup()

    $(function(){
    $('.map').maphilight({
       fillColor: '000000',//'4ead45',//'fff4a1',
       fillOpacity:0.1,
       stroke:false,
    });
    })

    setTimeout(() => {clickToggle();}, 2000);
    console.log("toggle highlighting started")
}

function generateHighlightJS() {
    let jsString
    let code = "function clickToggle() {\n"
    for (let i = 0; i < fullCountryList.length; i++) {
        jsString = '$("#thing-' + fullCountryList[i] + '").click(function(a){a.preventDefault();a=$("#thing-' + fullCountryList[i] + '").mouseout().data("maphilight")||{};a.alwaysOn=!a.alwaysOn,console.log("' + fullCountryList[i] + ' is now " + a.alwaysOn),$("#thing-' + fullCountryList[i] + '").data("maphilight",a).trigger("alwaysOn.maphilight")});'
        console.log(jsString)
        code += jsString
    }
    code += "\n}"
    document.getElementById("country-scripts").innerHTML = code
    // clickToggle()
}

function loadFromJSON(url) {
    $.getJSON(url)
    .done(function(data) {
        loadedData = data
        questionList = loadedData.countryList
        fullCountryList = structuredClone(questionList)
        if (loadedData.info.capitals == "true") {
            doCapitals = true
            capitalList = loadedData.capitalList
        }
        // if (loadedData.info.custom == "true") {   // no more exclude list
        //     isCustomQuiz = true
        //     excludeList = loadedData.excludeList
        // }
        console.log("loaded question list")
        let headerLinks = document.getElementsByClassName("h-a")
        let areaOfWorld = loadedData.info.area
        
        if(areaOfWorld == "Americas") {
            headerLinks[1].classList = "h-a active"
        }
        if(areaOfWorld == "Africa") {
            headerLinks[2].classList = "h-a active"
        }
        if(areaOfWorld == "Europe") {
            headerLinks[3].classList = "h-a active"
        }
        if(areaOfWorld == "Asia") {
            headerLinks[4].classList = "h-a active"
        }
        if(areaOfWorld == "Oceania") {
            headerLinks[5].classList = "h-a active"
        }

        let imageURL = "/images/maps/" + loadedData.info.imgUrl
        // let imageURL = "/images/maps/" + quizName + ".png"
        document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'

        let displayQuizName = structuredClone(quizName)
        displayQuizName = displayQuizName.replaceAll("-",  " ")
        displayQuizName = toTitleCase(displayQuizName)
        // console.log("quiz name fancy: " + displayQuizName)
        document.getElementsByTagName("title")[0].text = displayQuizName + " - Geography Genius"; // update page title
    })

    .fail(function() {
        console.log("JSON request failed - quiz failed to load.");
        if (!possibleQuizzes.includes(quizName)) {
            var failText = "404 - Quiz not found"
        } else {
            var failText = "Hm, it looks like the quiz failed to load. Reload the page, or try again later?"
        }
        document.getElementById("map-land").innerHTML = failText;
        // document.getElementsByClassName("map")[0].remove()
    })
}

// function changeQuestionNumber() {
//     questionNumber += 1
//     questionNumber = Math.min(questionNumber, totalQuestionCount)
//     let question_count_box = document.getElementById("questions")
//     question_count_box.innerHTML = "Question " + questionNumber + "/" + totalQuestionCount
// }

function getRandomCountry() {
    return(remainingQuestions[Math.floor(Math.random()*remainingQuestions.length)]);
}

// function setNewRandomCountry(oldCountry) {
//     question_box = document.getElementById("text_box")
//     feedback_box = document.getElementById("feedback")

//     whereIs = getRandomCountry()
//     if (!(isQuizOver())) {
//         if (!(oldCountry == "none")) {
//             // correctGuesses += 1
//             if (doCapitals) {
//                 // feedback_box.innerHTML = "Correct, that's " + calcCapitalFromCountry(oldCountry) + ", the capital of " + oldCountry
//                 feedback_box.innerHTML = "Correct, that's " + oldCountry + ", whose capital is  " + calcCapitalFromCountry(oldCountry)
//                 question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
//             } else {
//                 feedback_box.innerHTML = "Correct, that's " + oldCountry
//                 question_box.innerHTML = "Where is " + whereIs + "?"
//             }

//         } else {
//             // feedback_box.innerHTML = "Click a country to start."
//             if (doCapitals) {
//                 question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
//             } else {
//                 question_box.innerHTML = "Where is " + whereIs + "?"
//             }
//         }
//     }
    
// }

function isQuizOver() {
    if (remainingQuestions.length == 0) {
        let percent = Math.round(points / (totalQuestionCount * pointsPerQuestion) * 100)
        // You scored " + points + "/" + totalQuestionCount * pointsPerQuestion + " (" + percent + "%)

        let extraText = ""
        if (guesses_box.hidden == false) {
            extraText += " You got " + correctGuesses + " guesses correct, and " + incorrectGuesses + " incorrect."
        }
        if (points_box.hidden == false) {
            extraText += " You got " + percent + "% score."
        }

        feedback_box.innerHTML = "Quiz over." + extraText
        question_box.innerHTML = ""
        quizOver = true
        return true
    } else {
        return false
    }
}

function removeOldCountryFromList(country) {
    const index = remainingQuestions.indexOf(country);
        if (index > -1) {
            remainingQuestions.splice(index, 1);
            // console.log(remainingQuestions)                  //for debugging
            // console.log("question list" + questionList)
        }
}

// function skipQuestion() {
//     removeOldCountryFromList(whereIs)
//     setNewRandomCountry('none')
//     feedback_box.innerHTML = ""
//     isQuizOver()
//     changeQuestionNumber()
// }

function submitCountry(country) {
    if (quizOver) {
        alert("The quiz is over.")
        return
    }

    if (isCustomQuiz) {
        if (excludeData.charAt(fullCountryList.indexOf(country)) == "1") {
            if (doCapitals) {
                alert(calcCapitalFromCountry(country) + " is not part of this quiz.")
            } else {
                alert(country + " is not part of this quiz.")
            }
            return
        }
    }

    // console.log(country, whereIs)
    if (country == whereIs) {
        // console.log("right country")
        correctGuesses += 1
        // updateGuessBox()

        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(whereIs)
    } else {
        // console.log("wrong country")
        incorrectGuesses += 1
        // updateGuessBox()

        if (doCapitals) {
            feedback_box.innerHTML = "Incorrect, that's " + calcCapitalFromCountry(country) + ", the capital of " + country + ". Try again."
        } else {
            feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        }
        if (doCapitals) {
            question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
        } else {
            question_box.innerHTML = "Where is " + whereIs + "?"
        }
        
    }
}

// function updateGuessBox() {
//     guesses_box.innerHTML = correctGuesses + "/" + (correctGuesses + incorrectGuesses) + " guesses correct"
// }

function calcCapitalFromCountry(country) {
    return(capitalList[questionList.indexOf(country)])
}