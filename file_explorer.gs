shell=get_shell
computer=shell.host_computer
current_folder=computer.File(current_path)
files=[]
folders=[]
check_perms=function(file)
    if file.has_permission("w") then return "WRX"
    if file.has_permission("r") and file.has_permission("x") then 
        return "-RX"
    else
        return "-R-"
    end if
    if file.has_permission("x") then return "--X"
end function


display_list=function(current_folder)
    print("Current Path:"+current_folder.path)
    data="Name"+" "+"Owner"+ " "+"Permissions"+" Type"
    for file in current_folder.get_files
        files.push(file)
    end for
    for folder in current_folder.get_folders
        folders.push(folder)
    end for
    for file in files
        name=file.name
        owner=file.owner
        perms=check_perms(file)
        if file.is_binary==1 then
            type="Binary"
        else
            type="File"
        end if
        data = data + char(10) + name+" "+owner+" "+perms+" "+type
    end for
    for folder in folders
        name=folder.name
        owner=folder.owner
        perms=check_perms(folder)
        data = data + char(10) + name+" "+owner+" "+perms+" Folder"
    end for
    print char(10)+format_columns(data)
end function

menu=function(options)
    n=0
    for option in options
        print n+")"+option
        n=n+1
    end for
end function
file_actions=function(file)
    clear_screen
    print "TARGETING:"+file.path
    options=[]
    if file.has_permission("w") then
        options.push("read")
        options.push("delete")
    else if file.has_permission("r") then
        options.push("read")
    end if
    menu(options)
    action=user_input("ACTION>")
    if options[action.val]=="read" or action=="read" then 
        user_input(file.get_content)
    else if options[action.val]=="delete" or action=="delete" then
        file.delete
    end if
end function

folder_actions=function(folder)
    clear_screen
    options=[]
    if folder.has_permission("w") then
        options.push("enter")
    else if folder.has_permission("r") then
        opstions.push("enter")
    end if
    print "TARGETING:"+folder.path
    menu(options)
    action=user_input("ACTION>")
    if action.val==0 or action=="enter" then
        return computer.File(folder.path)
    end if
end function

creation_actions=function(object,current_folder)
    print("You Are In:"+current_folder.path)
    options=["Create Folder","Create File"]
    menu(options)
    action=user_input("ACTION>")
    if action.val==0 or action=="create folder" then
        print "You are creating a folder called "+object + " at "+current_folder.path
        wait 3
        computer.create_folder(current_folder.path,object)
        return
    else
        print "You are creating a file called "+object + " at "+current_folder.path
        wait 3
        computer.touch(current_folder.path,object)
        return
    end if
end function

while true
    clear_screen
    files=[]
    folders=[]
    display_list(current_folder)
    object=user_input("FILE>")
    if object=="quit" or object=="exit" then exit
    if object=="reboot" then shell.launch(program_path)
    found=0
    while found==0
        if object==".." then found=1
        for folder in folders
            if folder.name==object then
                object=computer.File(folder.path)
                found=1
                break
            end if
        end for
        for file in files
            if file.name==object then
                object=computer.File(file.path)
                found=1
                break
            end if
        end for
        if found==0 then
            creation_actions(object,current_folder)
            clear_screen
            shell.launch(program_path)
        end if
    end while
    if object==".." then
        list=current_folder.path.split("/")
        if list.len==2 then 
            current_folder=computer.File("/")
            continue
        else
            list.pop
            current_folder=computer.File(list.join("/"))
            continue
        end if
    end if
    if object.is_folder==false then
        file_actions(object)
    end if
    if object.is_folder==true then
        current_folder=folder_actions(object)
        continue
    end if
end while