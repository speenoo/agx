export function getTextWidth(text: string) {
	let width = 0;
	const div = document.createElement('div');
	div.innerText = text;
	div.style.position = 'absolute';
	div.style.float = 'left';
	div.style.whiteSpace = 'nowrap';
	div.style.visibility = 'hidden';
	document.body.appendChild(div);
	width = div.clientWidth;
	div.remove();

	return width;
}
