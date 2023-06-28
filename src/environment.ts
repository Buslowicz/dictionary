const { REACT_APP_JSON_URL = `${process.env.PUBLIC_URL}/words_dictionary.json` } = process.env;

if (!REACT_APP_JSON_URL) {
    throw new Error('REACT_APP_JSON_URL is not defined');
}

export const environment = {
    jsonUrl: REACT_APP_JSON_URL,
    storageQueryKey: 'dictionary-app::query',
}
