// User agent sniffing for mobile behavior
// We just use this to decide what stream endpoint to load
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
