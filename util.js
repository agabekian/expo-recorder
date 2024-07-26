// export const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
//     return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
// };
export const formatFullDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};
// Other utility functions if any
