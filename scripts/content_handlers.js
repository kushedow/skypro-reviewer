function registerHandlers() {

    /* Кнопочка генерации ревью по проставленным галочкам */

    let generateButton = document.getElementById("checklist__form__generate")
    generateButton.addEventListener("click", (e) => {
        buildReview()
    })

    /* Кнопочка улучшить с помощью ИИ*/

    let improveButton = document.getElementById("checklist__form__improve")
    improveButton.addEventListener("click", improveReview)

    /* Кнопочка развернуть все критерии */

    let expandButton = document.getElementById("checklist__expand-all")
    expandButton.addEventListener("click", expandReview)

    /* Отправляем критерии на сервер при выставлении оценки*/

    let markButtons = document.querySelectorAll(".mark-area input")
    markButtons.forEach(el => {

        el.addEventListener('click', (e) => {
            reportChecklistToServer()
        })
    });

    /*  Добавляем раскрашивание и показыание поля с заметкой после простановки радиокнопки */

    const radios =  document.querySelectorAll("#checklist__form .checklist-options input")
    radios.forEach(el => {

        el.addEventListener("change", (e) => {

            /* Перекрасить кружочки */

            grade = e.target.getAttribute("value")
            groupIndex = e.target.dataset.index
            highlightCheckboxGroup(groupIndex, grade)

            /* Загрузить советы в окно комментариев при выставлении оценки */

            const noteNode = document.getElementById("checklist__note__"+groupIndex)
            const gradeCommentData = checklist[groupIndex][grade].split("///")
            if (gradeCommentData[1]) {noteNode.value=gradeCommentData[1].trim()} else {noteNode.value=""}
            updateHeight(noteNode)

        })

    });

    /* Растягиваем поле ввода при его изменении */

    const textareas = document.querySelectorAll(".checklist__note")
    console.log(textareas)
    textareas.forEach(node => {
        node.addEventListener("input", (e) => {
            updateHeight(node)
        })
    })
}