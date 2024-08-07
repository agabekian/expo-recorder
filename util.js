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
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and pad with zero if needed
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
    const hours = date.getHours().toString().padStart(2, '0'); // Get hours and pad with zero if needed
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with zero if needed
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Get seconds and pad with zero if needed

    return `${month}.${day}.${year} ${hours}:${minutes}`;
};

