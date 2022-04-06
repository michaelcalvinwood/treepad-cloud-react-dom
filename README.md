First install the TreePadCloud server. See server README for instructions.

Before installing this client package, change the .env base url to match the url of the server.

To load all the dependencies, run:
    npm install

Then to launch the app run:
    npm start

To prepare for remote deployment, run:
    npm build

Using the App:
    login with the administrator name and password provided in the server's .env file. You do not need to provide the email address (it can be blank).

    click +Add tree to create a tree.
    Assign a tree name, and optionally choose an icon using the search bar.

    The following hotkeys are available for quickly creating and navigating branches:

    Creating/Deleting Branches
    <enter> : creates a sibling branch
    <shift><enter> : creates a child branch
    <ctrl><enter> : creates a parent branch (i.e. a sibling of the current parent)
    <shift><delete> : deletes a branch

    Navigating Branches:
    <upArrow> : move up to next displayed branch
    <downArray> : move down to the next display branch

    Moving Branches:
    <shift><upArrow> : move branch up
    <shift><downArrow> : move branch down
    <shift><right> : make branch a child of the previous sibling (still needs to be debugged -- same goes for corresponding 'indent' button)
    <shift><left> : make branch a sibling of the current parent (still needs to be debugged -- same goes for corresponding 'outdent' button)

    The following modules are currently operational:
        notes
        images
        videos

    IMPORTANT: at present, you must click save to upload the module content to the server. Auto-save will be added soon!


    
