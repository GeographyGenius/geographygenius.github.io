if (window.location.pathname.includes("/q/")) {
    document.getElementsByTagName("title")[0].innerHTML = "Redirecting..."
    document.getElementById("redirect-message").hidden = false
    tinyurl_id = window.location.pathname.slice(3)
    if (tinyurl_id == "") {
        window.location.href = "/404"
    } else {
        let redirectURL = "https://tinyurl.com/" + tinyurl_id
        testURL(redirectURL)
    }

} else {
    document.getElementById("actually-everything").hidden = false
    document.getElementsByTagName("title")[0].innerHTML = "404 - Page Not Found - Geography Genius"
}

async function testURL(redirectURL) {
    // get rid of this if it doesn't work
    // try {
    //     let response = httpGet(redirectURL)
    //     if (response.includes("Geography Genius - Quiz") && response.includes("Loading quiz...")) {
    //         window.location.href = redirectURL
    //     } else {
    //         window.location.href = "/404"
    //     }
    // }
    // catch(err) {
    //     console.log("Error - " + err)
    //     window.location.href = "/404"
    // }
    // get rid of this if it doesn't work
    try {
        let r = await fetch(redirectURL)
        if (new URL(r.url).host.includes("geographygenius")) {
        // let response = await r.text()
        // if (response.includes("Geography Genius - Quiz") && response.includes("Loading quiz...")) {
            window.location.href = redirectURL
        } else {
            window.location.href = "/404"
        }
    }
    catch(err) {
        console.log("Error - " + err)
        window.location.href = "/404"
    }
}