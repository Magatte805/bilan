export const round = (value, nbDecimals) => {
    const multiplier = Math.pow(10, nbDecimals);
    return Math.round(value * multiplier) / multiplier;
}