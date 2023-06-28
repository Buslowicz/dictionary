class RadixTrieNode {
    constructor(
        public word: string | null = null,
        public readonly children: Record<string, RadixTrieNode> = {},
    ) {
    }
}

export class RadixTree {
    #root = new RadixTrieNode();
    #plainSet = new Set<string>();

    public get size(): number {
        return this.#plainSet.size;
    }

    constructor(words: string[] | Set<string> = []) {
        words.forEach((word) => this.add(word));
    }

    public add(word: string): void {
        this.#plainSet.add(word);
        this.#addNode(this.#root, word);
    }

    public filter(prefix: string): string[] {
        if (prefix === '') {
            return [...this.#plainSet];
        }
        const nodes = this.#findNodeWithPrefix(this.#root, prefix);
        if (nodes.length === 0) {
            return [];
        }
        return nodes.flatMap((node) => this.#collectWords(node));
    }

    public getTreeClone(): RadixTrieNode {
        function getTreeClone(node: RadixTrieNode): RadixTrieNode {
            const children: Record<string, RadixTrieNode> = {};
            for (let key in node.children) {
                children[key] = getTreeClone(node.children[key]);
            }
            return new RadixTrieNode(node.word, children);
        }
        return getTreeClone(this.#root);
    }

    #addNode(node: RadixTrieNode, word: string, ending = word): void {
        for (let key in node.children) {
            if (ending.charAt(0) !== key.charAt(0)) {
                continue;
            }
            if (ending === key) {
                node.children[key].word = word;
                return;
            }
            let i = 0;
            while (ending[i] === key[i]) {
                i++;
            }
            const prefix = ending.slice(0, i);
            if (!node.children[prefix]) {
                this.#splitBranch(node, key, i);
            }
            this.#addNode(node.children[prefix], word, ending.slice(i));
            return;
        }
        node.children[ending] = {word, children: {}};
    }

    #splitBranch(node: RadixTrieNode, key: string, i: number): void {
        const child = node.children[key];
        delete node.children[key];
        node.children[key.slice(0, i)] = {
            word: null,
            children: {[key.slice(i)]: child}
        };
    }

    #findNodeWithPrefix(node: RadixTrieNode, prefix: string): RadixTrieNode[] {
        const nodes: RadixTrieNode[] = [];
        for (let key in node.children) {
            if (new RegExp(`^${prefix.replaceAll('*', '.')}`).test(key)) {
                nodes.push(node.children[key]);
                continue;
            }
            if (new RegExp(`^${prefix.slice(0, key.length).replaceAll('*', '.')}`).test(key)) {
                nodes.push(...this.#findNodeWithPrefix(node.children[key], prefix.slice(key.length)));
            }
        }
        return nodes;
    }

    #collectWords(node: RadixTrieNode, words: string[] = []): string[] {
        if (node.word !== null) {
            words.push(node.word);
        }
        for (let key in node.children) {
            this.#collectWords(node.children[key], words);
        }
        return words;
    }
}
