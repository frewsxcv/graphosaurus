({
    baseUrl: '../',
    name: 'build/almond/almond',
    include: ['src/graphosaurus'],
    out: '../dist/graphosaurus.min.js',
    wrap: {
        startFile: 'start.frag.js',
        endFile: 'end.frag.js'
    }
})
