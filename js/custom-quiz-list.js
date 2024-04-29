window.onload = requestData()

async function requestData() {
    const response = await fetch("https://script.google.com/macros/s/AKfycbw7N1XKrFFc2BkPEZCHa43luCCD0vCprS5QcRbQ1UFv5oSXHaD43GFXTYvQXGfFNxsCbA/exec?action=getlist")
    let quizList = await response.json()
    quizList = quizList.urlList
    console.log(`Quiz list: ${quizList}`)

    let listTable = document.getElementById("quiz-list-table")
    let url
    for (let i = 0; i < quizList.length; i++) {
        url = quizList[i]
        listTable.innerHTML += `<tr><td>${`<a href="${url}">Link to Quiz</a>`}</td></tr>`
    }
}