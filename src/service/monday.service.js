
const getDataAPI = async (access_token, query, url) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${access_token}`,
            },
            body: JSON.stringify({ query })
        };
        const response = await fetch(url, options);
        const result = await response.json();
        return result

    } catch (e) {
        console.log('error en getDataAPI ', e);
    }

}

module.exports = {getDataAPI}