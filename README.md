# WEBINF-Project

Let it be known that the following statements are guidelines and not hard-written rules. 
They may and can change over time (with or without documentation changes in this document).

## Git Conventions

1. Before you start on a new feature:
    ```
    git pull
    ```
2. When a piece of code, docs is fixed: 
    
    Add all (except .gitignore)
    ```
    git add *
    ```
    Everything from the current folder (and subfolders)
    ```
    git add .
    ```
    To add files matching the filename (i.e. `git add folder/*.ts`)
    ```
    git add filename
    ```
    Next, commit the work, if finished.
    ```
    git commit -m "follow the commit rules here"
    ```
    Else, you can stach your work as follows:
    ```
    git stash
    git pull origin master
    git stash pop
    ```
    As soon as a feature is complete, run the following **in your feature branch**
    and fix merge conflicts.
    ```
    git merge master 
    git push
    ```
3. When you want to merge local branches, run
    ```
    git merge <branch-1> <branch-2>
    ```

## Branching

### Main Branches
[source](https://stackoverflow.com/a/6065944)

The main repository will always hold two evergreen branches:

* `master`
* `stable`

The main branch should be considered `origin/master` and will be the main branch where the source code of `HEAD` always reflects a state with the latest delivered development changes for the next release. As developers, we will be branching and merging from `master`.

Consider `origin/stable` to always represent the latest code deployed to production. During day to day development, the `stable` branch will not be interacted with.

When the source code in the `master` branch is stable and has been deployed, all of the changes will be merged into `stable` and tagged with a release number.

### Supporting Branches

Supporting branches are used to aid parallel development between team members, ease tracking of features, and to assist in quickly fixing live production problems. Unlike the main branches, these branches always have a limited life time, since they will be removed eventually.

The different types of branches we may use are:
* [Feature branches](https://gist.github.com/digitaljhelms/4287848#feature-branches) (`feature-<tbd number>`) are used when developing a new feature or enhancement which has the potential of a development lifespan longer than a single deployment. When starting development, the deployment in which this feature will be released may not be known. No matter when the feature branch will be finished, it will always be merged back into the `master` branch. 
* [Bug branches](https://gist.github.com/digitaljhelms/4287848#bug-branches) (`bug-<tbd number>`) differ from feature branches only semantically. Bug branches will be created when there is a bug on the live site that should be fixed and merged into the next deployment. For that reason, a bug branch typically will not last longer than one deployment cycle. Additionally, bug branches are used to explicitly track the difference between bug development and feature development. No matter when the bug branch will be finished, it will always be merged back into `master`.
* [Hotfix branches](https://gist.github.com/digitaljhelms/4287848#hotfix-branches) (`hotfix-<tbd number>`) comes from the need to act immediately upon an undesired state of a live production version. Additionally, because of the urgency, a hotfix is not required to be be pushed during a scheduled deployment. Due to these requirements, a hotfix branch is always branched from a tagged `stable` branch. 

See the source page to read the git commands and the naming conventions.

## Commits ##

1.  Specify the type of commit:
    - `feat`: The new feature you're adding to a particular application
    - `fix`: A bug fix
    - `style`: Feature and updates related to styling
    - `refactor`: Refactoring a specific section of the codebase
    - `test`: Everything related to testing
    - `docs`: Everything related to documentation
    - `chore`: Regular code maintenance.
2.  Separate the subject from the body with a blank line.
3.  Your commit message should not contain any white-space errors.
4.  Remove unnecessary punctuation marks, remove `and` or `or` in summations with a `,`.
5.  Do not end the subject line with a `.`.
6.  Use the body to explain what changes you have made and why you made them.
7.  Do not assume the reviewer understands what the original problem was, ensure you add it.
8. Do not think your code is self-explanatory.
9. Indent content after `*`.
10. Keep the `original merge commit message`, add a body if there are major deletions.

Here are examples:
```
feat: define Path

* Define CombinedPath
* Edit SlidePath methods
* Rename JumpPath.unclearMethod to JumpPath.moreClearMethod,
  JumpPath.otherClearMethod to JumpPath.evenMoreClearMethod,
* Define read, write methods for CombinedPath, SlidePath, JumpPath
* Remove NULL_INDEX from JumpPath, SlidePath
* Change file.txt

A footer if necessary to mark this commit.
```
```
docs: add documentation to Stratego.start
```
```
chore: resolve view conflict

* Resolve BoardView
* Resolve PawnView
```

## Coding Conventions

### General

1. Write everything in English, i.e. function names, variables, ... as well as documentation.
2. Use standard Node.js conventions & golden rules: ![node.js](https://stackoverflow.com/questions/5495984/coding-style-guide-for-node-js-apps)

### Parentheses

```
    if () {
    } 
    else {
    }
```
```
    if (...)

    else
```    
```
    if () {

    } else if () {

    }
```

### Naming

lowerCamelCase: 
* variables
* functions

UpperCamelCase:
* classes
* enums
* typedefs

CAPITAL_CASE:
* constants

snake_case:
* libraries 
* packages 
* directories
* source files

### Documentation and comments

4. Document each
    - function,
        ```
        /**
        * Does something with the given variable.
        *
        * @tag you can use tags if you want
        */
        function DoSomething(varName: type1): type2 {
            ...
            return type2;
        }
        ```
    - class,
        ```
        /**
        * 
        */
        class A { ... }
        ```
        
5. Write `//TODO: ...` when something isn't finished yet.
6. Add the inline-comments infront of the unclear lines, behind if really short.
    ```
    // explanation.
    unclear line
    ```
    ```
    another unclear line // short explanation.
    ```

### Other

- Use macro's like
    ```
    isBoolean
        ? ...
        : ...
        ;
    ```
    ```
    isBoolean ? ... : ... ;
    ```

- Use `+=` when possible.
- Split functions larger than 15 rules.
- Separate Inspectors and Mutators.
