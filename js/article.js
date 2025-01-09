document.addEventListener('scroll', () => {
    const docElement = document.documentElement;
    const scrollPercent = (docElement.scrollTop) / (docElement.scrollHeight - docElement.clientHeight);
    docElement.style.setProperty('--scroll-percent', scrollPercent);
}); 