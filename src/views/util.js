/* eslint-disable */
export default function getLabelsAndData(res) {
    const labels = [],
        data = [];

    for (const key in res.data[0]) {
        if (res.data[0].hasOwnProperty(key)) {
            labels.push(key);
            data.push(res.data[0][key]);
        }
    }

    return { labels, data };
}