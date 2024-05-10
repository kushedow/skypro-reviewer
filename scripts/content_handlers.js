function registerHandlers() {

    /* Отправляем критерии на сервер при выставлении оценки*/

    let markButtons = document.querySelectorAll(".mark-area input")
    markButtons.forEach(el => {

        el.addEventListener('click', (e) => {
            // Отправляем данные по чеклисту
            reportChecklistToServer()
            // Отправляем данные по софтам
            reportSoftSkillsToServer()
        })
    });

    /*  Добавляем раскрашивание и показывание поля с заметкой после простановки радиокнопки */

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
    textareas.forEach(node => {
        node.addEventListener("input", (e) => {
            updateHeight(node)
        })
    })


    // Находим все элементы содержащие атрибут @click

    const clickableElements = document.querySelectorAll('[\\@click]');

    clickableElements.forEach(elem => {

        const functionName = elem.getAttribute('@click');

        if (typeof window[functionName] === 'function') {

            // Добавляем обработчик событий клика, который вызывает функцию
            elem.addEventListener('click', function(event) {
                window[functionName](event); // Передаем событие в вызываемую функцию
            });

        } else {
            console.warn(`Функция ${functionName} не определена.`);
        }
    });

}