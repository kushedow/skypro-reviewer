function registerHandlers() {

    // Добавляем DOM документа обработчики нашими событиями после загрузки критериев

    generateButton = document.getElementById("checklist__form__generate")
    generateButton.addEventListener("click", (e) => {
        buildReview()
    })

    improveButton = document.getElementById("checklist__form__improve")
    improveButton.addEventListener("click", improveReview)

    markButtons = document.querySelectorAll(".mark-area input")
    markButtons.forEach(el => {

        el.addEventListener('click', (e) => {
            reportChecklistToServer()
        })
    });

    //  Добавляем раскрашивание в разные цвета после выделения радиокнопок
    const radios =  document.querySelectorAll("#checklist__form .checklist-options input")
    radios.forEach(el => {

        el.addEventListener("change", (e) => {

            /* Перекрасить кружочки */

            grade = e.target.getAttribute("value")
            groupIndex = e.target.dataset.index
            highlightCheckboxGroup(groupIndex, grade)

            /* Загрузить подсказки в окно комментариев */

            // У нас есть оценка. получаем комментарий к оценке
            const noteNode = document.getElementById("checklist__note__"+groupIndex)
            const gradeCommentData = checklist[groupIndex][grade].split("///")
            if (gradeCommentData[1]) {noteNode.value=gradeCommentData[1].trim()} else {noteNode.value=""}
            updateHeight(noteNode)

        })

    });

    const textareas = document.querySelectorAll(".checklist__note")
    console.log(textareas)
    textareas.forEach(node => {
        node.addEventListener("input", (e) => {
            updateHeight(node)
        })
    })

}