function renderTemplate(template, data) {
    // Функция для обработки циклов вида {{#each items}} ... {{/each}}
    function handleEach(match, p1, insideLoop) {
        return get(data, p1.trim(), []).map(item =>
            insideLoop.replace(/{{this(\.\w+)?}}/g, (match, property) =>
                property ? get(item, property.slice(1)) : item
            )
        ).join('');
    }

    // Функция для извлечения значения по пути из объекта
    function get(obj, path, defaultValue = '') {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
    }

    // Обработка циклов
    template = template.replace(/{{#each (\w+)}}([\s\S]+?){{\/each}}/g, handleEach);

    // Обработка обычных включений и вложенных объектов
    return template.replace(/{{([\w\.]+)}}/g, (match, p1) => get(data, p1));
}

window.render = renderTemplate
