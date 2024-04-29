// window.onload = setup()
setTimeout(() => {setup()}, 200);

function setup() {
    let searchParams = new URLSearchParams(window.location.search)

    if (!(searchParams.has("data"))) {
        window.location.href = "/"
    } else {
        let quizURL = "https://" + window.location.host + "/geography/quiz" + atob(searchParams.get("data"))
        console.log(quizURL)
        formDiv = document.getElementById("form-container")
        formDiv.innerHTML = `<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdmVw7wO8HzBLRiUNQOuxEbDJIh0vMw7RqNr7w7-67pgmDI0w/viewform?entry.1624436263=${encodeURIComponent(quizURL)}" width="100%" height="650px" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`
    }
}