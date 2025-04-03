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
	/** @param {URL} url */
	alterUrl: (url) => {
		return `${url.pathname}${url.search}`;
	},
}, {
	name: 'Query削除',
	/** @param {URL} url */
	alterUrl: (url) => {
		return `${url.pathname}${url.hash}`;
	},
}];

list.forEach(obj => {
	const button = document.createElement('button');
	button.innerText = obj.name;
	button.addEventListener('click', () => {
		changeUrl(obj.alterUrl);
	});

	const li = document.createElement('li');
	li.append(button);
	container.append(li);
});
