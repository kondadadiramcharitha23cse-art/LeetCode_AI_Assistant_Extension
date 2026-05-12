chrome.runtime.onMessage.addListener(
(request, sender, sendResponse) => {

    if(request.action === "getProblem") {

        const problemElement =
        document.querySelector('[data-track-load="description_content"]');

        const text = problemElement
        ? problemElement.innerText
        : "Problem not found";
        sendResponse({
            text: text.substring(0, 2000)
        });
    }

    return true;
});
