
let colors = [
    'rgb(42,127,255)',
    'rgb(153,85,255)',
    'rgb(255,238,87)',
    'rgb(255,255,255)',
    'rgb(0,0,0)',
    'rgb(154,3,61)',
    'rgb(0,238,161)',
    'rgb(255,122,188)',
    'rgb(230,66,79)',
]

const ColorManager = {
    getColors: function () {
        return colors
    },
    getRandomColor: () => {
        return colors[Math.floor(Math.random() * colors.length)]
    },
    getHex: function (color) {
        return color.substr(4, color.length - 5)
            .split(',')
            .map(s => { return Number(s) })
            .reduce((s, c) => {
                let nc = c.toString(16)
                if (nc === '0') {
                    nc = '00'
                }
                return s + nc
            }, '0x')
    }
}
export default ColorManager