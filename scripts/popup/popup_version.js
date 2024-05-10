SERVERURL = "https://skypro-reviewer.onrender.com"

async function getVersionFromServer() {

    const url = new URL(SERVERURL+"/version")
    const response = await fetch(url);
    const data = await response.json()
    return data["frontend__min_version"]

}

function versionMatches(currentVersion, minVersion) {

    const client = currentVersion.split('.').map(Number);
    const server = minVersion.split('.').map(Number);

    for (let i = 0; i < client.length; i++) {
        if (client[i] > server[i]) {
            return true;
        } else if (client[i] < server[i]) {
            return false;
        }
    }
    // Версии совпадают
    return true;
}

async function checkVersion(){

    const serverRequiresVersion = await getVersionFromServer()
    const pluginVersion = chrome.runtime.getManifest().version;
    console.log(pluginVersion, serverRequiresVersion)
    const isVersionOk = versionMatches(pluginVersion, serverRequiresVersion)
    if (!isVersionOk) { alert(`Версия ${pluginVersion} устарела, обновись, пожалуйста до ${serverRequiresVersion}`)}
    return true

}