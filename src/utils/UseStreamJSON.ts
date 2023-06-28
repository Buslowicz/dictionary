import {useEffect, useMemo, useRef, useState} from 'react';

export function useStreamJSON(url: string) {
    const [data, setData] = useState(new Set<string>());
    const [partial, setPartial] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const pointer = useRef(0);
    const xhr = useMemo(() => new XMLHttpRequest(), []);

    useEffect(handleXHRErrors, [xhr, loading]);
    useEffect(handleProgressUpdates, [xhr, loading]);
    useEffect(handleLoadingComplete, [xhr]);
    useEffect(initialiseRequest, [xhr, url]);

    return {data, loading, error, partial} as const;

    function handleXHRErrors() {
        function errorListener() {
            setError(new Error(xhr.statusText));
        }

        if (!loading) {
            return;
        }

        xhr.addEventListener('error', errorListener);
        return () => xhr.removeEventListener('error', errorListener);
    }

    function handleProgressUpdates() {
        function progressListener() {
            const lastPointer = pointer.current;
            const trimmed = xhr.responseText.trimEnd();
            const eof = trimmed.endsWith('}');
            const currentPointer = trimmed.lastIndexOf(',');

            const chunk = lastPointer === currentPointer || eof ? xhr.responseText.slice(lastPointer + 1) : xhr.responseText.slice(lastPointer + 1, currentPointer);
            setData((set) => {
                const match = [...chunk.matchAll(/"([^"]+)":/g)].map(([, value]) => value);
                setPartial(match);
                match.forEach((value) => set.add(value));
                return new Set(set);
            });

            pointer.current = currentPointer;
        }

        if (!loading) {
            return;
        }
        xhr.addEventListener('progress', progressListener);
        return () => xhr.removeEventListener('progress', progressListener);
    }

    function handleLoadingComplete() {
        function loadListener() {
            setLoading(false);
            setPartial([]);
        }

        xhr.addEventListener('load', loadListener, {once: true});
        return () => xhr.removeEventListener('load', loadListener);
    }

    function initialiseRequest() {
        setPartial([]);
        setData(new Set<string>());
        setLoading(true);
        pointer.current = 0;
        xhr.open('GET', url);
        xhr.send();
    }

}
