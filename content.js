checklist = {}
checklistURL = ""
userName = {first: "", full: ""}

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.message === "show_checklist") {

            // вытаскиваем имя ученика
            userName = getUserName()
            console.log(`Получено имя ${userName}`)

            // вытаскиваем из переданного события адрес чеклиста
            checklistURL =  request.source

            getReviewContainer(".review-assistant")

            // зашгружаем с сервера чеклист
            const checklistObject = await loadChecklist(checklistURL)

            // записываем в глобальную переменную чеклист
            checklist = checklistObject
            console.log(checklist)

            // отображаем чеклист в DOM
            await feedbackRender.renderChecklist(checklistObject)
            registerHandlers()

            // отдаем сигнал, что чеклист загружен
            sendResponse({result: "Block added"});
            return true
        }
    });

// загружаем шаблон проверки

console.log("content scripts initialised")
