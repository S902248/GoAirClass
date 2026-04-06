const fs = require('fs');
const path = require('path');

function fixShadowCommas(content) {
    // Regex for shadow-[...]
    const pattern = /shadow-\[([^\]]+)\]/g;
    
    return content.replace(pattern, (match, shadowVal) => {
        // Regex for rgb(...) or rgba(...)
        const colorPattern = /(rgba?)\(([^)]+)\)/g;
        
        const newShadowVal = shadowVal.replace(colorPattern, (colorMatch, funcName, argsStr) => {
            const args = argsStr.split(/[,\s]+/).map(a => a.trim()).filter(a => a);
            
            if (args.length === 4) {
                // r, g, b, a -> r_g_b/_a
                return `${funcName}(${args[0]}_${args[1]}_${args[2]}_/_${args[3]})`;
            } else if (args.length === 3) {
                // r, g, b -> r_g_b
                return `${funcName}(${args[0]}_${args[1]}_${args[2]})`;
            }
            return colorMatch;
        });
        
        return `shadow-[${newShadowVal}]`;
    });
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            if (file !== 'node_modules') {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = fixShadowCommas(content);
            
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Fixed: ${fullPath}`);
            }
        }
    });
}

const targetDir = path.resolve('c:/Users/Admin/Desktop/collab/GoAirClass/bus booking pages today/frontend/src');
processDirectory(targetDir);
