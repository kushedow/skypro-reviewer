function buildReview() {
    retrieveFormData()
    const feedback = buildFeedback()
    saveReviewToEditor(feedback)
}


function getGroupsFromChecklist() {
    return new Set(Object.values(checklist).map(item => item.group))
}

function groupChecklist() {

    // Я: вот есть чеклист, а если его перебирать, то как назвать элементы? Чекайтэмс?
    // Внутренний голос: Чекаемс? Чекаю поки ти цю х*йню видалиш, дурень!!
    // Я: чекбоксес!
    // Внутренний голос: набагато краще!

    const group_names = getGroupsFromChecklist()
    let groups = []

    for (const groupName of group_names) {
        const groupCheckboxes = Object.values(checklist).filter(obj => obj.group === groupName && obj.grade !== null);
        const one_group = {"name": groupName, "items": groupCheckboxes}
        groups.push(one_group)
    }

    return groups

}

function buildFeedback() {

    const emojis = {5: "✅", 4: "✴️", 3: "❌"}

    const checklistGroups = groupChecklist()

    let feedbackText = ""

    for (const oneGroup of checklistGroups) {
        console.log(oneGroup.items.length)
        if ((oneGroup.name !== undefined) && (oneGroup.items.length !== 0)) {
            feedbackText += `\n<b>${oneGroup.name}: </b>\n`
        } else {
            feedbackText += `\n`
        }

        for (const checklistItem of oneGroup.items) {

            if (checklistItem.grade == null) {
                continue;
            }

            gradeIcon = emojis[checklistItem.grade]
            gradeText = checklistItem[checklistItem.grade]
            reviewPointResult = `${gradeIcon} ${gradeText}`

            feedbackText += `${reviewPointResult}\n`

        }
    }

    return feedbackText

}

