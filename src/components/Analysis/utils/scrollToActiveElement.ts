import { MutableRefObject } from 'react';

/**
 * Adjusts container scroll position based on active element offset
 * @param activeElementRef - current active element in container
 * @param scrollContainerRef - reference to scroll container
 *
 * @return void
 *
 */
export const scrollToActiveElement = (
  activeElementRef: MutableRefObject<HTMLLIElement>,
  scrollContainerRef: MutableRefObject<HTMLElement>
) => {
  const { current: activeElement } = activeElementRef;
  const { current: scrollContainer } = scrollContainerRef;

  if (activeElement && scrollContainer) {
    const activeElementTop = activeElement.offsetTop;

    const bottomOverflow = activeElementTop > scrollContainer.offsetHeight;

    if (bottomOverflow) {
      scrollContainer.scrollTop = activeElementTop + activeElement.offsetHeight;
      return;
    }

    const topOverflow = scrollContainer.scrollTop > activeElementTop;

    if (topOverflow) {
      scrollContainer.scrollTop = activeElement.offsetTop;
    }
  }
};
