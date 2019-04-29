export function debounce (functionReference, duration, onStart) {
  let timeout;

  return function debouncedFunction () {
    const args = arguments;

    const onResume = () => {
      timeout = null;

      if (!onStart) {
        functionReference(...args);
      }
    };

    const callFunction = onStart && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(onResume, duration);

    if (callFunction) {
      functionReference(...args);
    }
  };
}

export const contants = {
  MAX_OCEAN_COUNT: 9,
  MAX_OXYGEN_LEVEL: 14,
  MAX_TEMPERATURE: 8
};