

function registerHandlers() {

    // Добавляем DOM документа обработчики нашими событиями после загрузки критериев

    generateButton = document.getElementById("checklist__form__generate")
    generateButton.addEventListener("click", buildReview)

    improveButton = document.getElementById("checklist__form__improve")
    improveButton.addEventListener("click", improveReview)

    //
    markButtons = document.querySelectorAll(".mark-area input")
    markButtons.forEach(el => {
        el.addEventListener('click', reportChecklistToServer);
    });


}