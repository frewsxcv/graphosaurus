({
    baseUrl: '../',
    name: 'build/almond/almond',
    include: ['src/graphosaurus'],
    out: '../dist/graphosaurus.min.js',
    preserveLicenseComments: false,
    wrap: {
        startFile: 'start.frag.js',
        endFile: 'end.frag.js'
    }
})
