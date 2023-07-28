export const getTimeDiffInMinutes = ({ date }) => {
    const now = new Date();
    const endDate = new Date(date);
    const diffInMilliseconds = Math.abs(endDate - now);
    return Math.floor(diffInMilliseconds / 1000 / 60);
};
