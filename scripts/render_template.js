function renderTemplate(template, data) {
    // Функция для обработки циклов вида {{#each items}} ... {{/each}}
    function handleEach(match, variablePath, insideLoop) {
        const items = get(data, variablePath.trim(), []);
        return items.map(item =>
            renderTemplate(insideLoop, {this:item})
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

    // Обработка циклов
    template = template.replace(/{{#each (\w+(?:\.\w+)*)}}([\s\S]+?){{\/each}}/g, handleEach);

    // Обработка условий
    template = template.replace(/{{#if (\w+(?:\.\w+)*)}}([\s\S]+?){{\/if}}/g, handleIf);

    // Обработка обычных включений и вложенных объектов
    template = template.replace(/{{([\w\.]+)}}/g, (match, p1) => get(data, p1));

    return template;
}

window.render = renderTemplate