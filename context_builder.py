import os

# Files you want to ignore (add more as needed)
IGNORE_DIRS = {'.git', 'node_modules', '__pycache__', 'venv', 'env', '.next', '.idea', '.vscode', 'build', 'dist'}
# File extensions to include
INCLUDE_EXTS = {'.py', '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.md', '.sql'}

def merge_files(output_file='project_context.txt'):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Walk the current directory
        for root, dirs, files in os.walk("."):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in INCLUDE_EXTS:
                    file_path = os.path.join(root, file)
                    
                    try:
                        outfile.write(f"\n{'='*20}\n")
                        outfile.write(f"FILE PATH: {file_path}\n")
                        outfile.write(f"{'='*20}\n\n")
                        
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                            
                        outfile.write("\n")
                    except Exception as e:
                        outfile.write(f"Could not read {file_path}: {e}\n")

    print(f"Done! Upload '{output_file}' to the chat.")

if __name__ == "__main__":
    merge_files()