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
            // var selection = [
            //     'module sdram_read #(',
            //     'parameter a = 5,',
            //     'parameter b = 8\'hzz ',
            //     ') (',
            //     'input clock,',
            //
            //     'input enable,',
            //     '// output logic finFlag = 0',
            //     '// input preStop,',
            //
            //     'output logic[15:0] data[3:0],',
            //     'input [12:0] rowAddr,testaddr',
            //     '// output logic finFlag = 0',
            //     ',aaaa,',
            //     '//test',
            //     'bbbbb',
            //     'input [7:0][2:0] colAddr,',
            //     'inout [1:0] BA,',
            //
            //     'output readDataClk,',
            //     'testadddd,',
            //
            //     'output logic testttttttt,',
            //
            //     'SDRAM.sdram sdram',
            //
            //     ');'
            // ].join('\n')
            var modules = selection.match(/module\s+(\w+)(?:\s*#\s*\(([\s\S]+?)\))?\s*\(([\s\S]+?)\);/);
            if (modules.length == 4) {
                var moduleName = modules[1]
                var moduleParameter = modules[2]
                if (moduleParameter == undefined) {
                    // no parameter
                    var moduleInitText = moduleName + ' ' + moduleName + '_inst' + ' (' + '\n\t'
                } else {
                    // have parameter
                    var moduleInitText = moduleName + ' ' + moduleName + '_inst' + ' #(' + '\n\t'
                    moduleParameter.match(/(\w+)\s*=\s*([\w']+)/g).forEach((v, i) => {
                        var vm = v.match(/(\w+)\s*=\s*([\w']+)/);
                        var connector = (i === 0) ? "" : ",\n\t"
                        moduleInitText = moduleInitText.concat([connector, ".", vm[1], "(", vm[2], ")"].join(''))
                    })
                    moduleInitText = moduleInitText.concat("\n) (\n\t")
                }

                // generator body
                var moduleBody = modules[3]
                //emmm,I think a long time,but I can't find a regex can match systemverilog well,so this is a temp version,I will make it better later.
                moduleBody.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g)
                moduleBody.match(/(input|output|inout|\w+\.\w+)(?:\s+(logic|wire|reg)?)(\[[\d:\[\]]+\])?(?:\s*(\w+)(?:\s*=\s*[\d'bhdoxz]+)?)/g).forEach((v, i) => {
                    var connector = (i === 0) ? "" : ",\n\t"
                    var vm = v.match(/(input|output|inout|\w+\.\w+)(?:\s+(logic|wire|reg)?)(\[[\d:\[\]]+\])?(?:\s*(\w+)(?:\s*=\s*[\d'bhdoxz]+)?)/);
                    moduleInitText = moduleInitText.concat([connector, '.', vm[4], '(', vm[4], '_wire', ')'].join(''))
                })
                // moduleInitText.concat('\n);')
                //finish
                moduleInitText = moduleInitText.concat('\n);')
                console.log(moduleInitText)
                editor.insertText(moduleInitText)
            }
        }
    }
}