- To use the wsl(windows subsystem linux) this will give access to linux shell in windows
- Terminal is nothing but another interface to do things on your machine

1. pwd: print working directory
2. cd: change directory
    - Eg: cd ..
       cd ../.. takes you to two folders back
3. ls
    - If it is a directory permissions column start with d
    - `ls -l directory_name` list the contents
    - `ls -R directory_name` list's the sub contents as well
    - `ls -t directory_name` list's the last modified file first
    - You can also combine the above flags together
        - Eg. `ls-lt`
    - `ls -lr` (long form reverse order)will list the files in reverse order
    - `ls -s` will list the files according to size
    - `ls *.js` : list all the js files
4. mkdir
    - mkdir test && cd test (combine two commands using &&)
    - `mkdir -p frontend/scripts` (to create the directories recursively)
5. touch: Let's you create an empty file
6. cat (concatenate): Let's you see what is inside a file
    - `cat > new_file.txt`
    - ctrl + D: to save the file.
    - `cat >> old_file.txt` : append to existing file
7. vi: Let's you edit your files
    - Eg: vi a.txt
    - Press i to go in insert mode in vim
    - :q!: This will exit from vim
8. mv
    - You can also use this command to rename a file. Eg. `mv old_name.js new_name.js`
9. cp 
    - `cp -r from to`
10. nvm: node version manager
11. npm
12. node
13. git
14. grep
15. clear
16. rm: remove a file or directory
17. chmod: ugo+ or -
    - `chmod u+x file.sh` (This will give user the execute permission)
    - `chmod g+wx file.sh` (This will give group the write and execute permission)
    - `chmod 664 my_file.js`
    - `chmod 777 index.js` (This file will have all the permissions.)
18. echo: Let's you print something in terminal
19. head: Let's you print the first ten lines from file.
    - `head -20 file_name.txt` (print first 20 lines)
20. tail: Let's you print the last ten rows from file.
21. | operator : Whatever output from one command will be used as input for the next command.
    - `tail -n +25 new_file.txt | head -4 new_file.txt`(This will give you 4 lines from 25th line)
22. wc: word count
    - This will give you the line, word, characters count
23. grep: It is a command that let's you find the occurrences of certain word, phrases, regex or any particular expression within a set of files or directory.
    - `grep -c "one" my_file.txt` (This will tell the occurrence of one in the file)
    - `grep -h "one" my_file.txt` (This will print the lines where this expression will be matched)
    - `grep -hi "one" my_file.txt` (This will print all the expression match (ignores case))
    - `grep -hir "one"` (This will match the expression in current directory)
    - `grep -hin "one" my_file.txt` (This will also print line no, more verbose output)
    - `grep -hirw "one"` (matches the whole word, rather than its occurrence in between text)
    - `grep -o "one" my_file.txt` (Prints only the matching part)
    - `grep -w "one" my_file.txt` (Prints matched expression)
24. history: will give you list of all the commands that you used
25. Advanced commands for text processing:
    - Few more with grep
        - `grep "ERROR" log.txt`
        - `grep -v "INFO" log.txt` (This will print everything other than the INFO)
        - `grep -A 5 ERROR log.txt` (This will print 5 lines after the first occurrence of expression)
        - `grep -B 5 ERROR log.txt` (This will print 5 lines before the first occurrence of expression)
        - `grep -C 5 ERROR log.txt` (This will print 5 lines before and after the first occurrence of expression)
    - sed command
        - `sed -n '/ERROR/ p' log.txt` (p means wherever you have found the match print it, with -n we have restricted that thing, it will not print everything)
        - `sed 's/ERROR/CRITICAL/' log.txt` (This will replace all the occurrences of ERROR with CRITICAL)
        - `sed -ibackup 's/ERROR/CRITICAL/' log.txt` (This will create a backup file for us and will modify the file)
        - `sed '3 s/ERROR/CRITICAL/' log.txt` (This will replace the occurrence of it only on line no 3)
        - `sed '3,7 s/ERROR/CRITICAL/' log.txt` (This will replace the occurrence of it only on line no 3 to 7)
        - `sed -n '3,/ERROR/ p' log.txt` (You can test the region you are going to make changes using this)
    - awk
        - It is self a scripting language, similar way how we use sed
        - How patterns are defined: '(pattern){action}'
        - `awk '/ERROR/{print $0}' log.txt` (This will print the occurrences of ERROR)
        - `awk '{gsub(/ERROR/, "CRITICAL")}{print}' log.txt` (This will replace the pattern with other pattern)
        - `awk 'BEGIN {print "LOG SUMMARY\n -----------------"} {print} END {print "-----------------\nEND OF LOG SUMMARY"}' log.txt` (This will lets you to add the text beginning and ending of text before printing)
        - `awk '{print $1, $2}' log.txt` (This will pick the first and second of the data)
        - `awk -F "," '{print $1, $2}' log.txt` (You can change the delimiter using the -F flag)
        - `awk '{count[$2]++} END {print count["ERROR"]}' log.txt` (Counting the occurrences of ERROR)
        - `awk '{if ($1 > 1592345678) {print $0}}' log.txt`

- https://www.lazyvim.org/installation

# Advanced Bash
- Bash is command line interpreter language that lets you to interact with your operating system.
- The prompt in terminal is executed by kernal
