export const SelectTextInElement = (element: HTMLElement) => {
  const range = document.createRange();
  range.selectNode(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
}
