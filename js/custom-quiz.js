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
let binaryExcludeData
let finalString
let shortenedURL
// const Swal = require('sweetalert2')

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    checkBoxes = document.getElementById("check-countries")
    // points_box = document.getElementById("points") // get points box
    // question_count_box = document.getElementById("questions") // get questions box
    // guesses_box = document.getElementById("guesses") // get guesses box
    // guesses_box.innerHTML = "0/0 guesses correct"

    // correctGuesses = 0
    // incorrectGuesses = 0
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
    quizName = searchParams.get("q")
    if (!searchParams.has("q")) { // if invalid url, redirect to home
        location.href = "/"
    }
    const urlToLoad = "/js/json/" + quizName + ".json"
    loadFromJSON(urlToLoad)
    }

// function finishSetup() {
    // let mapScale = 1;
    // let map = document.getElementById("main_map");
    // if (map.width == 0) {
    //     location.reload()
    // }
    // map.width *= mapScale;

    // totalQuestionCount = questionList.length
    // remainingQuestions = structuredClone(questionList)
    // quizOver = false
    // points = 0
    // questionNumber = 0
    // changeQuestionNumber()

    // setNewRandomCountry("none");
// }

function mapLoaded() {
    console.log("map loaded")
    
    let displayQuizName = structuredClone(quizName)
    displayQuizName = displayQuizName.replaceAll("-",  " ")
    displayQuizName = toTitleCase(displayQuizName)
    document.getElementById("base-title").innerHTML = displayQuizName + ": "
    // console.log("quiz name fancy: " + displayQuizName)
    document.getElementsByTagName("title")[0].text = "Customize Quiz - " + displayQuizName + " - Geography Genius"; // update page title
    document.getElementById("message-box").innerHTML = "Customize Quiz - " + displayQuizName

    let fancyInnerHTML = ""
    let dataMaphilight
    let extraStyles
    if (searchParams.has("c")) {
        isCustomQuiz = true
        excludeData = base64ToBinary(searchParams.get("c"), fullCountryList.length)
    // } else {
    //     isCustomQuiz = false
    // }
    // for (let i = 0, countryData = loadedData.countryData; i < countryData.length; i++) {
    //     if (isCustomQuiz) {
    //         if (excludeData.charAt(fullCountryList.indexOf(countryData[i].countryName)) == "1") {
    //             dataMaphilight = "data-maphilight='{\"stroke\":false,\"fillColor\":\"000000\",\"fillOpacity\":0.1,\"alwaysOn\":true}'";
    //             extraStyles = 'style="cursor:default" '
                
    //             const index = questionList.indexOf(countryData[i].countryName);
    //             if (index > -1) { // only splice array when item is found
    //                 questionList.splice(index, 1); // 2nd parameter means remove one item only
    //                 if (doCapitals) {
    //                     capitalList.splice(index, 1);
    //                 }
    //             }
    //         } else {
    //             dataMaphilight = ""
    //             extraStyles = ""
    //         }
    //     } else {
    //         dataMaphilight = ""
    //         extraStyles = ""
    //     }//onclick="submitCountry(' + "'" + countryData[i].countryName + "'" + ')" no more onlick
    //     let id
    //     id = spaceToHyphen(countryData[i].countryName)
    //     if (fancyInnerHTML.includes('"thing-' + id + '"')) {
    //         id += "-2"
    //     }
    //     fancyInnerHTML = fancyInnerHTML + '<area shape="poly"' + ' id="thing-' + id + '" ' + dataMaphilight + ' ' + extraStyles + 'coords="' + countryData[i].countryCoords + '" />'
    } else {
        excludeData = ""
    }
    let checkboxesString = ""
    let i = 0
    while (i < fullCountryList.length) {
        checkboxesString += '<td valign="top" style="font-size:small;" min-width="200px" width="230px">'
        for (let count = 0, displayName; count < 28 && i < fullCountryList.length; i++, count++) {
            displayName = fullCountryList[i]

            // if (doCapitals == true) { // removed temperarily
                // displayName = calcCapitalFromCountry(displayName)
            // }

            checkboxesString += `<input type="checkbox" id="${spaceToHyphen(fullCountryList[i]) + "-checkbox"}" class="country-checkbox" name="${spaceToHyphen(fullCountryList[i]) + "-checkbox"}" value="${spaceToHyphen(fullCountryList[i])}">\n<label for="${spaceToHyphen(fullCountryList[i]) + "-checkbox"}"> ${displayName}</label><br>\n`
        }
        checkboxesString += "</td>"
    }
    checkBoxes.innerHTML = checkboxesString
    // document.getElementById("map-land").innerHTML = fancyInnerHTML
    // generateHighlightJS() // add the highlighting
    // setTimeout(() => {finishSetup()}, 200);
    finishSetup()
    // document.getElementById("main_map").hidden = false
    
    // finishSetup()

    // $(function(){
    // $('.map').maphilight({
    //    fillColor: '000000',//'4ead45',//'fff4a1',
    //    fillOpacity:0.1,
    //    stroke:false,
    // });
    // })

    // $('input-description').on('keyup', function(){
    //     $(this).val($(this).val().replace(/[\r\n\v]+/g, ''));
    // });
    constrainInput = (event) => { 
        event.target.value = event.target.value.replace(/[\r\n\v]+/g, '')
    }
      
    document.querySelectorAll('textarea').forEach(el => {
        el.addEventListener('keydown', constrainInput)
    })
    document.querySelectorAll('textarea').forEach(el => {
        el.addEventListener('keyup', constrainInput)
    })

}

function constrainInputV2(el) {
    el.value = el.value.replaceAll("\r", "")
    el.value = el.value.replaceAll("\n", "")
    el.value = el.value.replaceAll("\v", "")
    return
}

function finishSetup() {
    // console.log("running...")
    if (!(excludeData == "")) {
        loadState(excludeData)
    } else {
        selectAllCountries()
    }
    // document.getElementById("message-box").hidden = true
    document.getElementById("ui-section").hidden = false
    // document.getElementById("text_box").hidden = false
    // document.getElementById("everything").hidden = false
    document.getElementById("quiz-footer").hidden = false // so footer isn't visible during loading
    // document.getElementById("map_land").hidden = false
    document.getElementById("main_map").hidden = false
}

function generateHighlightJS() {
    let areaNames = document.getElementsByTagName("area")
    let actualCountryNames = []
    for (let i = 0; i < areaNames.length; i++) {
        let id = areaNames[i].id
        actualCountryNames.push(id.slice(6))
    }
    console.log(actualCountryNames)
    let jsString
    let code = "function clickToggle() {\n"
    // for (let i = 0; i < fullCountryList.length; i++) { // old code
    //     jsString = '$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").click(function(a){a.preventDefault();a=$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").mouseout().data("maphilight")||{};a.alwaysOn=!a.alwaysOn,setCountryVisible("' + i + '", a.alwaysOn),$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").data("maphilight",a).trigger("alwaysOn.maphilight")});'
    //     // console.log(jsString)
    //     code += jsString
    // }
    for (let i = 0; i < actualCountryNames.length; i++) {
        jsString = '$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").click(function(a){a.preventDefault();a=$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").mouseout().data("maphilight")||{};a.alwaysOn=!a.alwaysOn,setCountryVisible("' + i + '", a.alwaysOn),$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").data("maphilight",a).trigger("alwaysOn.maphilight")});'
        // console.log(jsString)
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
        let imgUrlLabeled = loadedData.info.imgUrl.replaceAll(".png", "") + "-labeled"

        binaryExcludeData = ""
        while (binaryExcludeData.length < fullCountryList.length) {
            binaryExcludeData += "0"
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

        // let imageURL = "/images/maps/" + loadedData.info.imgUrl
        // // let imageURL = "/images/maps/" + quizName + ".png"
        // document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'

        addTitleAndDescription()
        document.getElementsByClassName("labeled-map")[0].innerHTML = `<img id="main_map" hidden="true" src="/images/maps/${imgUrlLabeled}.png" onload="mapLoaded()">`
        // mapLoaded() // img does it instead
    })

    .fail(function() {
        alert(`Failed to load quiz - Try again later`)
        console.log("JSON request failed - quiz failed to load.");
        if (!possibleQuizzes.includes(quizName)) {
            var failText = "404 - Quiz not found"
        } else {
            var failText = "Hm, it looks like the page failed to load. Reload the page, or try again later?"
        }
        document.getElementById("message-box").innerHTML = failText;
        // document.getElementsByClassName("map")[0].remove()
    })
}

function addTitleAndDescription() {
    if (searchParams.has("t")) {
        document.getElementById("input-title").value = decodeURIComponent(searchParams.get("t"))
    }
    if (searchParams.has("d")) {
        document.getElementById("input-description").value = decodeURIComponent(searchParams.get("d"))
    }
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

function setCountryVisible(countryNumber, value) {
    let bit
    if (value == true) {
        bit = "1"
    } else {
        bit = "0"
    }
    console.log(value, bit, parseInt(countryNumber))
    binaryExcludeData = setCharAt(binaryExcludeData, parseInt(countryNumber), bit)
    console.log(binaryExcludeData)
}

function selectAllCountries() {
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        countries[i].checked = true
    }
}

function deselectAllCountries() {
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        countries[i].checked = false
    }
}

function saveCustom() {
    document.getElementById("save-custom-quiz").innerHTML = "Please wait..."
    setTimeout(() => {actuallySaveCustomQuiz()}, 100);
}

function shortenQuizURL() {
    saveStateToURL()
    let finalString
    finalString = window.location.href
    finalString = finalString.replaceAll("customize-quiz", "quiz")
    let backupString = structuredClone(finalString)
    let response
    try {
        response = httpGet(`https://tinyurl.com/api-create.php?url=${finalString}`)
    }
    catch(err) {
        httpResponseStatus = 500
    }
    if (!(httpResponseStatus == 200)) {
        console.log("Error")
        return finalString
    } else {
        console.log(httpResponseStatus)
        response = response.slice(20)

        finalString = "https://" + window.location.hostname + "/q/" + response
        return finalString
    }
}

function actuallySaveCustomQuiz() {
    // let countries = document.getElementsByClassName("country-checkbox")
    // let encodedString = ""
    // for (let i = 0; i < countries.length; i++) {
    //     if (countries[i].checked == true) {
    //         encodedString += "0"
    //     } else {
    //         encodedString += "1"
    //     }
    // }
    // encodedString = binaryToBase64(encodedString)
    saveStateToURL()
    finalString = window.location.href
    finalString = finalString.replaceAll("customize-quiz", "quiz")
    let backupString = structuredClone(finalString)

    // fetch(`https://tinyurl.com/api-create.php?url=${finalString}`)
    //     .then((response) => response.text())
    //     .then((text) => text.slice(20))
    //     .then((short) => setShortenedURL(short))
    // setTimeout(() => {finishSaving()}, 500);
    let response
    let shareMessage
    let icon
    try {
        response = httpGet(`https://tinyurl.com/api-create.php?url=${finalString}`)
    }
    catch(err) {
        httpResponseStatus = 500
    }

    if (!(httpResponseStatus == 200)) {
        console.log("Error")
        shareMessage = `Encountered http error ${httpResponseStatus} while attempting to contact the server - instead, use the link below`
        icon = "info"
    } else {
        shareMessage = "Copy the link below to share this custom quiz"
        icon = "success"
        console.log(httpResponseStatus)
        response = response.slice(20)

        finalString = "https://" + window.location.hostname + "/q/" + response
    }
    document.getElementById("save-custom-quiz").innerHTML = "Save & Share"
    // console.log("Final quiz url: " + finalString)
    Sweetalert2.fire({
        title: 'Save & Share',
        html: `<span id="main-copy-text">${shareMessage}</span><br><input type="text" readonly="readonly" id="finished-url" onclick="copyQuizURL()" style="width: 400px;margin: 10px;font-size: 15px;"value="${finalString}">`,
        icon: icon,
        confirmButtonText: 'Done'
    })
}

function copyQuizURL() {
    let copyText = document.getElementById("finished-url")
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Alert the copied text
    document.getElementById("main-copy-text").innerHTML = "Copied to clipboard!"
}

function loadState(data) {
    // console.log(data)
    let countries = document.getElementsByClassName("country-checkbox")
    let isChecked
    // console.log(countries)
    for (let i = 0; i < countries.length; i++) {
        if (data[i] == "0") {
            isChecked = true
        } else {
            isChecked = false
        }
        // console.log(data[i], isChecked)
        countries[i].checked = isChecked
    }
}

function saveStateToURL() {
    constrainInputV2(document.getElementById("input-description"))
    let saveString = ""
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        if (countries[i].checked == true) {
            saveString += "0"
        } else {
            saveString += "1"
        }
    }

    if (Math.round(parseInt(saveString)) == 0) {
        if (searchParams.has("c")) {
            searchParams.delete("c")
        }
    } else {
        if (searchParams.has("c")) {
            searchParams.set("c", binaryToBase64(saveString))
        } else {
            searchParams.append("c", binaryToBase64(saveString))
        }
    }

    if ((document.getElementById("input-title").value) == "") {
        if (searchParams.has("t")) {
            searchParams.delete("t")
        }
    }
    if (searchParams.has("t")) {
        searchParams.set("t", decode3encode(document.getElementById("input-title").value))
    } else {
        if (!(document.getElementById("input-title").value) == "") {
            searchParams.append("t",  decode3encode(document.getElementById("input-title").value))
        }
    }

    if ((document.getElementById("input-description").value) == "") {
        if (searchParams.has("d")) {
            searchParams.delete("d")
        }
    }
    if (searchParams.has("d")) {
        searchParams.set("d", decode3encode(document.getElementById("input-description").value))
    } else {
        if (!(document.getElementById("input-description").value) == "") {
            searchParams.append("d",  decode3encode(document.getElementById("input-description").value))
        }
    }

    updateURLParams() 
}

function updateURLParams() {
    var newurl = window.location.protocol + "//" + window.location.host + "/geography/customize-quiz?" + searchParams.toString();
    window.history.pushState({path:newurl},'',newurl);
}

function playQuiz() {
    saveStateToURL()
    window.location.href = window.location.href.replace("customize-quiz", "quiz")
}

function submitQuizToShare() {
    Sweetalert2.fire({
        title: 'Submit this quiz',
        html: `<span>Submit this quiz to be added to be added to the <link rel="/geography/custom-quizzes"> custom quiz list.`,
        icon: "info",
        confirmButtonText: 'Submit',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            saveStateToURL()
            window.open(`/misc/submit-quiz?data=${btoa(window.location.search/*shortenQuizURL()*/)}`, '_blank').focus();
        }
    })
}