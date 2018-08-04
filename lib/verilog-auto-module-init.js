const {
    CompositeDisposable
} = require('atom')

module.exports = {
    subscriptions: null,

    activate() {
        this.subscriptions = new CompositeDisposable()
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'verilog-module:convert': () => this.convert()
        }))
    },

    deactivate() {
        this.subscriptions.dispose()
    },

    convert() {
        const editor = atom.workspace.getActiveTextEditor()
        if (editor) {
            const selection = editor.getSelectedText()
            // var selection = ['module uart_send (',
            //     '//clock',
            //     'input  clk,',
            //     '//in data',
            //     'input trig,',
            //     'input [7:0] data,',
            //     '//out data',
            //     'output reg busy = 0,',
            //     '   output reg tx = 1',
            //     ');'
            // ].join('\n')
            var modules = selection.match(/module\s+(\w+)\s*\(([\s\S]*?)\);/);
            if (modules.length == 3) {
                var moduleName = modules[1]
                var moduleBody = modules[2]
                var moduleVals = moduleBody
                    .replace(/(?:out|in)put\s*(?:reg\s*)?(?:\[.*?\]\s*)?(\w+)/g, '$1') // remove in/output reg []
                    .replace(/(?:\/\/[^\n]+)/g, '') // remove comment
                    .replace(/=(?:\s*?)(?:[\d'bdho_]+)/g, '') // remove assign
                    .match(/\w+/g); //match val
                var moduleInitText = moduleName + ' ' + moduleName + '_inst' + ' (' + '\n'
                for (moduleValIndex in moduleVals) {
                    // if (moduleVals[moduleValIndex] != 'undefined')
                    var moduleVal = moduleVals[moduleValIndex]
                    console.log(moduleVal)
                    if (moduleValIndex != 0) {
                        moduleInitText = moduleInitText.concat(',\n')
                    }
                    moduleInitText = moduleInitText.concat('.', moduleVal, '(', moduleVal, ')')
                }
                moduleInitText = moduleInitText.concat('\n);')
                editor.insertText(moduleInitText)
            }
        }
    }
}