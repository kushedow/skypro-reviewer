SERVERURL = "https://skypro-reviewer.onrender.com"

async function loadAllPrompts(){
    /* Загружаем с сервера все промпты */
    const url = new URL(SERVERURL+"/prompts")
    let result = []

    try {
        const response = await fetch(url, {});
        result = await response.json();

        if (response.status !== 200) {
            console.log("Не удалось загрузить промпты. Обратитесь к разработчику")
            console.log(result)
            return null
        }

    } catch (error) {
        console.log("Не удалось загрузить промпты. Обратитесь к разработчику")
        return null
    }

    return result

}

function renderPromptsDropdown(options, currentValue){
    /* Показываем выпадашку с доступными промптами на стрнице настроек */
    const selectNode = document.getElementById('options__prompt__name');
    selectNode.innerHTML = "";
    if (selectNode) {
        options.forEach(function (optionText) {
            const option = document.createElement("option");
            option.value = optionText; // Устанавливаем значение option
            option.textContent = optionText; // Устанавливаем текст содержимого option
            if (optionText === currentValue) {option.setAttribute("selected","selected" )}
            selectNode.appendChild(option); // Добавляем option в select
        });
    } else {
        console.error("Элемент #promptSelectNode не найден в дом-дереве.");
    }

}

function retreiveOptionsFromForm(){
    /* Получает введенные значения из формы */
    const form = document.getElementById('checklist__options');
    // Возвращаем нужное поле из формы
    return new FormData(form).get("options__prompt__name")
}

function saveOptions() {
    /* Сохраняем настройки при нажатии на "Сохранить" */
    var promptName = retreiveOptionsFromForm()
    chrome.storage.sync.set({promptName: promptName}, function() {
        console.log(`Options saved! ${promptName}`);
    });

}

function restoreOptions() {
    /* Загрузка сохраненных настроек */
    chrome.storage.sync.get('promptName', function(items) {
        promptName = items.promptName
        document.getElementById('options__prompt__name').value = promptName;
        console.log(`Options restored! ${promptName}`)
    });
}

/* Активируем кнопку сохранения настроек */
document.getElementById('options__save').addEventListener('click', saveOptions);

/* Загружаем названия доступных промптов при открытии страницы настроек */
loadAllPrompts().then( allPrompts => {
    renderPromptsDropdown(allPrompts)
    restoreOptions()

})

