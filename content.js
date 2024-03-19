// глобальный объект для хранения чеклиста
checklist = {}

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.message === "show_checklist") {

            // вытаскиваем из переданного события адрес чеклиста
            getReviewContainer(".review-assistant")

            const checklistURL =  request.source

            const sheet_id = checklistURL.split("/").reduce((a, b) => a.length > b.length ? a : b)
            // загружаем с сервера чеклист
            const checklistObject = await loadChecklistFromServer(sheet_id)


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
console.log("Sky.pro Reviewer activated")
