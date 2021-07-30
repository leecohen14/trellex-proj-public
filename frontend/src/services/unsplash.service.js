import axios from 'axios'

export const unsplashService = {
    searchPhotos,
}

async function searchPhotos(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=-NHn9iG9hLD-1VuRZcjw1Urvz6tYqZvdWZOIquw_ffo`
    const res = await axios.get(url)
    let { results } = res.data

    results = results.map((result, idx) => {
        return {
            idx,
            id: result.id,
            fullImgUrl: result.urls.full,
            minImgUrl: result.urls.small,
        }
    })
    return results
}
