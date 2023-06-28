import throttle from 'lodash.throttle';
import {useEffect, useMemo, useRef, useState} from 'react';
import {environment} from '../environment';
import {RadixTree} from '../utils/RadixTree';
import {useStreamJSON} from '../utils/UseStreamJSON';

export function useDictionaryService() {
    const {partial, loading} = useStreamJSON(environment.jsonUrl);
    const words = useRef(new RadixTree());
    const [query, setQuery] = useState(localStorage.getItem(environment.storageQueryKey) ?? '');
    const [items, setItems] = useState<string[]>([]);
    const [search, setSearch] = useState(query);

    const throttledSearch = useMemo(() => throttle(setSearch, 300, {leading: true, trailing: true}), []);

    useEffect(() => throttledSearch(query), [query, throttledSearch]);

    useEffect(() => partial.forEach((value) => words.current.add(value)), [partial]);

    useEffect(() => setItems(words.current.filter(search)), [search, partial]);

    useEffect(() => localStorage.setItem(environment.storageQueryKey, query), [query]);

    return {loading, query, setQuery, items};
}
