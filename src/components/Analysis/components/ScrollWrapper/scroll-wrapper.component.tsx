import React, { useEffect, useState, forwardRef } from 'react';

import { Wrapper } from './scroll-wrapper.styles';

type Props = {
  /** React children nodes */
  children: React.ReactNode;
};

export const ScrollWrapper = forwardRef(
  ({ children }: Props, wrapperRef: React.MutableRefObject<HTMLDivElement>) => {
    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
      const { offsetHeight } = document.body;
      const { scrollY, innerHeight } = window;
      const { top, height } =
        wrapperRef.current && wrapperRef.current.getBoundingClientRect();
      const topPosition = top + scrollY;
      const fullHeight =
        offsetHeight > innerHeight ? offsetHeight : innerHeight;
      if (height > fullHeight - topPosition)
        setMaxHeight(fullHeight - topPosition);
    }, [wrapperRef]);

    return (
      <Wrapper ref={wrapperRef} maxHeight={maxHeight}>
        {children}
      </Wrapper>
    );
  }
);

ScrollWrapper.displayName = 'ScrollWrapper';

export default ScrollWrapper;
