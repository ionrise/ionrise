var meta = document.querySelector('meta[name="Ionrise One"]');
    if (meta) {
        meta.setAttribute('content', 'This is the official page of Ionrise. We´re launching soon!');
    } else {
    meta = document.createElement('meta');
    meta.name = 'Ionrise One';
    meta.content = 'This is the official page of Ionrise. We´re launching soon!';
    document.getElementsByTagName('head')[0].appendChild(meta);
}