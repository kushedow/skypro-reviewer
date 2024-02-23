function getCheckListLink() {
    const links = document.querySelectorAll('a[href^="https://docs.google.com/spreadsheets"]');
    for (const linkNode of links) {
        if (linkNode.textContent.includes('Чеклист решения')) {
            return linkNode.attributes.getNamedItem("href").value; // Возвращаем найденную ссылку и останавливаем поиск
        }
    }
}



function handleGenerateReview() {

}