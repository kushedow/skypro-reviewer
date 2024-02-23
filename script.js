
async function pushChecklistToContent(checklistLink) {

    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    let checklistID = checklistLink.match(regex)[1];
    // Формируем ссылку на наш сервер
    let checklistURL = "https://skypro-reviewer.onrender.com/checklist/" + checklistID

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            message: "show_checklist",
            source: checklistURL
        }, (response) => {});
    });
}


document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".review-popup__trigger").forEach(trigger => {

        trigger.addEventListener("click", function(e) {

            const checklistSource = e.target.dataset.source; // получаем значение атрибута data-source

            if (!checklistSource || checklistSource === "") {
                alert("Не указана ссылка на чеклист, обратитесь к разработчику");
                return
            }

            pushChecklistToContent(checklistSource).then()

        });
    });


    document.getElementById("review-popup__custom__trigger").addEventListener("click", function(e){

        const checklistLink = document.getElementById("review-popup__custom__source").value
        pushChecklistToContent(checklistLink).then()

    })





}, false);


