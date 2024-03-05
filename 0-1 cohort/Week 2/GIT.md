# Git and GitHub

## Introduction
- What is Git?
    - Free and open source version control system
- What is Version Control system?
    - A system that keeps track of our files or projects.
    - It allows you to revert selected files to a previous state, revert the entire project to a previous state, compare changes over time, see who last modified something so that we can know what might be causing a problem, or what is the issue, who made it, and when with the details.

## Types of VCS
![alt text](Git-img/image.png)
- Centralized version control system is good for small projects, not really good for big projects
![alt text](Git-img/image-1.png)

- Distributed version control system
![alt text](Git-img/image-2.png)
    - You only need internet or being connected to internet when you want to publish your changes or want to pull others changes.
    - Here the people are not dependent on each other for making the changes, they can independently work together on a single project.

- Why Git?
![alt text](Git-img/image-3.png)
![alt text](Git-img/image-4.png)
![alt text](Git-img/image-5.png)
![alt text](Git-img/image-6.png)
![alt text](Git-img/image-7.png)
![alt text](Git-img/image-8.png)
![alt text](Git-img/image-9.png)
![alt text](Git-img/image-10.png)


## Git commands
- git remote
    - `git remote -v` : Shows the remote repo connected
    - `git remote add origin REPO_URL` : Add a remote repo to local repo
    - `git push origin master`
- git commit
    - `git commit -am "message"` : You can directly commit your modified files using this.
![alt text](Git-img/image-21.png)

## Adding a SSH Keys to your GitHub Account
- `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"` :Using this you can create your own public/ private key pair 

## Git Branching
- There can be multiple people working on a project, multiple features. So, in that case you need a way to keep the main code and make a copy of the code and work on that. This is possible due to branching.
- Branching is very common thing that is used in the VCS.
- The process of making a changes from one branch to the other in a sync is called the process of merging.
- We have main branch where we keep our latest and stable code.
![alt text](Git-img/image-11.png)
![alt text](Git-img/image-12.png)
![alt text](Git-img/image-13.png)

## Git Merge Conflict
- HEAD: Branch where you execute merge command.
![alt text](Git-img/image-14.png)
![alt text](Git-img/image-15.png)
![alt text](Git-img/image-16.png)
![alt text](Git-img/image-17.png)
![alt text](Git-img/image-18.png)
![alt text](Git-img/image-19.png)
![alt text](Git-img/image-20.png)

## Git Stash
- Let's keep your changes aside for a moment and later you can work on these changes.

## Git Issues
- It is a good way to collaborate
- You can connect the issue with the PR. After merging the PR the issue associated with the branch gets automatically closed.
- You can also look at "Link PR to issue" article in GitHub Docs
![alt text](Git-img/image-22.png)

## Git Patch