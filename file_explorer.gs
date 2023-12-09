shell=get_shell
computer=shell.host_computer
current_path=computer.File("/home/quinn")
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


display_list=function(current_path)
    print("Current Path:"+current_path.path)
    data="Name"+" "+"Owner"+ " "+"Permissions"+" Type"
    for file in current_path.get_files
        files.push(file)
    end for
    for folder in current_path.get_folders
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

menu=function(options,current_path)
    clear_screen
    n=0
    for option in options
        print n+")"+option
    end for
end function
while true
    clear_screen
    files=[]
    folders=[]
    display_list(current_path)
    object=user_input("FILE>")
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
    end while
    if object==".." then
        list=current_path.path.split("/")
        if list.len==2 then 
            current_path=computer.File("/")
            continue
        else
            list.pop
            current_path=computer.File(list.join("/"))
            continue
        end if
    end if
    action=user_input("ACTION>")
    if object.is_folder==false and action=="read" then
        user_input(file.get_content,0,1)
    end if
    if object.is_folder==true and action=="enter" then
        current_path=computer.File(object.path)
        continue
    end if
end while