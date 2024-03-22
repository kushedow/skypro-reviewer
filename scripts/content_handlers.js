

function registerHandlers() {

    // Добавляем DOM документа обработчики нашими событиями после загрузки критериев

    generateButton = document.getElementById("checklist__form__generate")
    generateButton.addEventListener("click", (e) => {

        buildReview()
        const container = getCriteriaContainer()
        const criteriaResult = createCriteriaResults()
        // renderCriteria(criteriaResult, container)

    })

    improveButton = document.getElementById("checklist__form__improve")
    improveButton.addEventListener("click", improveReview)

    markButtons = document.querySelectorAll(".mark-area input")
    markButtons.forEach(el => {

        el.addEventListener('click', (e) => {
            reportChecklistToServer()
        })

    });

    //  Добавляем раскрашивание в разные цвета после выяделения радиокнопок
    radios =  document.querySelectorAll("#checklist__form .checklist-options input")
    radios.forEach(el => {

        el.addEventListener('change', (e) => {
            grade = e.target.getAttribute("value")
            groupIndex = e.target.dataset.index
            highlightCheckboxGroup(groupIndex, grade)
        })


    });


}