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
    const selectNode = document.getElementById('promptName');
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
    const formData = new FormData(form);
    let options = {}
    for (let [key, value] of formData.entries()) { options[key]= value }
    return options

}

function saveOptions() {

    /* Сохраняем настройки при нажатии на "Сохранить" */
    const options = retreiveOptionsFromForm();

    chrome.storage.sync.set(options, function() {
        console.log("Options saved!", options);
    });

}

function restoreOptions() {

    /* Загрузка сохраненных настроек */

    chrome.storage.sync.get('promptName', function(items) {
        promptName = items.promptName
        document.getElementById('promptName').value = promptName;
    });

    chrome.storage.sync.get('softboxOn', function(items) {
        softboxOn = items.softboxOn
        document.getElementById('softboxOn').value = softboxOn;
    });

    chrome.storage.sync.get('skillsOn', function(items) {
        skillsOn = items.skillsOn
        document.getElementById('skillsOn').value = skillsOn;
    });



}

/* Активируем кнопку сохранения настроек */
document.getElementById('options__save').addEventListener('click', saveOptions);

/* Загружаем названия доступных промптов при открытии страницы настроек */
loadAllPrompts().then( allPrompts => {
    renderPromptsDropdown(allPrompts)
    restoreOptions()

})

