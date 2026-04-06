import os
import re

def fix_shadow_commas(content):
    # Regex to find shadow-[...]
    # It matches shadow-[ followed by anything that isn't ]
    pattern = r'shadow-\[([^\]]+)\]'
    
    def replace_shadow(match):
        shadow_val = match.group(1)
        # Find rgb(...) or rgba(...) inside the shadow value
        color_pattern = r'(rgba?)\(([^)]+)\)'
        
        def replace_color(color_match):
            func_name = color_match.group(1)
            args_str = color_match.group(2)
            # Split by comma or space
            args = [a.strip() for a in re.split(r'[,\s]+', args_str) if a.strip()]
            
            if len(args) == 4:
                # r, g, b, a -> r_g_b_/_a
                return f"{func_name}({args[0]}_{args[1]}_{args[2]}_/_{args[3]})"
            elif len(args) == 3:
                # r, g, b -> r_g_b
                return f"{func_name}({args[0]}_{args[1]}_{args[2]})"
            return color_match.group(0) # No change if unexpected args
            
        new_shadow_val = re.sub(color_pattern, replace_color, shadow_val)
        return f'shadow-[{new_shadow_val}]'

    return re.sub(pattern, replace_shadow, content)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for file in files:
            if file.endswith(('.jsx', '.js', '.css')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = fix_shadow_commas(content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")

if __name__ == "__main__":
    process_directory(r'c:\Users\Admin\Desktop\collab\GoAirClass\bus booking pages today\frontend\src')
