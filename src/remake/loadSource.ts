import axios from 'axios';

type TSource = {
    ageJson: string;
    eventJson: string;
    talentJson: string;
}
type TProgress = {
    age: number,
    event: number,
    talent: number,
}

export function loadSource({ ageJson, eventJson, talentJson }: TSource, onDownloadProgress: (progressEvent: TProgress) => void) {
    const progress: TProgress = {
        age: 0,
        event: 0,
        talent: 0,
    }
    let hasDone = false;
    const onProgress = (eventKey: keyof TProgress, currProgress: number) => {
        if (hasDone) {
            return;
        }
        progress[eventKey] = currProgress;
        onDownloadProgress(progress);
    }
    return Promise.all([
        createLoadItem(ageJson, 'age', onProgress),
        createLoadItem(eventJson, 'event', onProgress),
        createLoadItem(talentJson, 'talent', onProgress),
    ]).finally(() => {
        hasDone = true;
    });
}

function createLoadItem(url: string, eventKey: keyof TProgress, onProgress: (eventKey: keyof TProgress, currProgress: number) => void) {
    return axios({
        url,
        responseType: 'json',
        onDownloadProgress: (event) => {
            const percent = Number((event.loaded / event.total).toFixed(2)) * 100;
            onProgress(eventKey, percent);
        }
    });
}