function renderTemplate(template, data) {
    // Функция для обработки циклов вида {{#each items}} ... {{/each}}
    function handleEach(match, variablePath, insideLoop) {
        const items = get(data, variablePath.trim(), []);
        return items.map(item =>
            renderTemplate(insideLoop, {...data, this:item})
        ).join('');
    }

    // Функция для обработки условий вида {{#if var}} ... {{/if}}
    function handleIf(match, variablePath, content) {
        const value = typeof variablePath === 'string' ? get(data, variablePath) : variablePath;
        if (value) {
            return renderTemplate(content, data);
        }
        return '';
    }

    // Функция для извлечения значения по пути из объекта
    function get(obj, path, defaultValue = '') {
        if(typeof obj === 'undefined'){
            return defaultValue;
        }
        const result = path.split('.').reduce((acc, part) => acc && acc[part], obj);
        return typeof result === 'undefined' ? defaultValue : result;
    }

    function applyModifier(value, modifier) {
        if (modifier === "trim") {
            return value.split("///")[0].split("\n").join("<br/>");
        }
    }

    // Обработка циклов
    template = template.replace(/{{#each (\w+(?:\.\w+)*)}}([\s\S]+?){{\/each}}/g, handleEach);

    // Обработка условий
    template = template.replace(/{{#if (\w+(?:\.\w+)*)}}([\s\S]+?){{\/if}}/g, handleIf);

    // Обработка обычных включений и вложенных объектов
    template = template.replace(/{{([\w\.]+)(\|\w+)?}}/g, (match, p1, p2) => {
        let variableValue = get(data, p1);
        if (p2) { variableValue = applyModifier(variableValue, p2.slice(1))}
        return variableValue;
    });

    return template;
}


async function loadTemplate(templateName) {

    try {
        const response = await fetch(chrome.runtime.getURL(`templates/${templateName}.html`))
        return await response.text()
    }
    catch {
        console.log(`Не удалось загрузить шаблон ${templateName}`)
    }

}

async function renderToCode(templateName, data){
    try {
        const templateCode = await loadTemplate(templateName)
        const renderedCode = render(templateCode, data).replace("\n", "")
        console.log(renderedCode)
        return renderedCode

    }
    catch {
        console.log(`Не удалось отренерить шаблон ${templateName}`)
    }

}

async function renderFromTemplate(selector, templateName, data) {

    try {
        const renderedCode = renderToCode(templateName, data)
        const nodeToUpdate = document.querySelector(selector)
        nodeToUpdate.innerHTML = renderedCode
    } catch {
        console.log(`Не удалось отрендерить шаблон ${templateName} в элемент ${selector}`)
    }

}


window.render = renderTemplate