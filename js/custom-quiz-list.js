window.onload = requestData()

async function requestData() {
    const response = await fetch("https://script.google.com/macros/s/AKfycbw7N1XKrFFc2BkPEZCHa43luCCD0vCprS5QcRbQ1UFv5oSXHaD43GFXTYvQXGfFNxsCbA/exec?action=getlist")
    let quizList = await response.json()
    quizList = quizList.urlList
    console.log(`Quiz list: ${quizList}`)

    let listTable = document.getElementById("quiz-list-table")
    let url
    let title
    for (let i = 0; i < quizList.length; i++) {
        url = quizList[i]
        var searchParams = new URLSearchParams(url.slice(url.indexOf("?")))
        if (searchParams.has("title")) {
            title = searchParams.get("title")
        } else {
            title = toTitleCase(searchParams.get("quiz").replaceAll("-", " "))
        }
        listTable.innerHTML += `<tr><td><a href="${url}">${title})}</a></td></tr>`
    }

    listTable.hidden = false
    document.getElementById("fetching-data").hidden = true
}