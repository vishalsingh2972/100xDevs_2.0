# 2.4- Bash Commands


<aside>
💡 Contents:
Starting from the Basic to Advanced Bash commands with their usage.

</aside>

## What is Bash?

- Bash, short for "Bourne Again SHell”.
- Provides a **command-line interface** (CLI) to interact with the operating system.
- is also a scripting language i.e **allows users to write scripts** for automating tasks.

## Bash Commands Overview

1. **`pwd` - Print Working Directory:** Displays the current working directory in the terminal.
    
    ---
    
2. **`cd` - Changes Directory:**
    - **`cd ..`** - Navigates up one level.
    
    ---
    
3. **`ls` - List Files.** Gives some extra customizations:
    - `ls directory name` - Lists files in a specific directory. (**mostly in alphabetical order**)
    - `ls -l` - Display files in long format listing (including: file permissions, owner, group, size, and last modification date).
    - `ls -R` ****- Lists the contents of a directory **recursively**.
    - `ls -r` **-  reverses the order of the listing.**
    - `ls -t` ****- Shows files sorted by timestamp.
    - `ls -la` - Lists contents of current directory in **long format** (`-l`) and show **hidden files** (`-a`).
    - `ls -lr` - Lists contents in **long format** (`-l`) and sort the listing in **reverse order** (`-r`).
    - `ls -s` - Displays only the **sizes of the files** in the current directory.
        
        <aside>
        💡 `|` : This is a **pipe operator** used to **merge two commands.** Sends the **output of the first command** as **input to the second command.**
        
        </aside>
        
    - `ls -lR | grep.json` -
        - **Recursively lists contents of current directory in long format** (`-lR`)
        - **Pipe the output to the `grep` command** to show only entries containing ".json" in their names.
    - `ls *.json` - List only **files with the ".json" extension**
    - `ls Zoo*` - List all files and directories whose names **start with "Zoo".**
    
    ---
    
4. **`mkdir` - Make Directory.** Ex:
    - `mkdir folder_name` ****- Creates a new folder.
    - `mkdir -p "[folder_1]/[folder_2]"`: Creates the directory "[folder_1]/[folder_2]".
    
    ---
    
5. `**touch**` - Create a New File**:** Ex:
    - `touch filename.extension`: Creates an empty file called "filename.extension".
    
    ---
    
6. **`cat` - Print File Contents:**
    - `cat > newfile.txt` - Opens "newfile.txt" for **writing directly from the terminal**.
    - `cat >> newFile.txt` - **Appends text to the end of "newFile.txt"** from the terminal.
    
    ---
    
7. **`vi` - Opens the ‘vi’ Text Editor. Steps:**
    - Enters insert mode with `I` key.
    - To exit:
        - Press `esc` ****to escape from insert mode.
        - `:q!` - • Closes the vi editor **without saving** changes.
        - `:wq!` - **Saves changes and closes** the vi editor.
    
    ---
    
8. **`mv` - Renames or moves** files depending on context. Ex:
    - `mv [initial_name] [changed_name]` **renames** "initial_name" to "changed_name".
    - `mv file1 directory1` **moves** "file1" to "directory1".
    
    ---
    
9. **`cp` - Copy Files.** Eg:
    - `cp file1 file2` copies "file1" to "file2".
    - `cp -r dir1 dir2` copies the entire directory recursively "`dir1`" to "`dir2`".
    
    ---
    
10. **`rm` - Deletes files. Use with caution!** Ex:
    - `rm file1` deletes "file1".
    - `rm -r directory1` deletes the entire directory "directory1" recursively.
    
    ---
    
11. **`chmod` - Changes file permissions:**
    
    <aside>
    💡 **Permissions Types:**
    
    - **r (read)**: Grants permission **to view the contents** of a file or **list the contents** of a directory.
    - **w (write)**: Grants permission to modify the contents of a file or create/delete files within a directory.
    - **x (execute)**: Grants permission to run a file as a program or access special features of a directory.
    
    **Permission Targets:**
    
    - **u (user)**: Applies the permission to the file/directory's **owner**.
    - **g (group)**: Applies the permission to **all members** of the file/directory's group.
    - **o (others)**: Applies the permission to **all users not the owner** or in the group.
    - **a (all)**: Applies the permission to **all users** (equivalent to ugo).
    
    There are **two main ways** to set permissions with `chmod`:
    
    **1. Symbolic Method: uses letters to represent permissions and targets**. 
    For example:
    
    - `chmod u+r filename`: **Grants** **read** permission to the **owner** of "filename".
    - `chmod go-w directory`: **Removes** **write** permission from both the **group and others** for "directory".
    
    **2. Octal Method:** Uses a **3-digit octal number.**
    
    - Each **digit** represents permissions for **user, group, and others**.
    - Digits **0 (no permission)**, **4 (read)**, **2 (write), or 1 (execute)**.
    - For example:
        - `chmod 644 file`: **Grants read and write** permission to the **owner**, **read** permission to the **group and** **others** (equivalent to u=rw,g=r,o=r).
        - `chmod 755 script`: Grants **all [read (4), write(2), execute(1)]** permissions to the **owner**, **read and execute** permission to the **group** and **others** (equivalent to u=rwx,g=rx,o=rx).
    </aside>
    
    <aside>
    💡 1. We can **combine the symbolic and octal methods** in the same command.
    2. Using `=` instead of `+` or `-` **sets the exact permissions** instead of adding or removing them.
    
    </aside>
    
    ---
    
12. **`echo` - Display a Message.**
    - `echo 'Hello World!'`**:** Prints the text "Hello, World!" to the terminal.
    - `echo $PATH`**: prints the value of the $PATH variable**, which gives a **quick overview of where our system looks for programs** when we run them.
    
    ---
    
13. **`head` & `tail` - Display Lines of Files**
    
    <aside>
    💡 `head`: Peeking from the **beginning**, displays **first chunk** of lines (default: 10) in a file.
    `tail`: Looking from the **back**, shows the **last chunk** of lines (default: 10) in a file.
    
    </aside>
    
    *Offers Flexibility:*
    
    - **Specify lines:** `head -n 20 file.txt` shows the **first 20 lines** of "file.txt".
    - **Tail from anywhere:** `tail -n +10 file.txt` shows lines **starting from 10th line.**
    - **Combine them:** `tail -f file.txt` **watches** for **new lines being added** to "file.txt" (like real-time log monitoring).
    - Some examples:
        - `head -20 newfile.txt` - Shows the first 20 lines.
        - `tail -n +25 newfile.txt | head -5` - Shows first **5 lines of the last 25 lines** in "newfile.txt".
    
    ---
    
14. **`wc` -** Counts lines, words, and characters in files. Ex:
    - `wc newfile.txt` shows the number of lines, words, and characters in "newfile.txt".
    
    ---
    
15. **`grep` -** Searches text for patterns. Offers many customizations:
    - `grep "error" log.txt`: Finds **lines containing "error"** in "log.txt".
    - `grep -c "[phrase]" [filename]`: **Counts the number of lines** containing the phrase in the file.
    - `grep -h "[phrase]" [filename]`: Matches and **shows all occurrences of the pattern** (suppresses file name header).
    - `grep -hir "[phrase]" [foldername]`: Searches **recursively in current directory** and **subdirectories**.
    - `grep -hinw "[phrase]" [filename]`: Matches **only exact whole words**.
    - `grep -o "[phrase]" [filename]`: Shows **only the matched parts, not the entire line**.
    - `grep -w "[phrase]" [filename]`: Matches **only whole words**, **not parts of words**.
    - `grep -v "[phrase]" [filename]`: Shows lines that **don't** contain the pattern.
    - `grep -A/B/C 5 "[phrase]" [filename]`: Prints 5 lines after (A), before (B), or both containing the “phrase” (C).
    
    ---
    
16. **`history` -** Shows a **list of previously entered commands**.
    
    ---
    
17. **Automating with Script -** Using an example **`newscript.sh`:**
    
    ```bash
    bashCopy code
    #!/bin/bash
    echo 'Hello World!'
    mkdir automated_dir
    cd automated_dir2 && touch newscript_file.txt
    ```
    
    <aside>
    💡 **In Detail:**
    
    **Script Header:**
    
    - `bashCopy`: Script name, usually reflects its purpose.
    - `#!/bin/bash`: Interpreter declaration, s**pecifies Bash as the script execution engine.**
    
    ---
    
    **Your Tasks:**
    
    *Echo Command:*
    
    - `echo 'Hello World!'`: Prints "Hello World!" to the terminal.
    
    *Making Directory:*
    
    - `mkdir automated_dir`: Creates a directory named "automated_dir" in the current working directory.
    
    *Changing Directory:*
    
    - `cd automated_dir2 && touch newscript_file.txt`: Combines two commands separated by `&&`.
        - `cd automated_dir2`: Attempts to change to the directory "automated_dir2".
        - `touch newscript_file.txt`: Creates a file named "newscript_file.txt" only if the previous `cd` command succeeds.
    
    ---
    
    **Running the script using** **`bash newscript.sh`**.
    
    ---
    
    **Complex Examples Include:**
    
    - Downloading files, copying specific folders, renaming multiple files, running programs with arguments.
    </aside>
    
    ---
    
18. **`clear` -** Clears the Terminal.

## **Advanced Commands:**

### `sed` - Stream Editor: used for manipulating text files

**General Syntax**: `sed [OPTIONS] script file`

- `[OPTIONS]`: Optional flags like `i` for in-place editing or `n` for non-printing mode.
- `script`: The editing instructions separated by spaces.
- `file`: The file to be processed.

**Example Usages:**

- **Simple replacement (s/old/new/)**
    
    `sed ’s/ERROR/CRITICAL/‘ log.txt`: Replaces all occurrences of "ERROR" with "CRITICAL" in "log.txt".
    
    - `’`: Single quotes delimits the script to avoid interpreting special characters.
    - `s`: Substitute command.
    - `/`: Separates the pattern to find “ERROR” and the replacement “CRITICAL”.
    
    ---
    
- **In-place editing (-i)**
    
    `sed -ibackup ’s/ERROR/CRITCAL/‘ log.txt`: Edits "log.txt" directly with backup (".txt~").
    
    - `i`: Edits the file **in-place**.
    - `backup`: Optional suffix appended to the original file **for backup**.
    
    ---
    
- **Editing specific lines (line numbers)**
    
    `sed ‘3 s/ERROR/CRITICAL/‘ log.txt`: Replaces "ERROR" with "CRITICAL" **only on line 3** of "log.txt".
    
    - Number before `s` specifies the line to edit.
    
    ---
    
- **Editing a range of lines**
    
    `sed ‘3,5 s/CRITICAL/VERYCRITICAL/‘ log.txt`: Replaces "CRITICAL" with "VERYCRITICAL" from **lines 3 to 5 (inclusive)** in "log.txt".
    
    - Numbers separated by `,` define the line range.
    
    ---
    
- **Printing specific lines (-n)**
    
    `sed -n ‘3, /ERROR/ p’ log.txt`: Prints **only lines 3 to the next occurrence** of "ERROR" (inclusive) in "log.txt".
    
    - `n`: Suppresses default printing of each line i.e only print lines that **explicitly match the provided conditions.**
    - `/pattern/`: Prints lines containing the pattern (ERROR) within the specified range.
    - `p`: Tells `sed` **to print** the matching lines.

---

### **`awk` - Text Processing:** for powerful data manipulation and analysis

**Few** **Example Usages:**

- `awk ‘/CRITCAL/{print $0}’ log.txt`**: extracts and prints** **only lines containing** "CRITCAL" from the log file.
    - First, searches the "log.txt" file for lines containing "CRITCAL".
    - The  `print $0` instruction tells `awk` to print the entire line that matches the pattern.
    
    ---
    
- `awk ‘{gsub(/CRITICAL/, ‘ERROR’)}{print}’ log.txt`**: changes "CRITICAL" to "ERROR"** throughout the **entire** log file.
    - `gsub` function globally replaces all occurrences of "CRITICAL" with "ERROR" in each line of the file.
    - `print` instruction then prints the modified lines.
    
    ---
    
- `awk ‘BEGIN {print “HEADER”} END {print “FOOTER\nEND”} log.txt`**: adds** **custom** **pre- and post-processing messages** to the file.
    - `BEGIN` and `END` blocks **prints** custom text **before and after** **processing** the file.
    - `BEGIN {print “HEADER”}` : Prints “HEADER” before reading the file.
    - `END {print “FOOTER\nEND”}` : Prints “FOOTER” and "END" with a newline after processing the entire file.
    
    ---
    
- `awk ‘{print $1 $2}’ log.txt`**: prints the first two fields** (separated by whitespace) from **each line** of the file.
    - `$1` refers to the **first field**, and `$2` refers to the **second field**.
    - Useful for extracting specific information like **timestamps or usernames** from log entries.
    
    ---
    
- `awk -F “,” ‘{print $1 $2}’ log.txt` **- changes the delimeter:**
    - Changes the field separator **from whitespace to comma** (",") for the following `awk` script.
    - The `F` option with the "," `value` instructs `awk` to **use commas** **as the delimiter** for splitting each line **instead of whitespace**.
    - Useful when working with **comma-separated** value (CSV) files.
    
    ---
    
- `awk ‘{count[$2]++}’ END {print count[“ERROR”]} log.txt`**: counts occurrences of specific values** **in the second field** of each line.
    - `count[$2]++`: **Increments the counter** for the **value in the second field** for each line.
    - `END {print count[“ERROR”]}`: **After processing** the file, **prints** the **counter value** for the specific field **"ERROR"**.
    - Helps **count occurrences of a keyword** in a **specific column** of the file.
    
    ---
    
- `awk ‘{if ($1 > 124124) {print $0} }’ log.txt`**:** Will extract only lines **where the first field value** is **greater than the specified threshold**.
    - `$1 > 124124`: Checks **if the first field** (numeric) is **greater than 124124**.
    - `{print $0}`: If the **condition is true**, **prints the entire line**.
    - Helps **filter lines** based on a **conditional statement**.

## **Node.js Essentials:**

### **External Libraries**

- pre-written **modules offering functionalities** for various purposes.
- published on repositories like the **npm registry**.
- `npm install <library-name>`: **adds the library and its dependencies** to your project.
- `package.json`: acts as a manifest. **keeps track of all the libraries** your application relies on.

### **Commanding Node.js:**

- `node <script>`  Run Node.js scripts from the command line.
- Beyond script execution, Node.js also offers various commands for managing libraries and project environments. These include:
    - `npm` commands like `install`, `uninstall`, and `update` for package management.
    - Other utilities like `npm run` for executing custom scripts defined in the `package.json`.
