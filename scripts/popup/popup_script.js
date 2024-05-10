// HELPERS

async function callContentAction(message, data, callback) {
    /* Передает запрос на вызов события по его названию в контенте, вызывает коллбэк когда готово */

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        return chrome.tabs.sendMessage(tabs[0].id, {message: message, ...data}, callback)
    });

}

async function isItTaskPage() {
    /* Проверяем подходит ли наша страничка для генерации критерия */
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true}, tabs => {
            const currentURL = tabs[0].url;
            resolve(currentURL.startsWith("https://student-care.sky.pro/ticket"));
        });
    });
}

// INTERACTION WITH PAGE CONTENT

async function pushChecklistToContent(checklistLink) {
    /* Если выбран специальный ID критериев, начинает его загрузку */

    let checklistURL = ""

    try {
        // Формируем ссылку на наш сервер
        const regex = /\/d\/([a-zA-Z0-9-_]+)/;
        const checklistID = checklistLink.match(regex)[1];
        checklistURL = "https://skypro-reviewer.onrender.com/checklist/" + checklistID

    } catch (error) {
        setStatusPanelValue("Ошибка при преобразовании адреса критериев.<br/>Проверьте ссылку", "warning")
        return
    }

    await callContentAction("show_checklist", {source: checklistURL}, null)

}

function setStatusPanelValue(value, status="success") {
    /* Меняем содержимое  алерта на выпадашке */
    const alertBox = document.querySelector(".review-alert")
    alertBox .innerHTML = value
    alertBox.className = "";
    alertBox.classList.add("review-alert")
    alertBox.classList.add("review-alert--"+status)

}


async function callAutodetectFunction() {
    /* Определяем название задания при старте  */

    await callContentAction("detect_task_name", {}, async (response) => {

        if (!response) {
            setStatusPanelValue("Не удалось запустить функцию. Обновите страницу", "warning")
            return true
        }

        else if (!response.result.task_name) {
            setStatusPanelValue("Не удалось определить задание", "warning")
            return true
        }

        else {
            const taskName = response.result.task_name
            setStatusPanelValue("Определено задание: " + taskName + "<br> Загружаем чеклист!", "success")
            await callContentAction("autoload_checklist", {}, async (response) => {})
            return true
        }
    })

}

document.addEventListener('DOMContentLoaded', async function () {

    document.querySelectorAll(".review-popup__trigger").forEach(trigger => {
        trigger.addEventListener("click", function (e) {
            const checklistSource = e.target.dataset.source; // получаем значение атрибута data-source
            if (!checklistSource || checklistSource === "") {
                alert("Не указана ссылка на чеклист, обратитесь к разработчику");
                return
            }
            pushChecklistToContent(checklistSource).then()
        });
    });


    document.getElementById("review-popup__custom__trigger").addEventListener("click", function (e) {
        const checklistLink = document.getElementById("review-popup__custom__source").value
        pushChecklistToContent(checklistLink).then()
    })

    /* Вызываем автозагрузку критериев каждый раз как открыт поп-ап */

    if(!await isItTaskPage()) {
        setStatusPanelValue("❌ Мы не на странице задания, отменяем загрузку!", "warning")
        return
    }

    checkVersion()
    callAutodetectFunction()


}, false);


