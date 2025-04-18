export default function secondsToHHMMSS(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
      throw new Error('Input must be a non-negative number');
    }
  
    const roundedSeconds = Math.floor(seconds);
  
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const secs = roundedSeconds % 60;
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }