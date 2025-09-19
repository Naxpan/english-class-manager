export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
};

export const handleError = (error) => {
    console.error(error);
    return { message: 'An error occurred', error: error.message };
};