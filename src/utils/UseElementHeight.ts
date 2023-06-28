import {useEffect, useState} from 'react';

export function useElementHeight(wrapperRef: HTMLDivElement | null) {
    const [wrapperHeight, setWrapperHeight] = useState(0);

    useEffect(registerResizeObserver, [wrapperRef]);

    return wrapperHeight;

    function registerResizeObserver() {
        if (!wrapperRef) {
            return;
        }
        const resizeObserver = new ResizeObserver((event) => {
            event.slice(-1).forEach((entry) => entry.contentRect.height && setWrapperHeight(entry.contentRect.height));
        });
        resizeObserver.observe(wrapperRef);
        return () => resizeObserver.disconnect();
    }

}
