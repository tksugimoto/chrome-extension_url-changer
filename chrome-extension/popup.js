/**
 * @param {function(URL): string} alterUrl
 */
const changeUrl = alterUrl => {
	chrome.tabs.query({
		currentWindow: true,
		active: true,
	}, ([currentTab]) => {
		chrome.scripting.executeScript({
			target: {
				tabId: currentTab.id,
			},
			func: (url) => {
				history.pushState('', document.title, url);
			},
			args: [
				alterUrl(new URL(currentTab.url)),
			],
		});
	});
};

const container = document.createElement('ul');
document.body.append(container);

const list = [{
	name: 'Hash削除',
	accessKey: 'h',
	/** @param {URL} url */
	alterUrl: (url) => {
		return `${url.pathname}${url.search}`;
	},
}, {
	name: 'Query削除',
	accessKey: 'q',
	/** @param {URL} url */
	alterUrl: (url) => {
		return `${url.pathname}${url.hash}`;
	},
}];

list.forEach(obj => {
	const button = document.createElement('button');
	button.innerText = obj.name;
	if (obj.accessKey) {
		button.innerText += ` (${obj.accessKey})`;
		button.accessKey = obj.accessKey;
	}
	button.addEventListener('click', () => {
		changeUrl(obj.alterUrl);
	});

	const li = document.createElement('li');
	li.append(button);
	container.append(li);
});
